!function(win){
    if ('Embeds' in win) // API can loaded more than once (but shouldn't be)
        return Embeds.scan();

    const doc = win.document;
    const Embeds  = (win.Embeds = []);
    const IFrames = (Embeds.IFrames = []);

    const listen = 'attachEvent' in win ?
        (element, event, callback) => element.attachEvent(`on${event}`, callback) :
        (element, event, callback) => element.addEventListener(event, callback, false);

    function beginRelay(iframe){
        iframe.contentWindow.postMessage({
            id: iframe.id,
        }, '*');
    }

    function onMessage(ev){
        let data = ev.data;

        if (ev.data.id == undefined || ev.data.height == undefined)
            return;

        if (!/^embedjs-/.test(ev.data.id))
            return;

        let iframe = IFrames.filter(function(element){
            if (element.id == ev.data.id)
                return element;
        }).pop();

        if (iframe != undefined){
            iframe.height = data.height;
        }
    }

    Embeds.scan = () => {
        Array.from(doc.querySelectorAll('script[data-location]')).forEach((scriptEmbed) => {
            if (Embeds.indexOf(scriptEmbed) > -1)
                return;

            let src = scriptEmbed.dataset.location;
            let iframe = doc.createElement('IFRAME');

            iframe.id  = `embedjs-${+new Date}-${Math.round(Math.random() * 1e12)}`;
            iframe.src = src;
            iframe.width = '100%';

            Embeds.push(scriptEmbed);
            IFrames.push(iframe);

            scriptEmbed.parentElement.insertBefore(iframe, scriptEmbed);

            listen(iframe, 'load', () => { beginRelay(iframe) });
        });
    };

    listen(win, 'message', onMessage);

    if ('readyState' in doc) listen(doc, 'readystatechange', Embeds.scan);
    else listen(win, 'load', Embeds.scan);
}(window || this);
