!function(win){
    const doc = win.document;

    const Embeds  = [];
    const IFrames = [];

    const listen = 'attachEvent' in win ?
        (element, event, callback) => element.attachEvent(`on${event}`, callback) :
        (element, event, callback) => element.addEventListener(event, callback, false);

    function beginRelay(iframe){
        iframe.height = undefined;

        win.setTimeout(() => {
            iframe.contentWindow.postMessage({
                id: iframe.id,
            }, '*');
        }, 1);
    }

    function onMessage(ev){
        const { data } = ev;

        if (data.id == undefined || data.height == undefined)
            return;

        if (!/^embedjs-/.test(data.id))
            return;

        const iframe = IFrames.filter(function(element){
            if (element.id == data.id)
                return element;
        }).pop();

        if (iframe != undefined)
            iframe.height = data.height;
    }

    function onLoad(){
        Array.from(doc.querySelectorAll('script[data-location]')).forEach((scriptEmbed) => {
            if (Embeds.indexOf(scriptEmbed) > -1)
                return;

            const src = scriptEmbed.dataset.location;
            const iframe = doc.createElement('IFRAME');

            iframe.id  = `embedjs-${+new Date}-${Math.round(Math.random() * 1e12)}`;
            iframe.src = src;
            iframe.width = '100%';

            Embeds.push(scriptEmbed);
            IFrames.push(iframe);

            scriptEmbed.parentElement.insertBefore(iframe, scriptEmbed);

            listen(iframe, 'load', () => beginRelay(iframe));
        });
    }

    const onResize = (() => {
        let timer;

        return () => {
            win.clearTimeout(timer);

            timer = win.setTimeout(() => {
                IFrames.forEach(beginRelay);
            }, 250);
        };
    })();

    listen(win, 'message', onMessage);
    listen(win, 'resize', onResize);
    listen(win, 'orientationchange', onResize);

    if ('readyState' in doc) {
        let loaded = false;

        listen(doc, 'readystatechange', () => {
            if (loaded)
                return;

            if (doc.readyState == 'interactive' || doc.readyState == 'complete'){
                loaded = true;

                onLoad();
            }
        });
    } else {
        listen(win, 'load', onLoad);
    }
}(window || this);
