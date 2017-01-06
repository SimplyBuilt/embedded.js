'use strict';

!function (win) {
    var doc = win.document;

    var Embeds = [];
    var IFrames = [];

    var listen = 'attachEvent' in win ? function (element, event, callback) {
        return element.attachEvent('on' + event, callback);
    } : function (element, event, callback) {
        return element.addEventListener(event, callback, false);
    };

    function beginRelay(iframe) {
        iframe.height = undefined;

        win.setTimeout(function () {
            iframe.contentWindow.postMessage({
                id: iframe.id
            }, '*');
        }, 1);
    }

    function onMessage(ev) {
        var data = ev.data;


        if (data.id == undefined || data.height == undefined) return;

        if (!/^embedjs-/.test(data.id)) return;

        var iframe = IFrames.filter(function (element) {
            if (element.id == data.id) return element;
        }).pop();

        if (iframe != undefined) iframe.height = data.height;
    }

    function onLoad() {
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
                return beginRelay(iframe);
            });
        });
    }

    var onResize = function () {
        var timer = void 0;

        return function () {
            win.clearTimeout(timer);

            timer = win.setTimeout(function () {
                IFrames.forEach(beginRelay);
            }, 250);
        };
    }();

    listen(win, 'message', onMessage);
    listen(win, 'resize', onResize);
    listen(win, 'orientationchange', onResize);

    if ('readyState' in doc) {
        (function () {
            var loaded = false;

            listen(doc, 'readystatechange', function () {
                if (loaded) return;

                if (doc.readyState == 'interactive' || doc.readyState == 'complete') {
                    loaded = true;

                    onLoad();
                }
            });
        })();
    } else {
        listen(win, 'load', onLoad);
    }
}(window || undefined);