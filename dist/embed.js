'use strict';

!function (win) {
    if ('Embeds' in win) // API can loaded more than once (but shouldn't be)
        return Embeds.scan();

    var doc = win.document;
    var Embeds = win.Embeds = [];
    var IFrames = Embeds.IFrames = [];

    var listen = 'attachEvent' in win ? function (element, event, callback) {
        return element.attachEvent('on' + event, callback);
    } : function (element, event, callback) {
        return element.addEventListener(event, callback);
    };

    function beginRelay(iframe) {
        iframe.contentWindow.postMessage({
            id: iframe.id
        }, '*');
    }

    function onMessage(ev) {
        var data = ev.data;

        if (ev.data.id == undefined || ev.data.height == undefined) return;

        if (!/^embedjs-/.test(ev.data.id)) return;

        var iframe = IFrames.filter(function (element) {
            if (element.id == ev.data.id) return element;
        }).pop();

        if (iframe != undefined) {
            iframe.height = data.height;
        }
    }

    Embeds.scan = function () {
        Array.from(doc.querySelectorAll('script[data-location]')).forEach(function (scriptEmbed) {
            if (Embeds.indexOf(scriptEmbed) > -1) return;

            var src = scriptEmbed.dataset.location;
            var iframe = doc.createElement('IFRAME');

            iframe.id = 'embedjs-' + +new Date() + '-' + Math.round(Math.random() * 1e12);
            iframe.src = src;
            iframe.width = '100%';

            Embeds.push(scriptEmbed);
            IFrames.push(iframe);

            scriptEmbed.parentElement.insertBefore(iframe, scriptEmbed);

            listen(iframe, 'load', function () {
                beginRelay(iframe);
            });
        });
    };

    listen(win, 'message', onMessage);

    if ('readyState' in doc) listen(doc, 'readystatechange', Embeds.scan);else listen(win, 'load', Embeds.scan);
}(window || undefined);