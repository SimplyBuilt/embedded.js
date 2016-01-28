'use strict';

!function (win) {
    var MutationObserver = win.MutationObserver || win.WebKitMutationObserver;
    var doc = win.document;

    var listen = 'attachEvent' in win ? function (element, event, callback) {
        return element.attachEvent('on' + event, callback);
    } : function (element, event, callback) {
        return element.addEventListener(event, callback);
    };

    var id = undefined,
        height = undefined,
        passes = undefined,
        timer = undefined;

    function poll() {
        return win.setTimeout(function () {
            if (passes++ > 60) // 15s to settle down
                return;

            if (height != doc.body.scrollHeight) return postHeight();
        }, 250);
    }

    function postHeight() {
        if (timer != undefined) win.clearTimeout(timer);

        passes = 0;
        height = doc.body.scrollHeight;
        timer = poll();

        win.parent.postMessage({
            id: id, height: height
        }, '*');
    }

    listen(win, 'message', function (ev) {
        if (ev.data == undefined || ev.data.id == undefined) return;

        if (id == undefined) {
            // first message -- initialize observers
            if (MutationObserver != undefined) {
                var observer = new MutationObserver(postHeight);

                observer.observe(doc, {
                    attributes: true, subtree: true, childList: true
                });
            }
        }

        // Always setup local ID
        id = ev.data.id;

        // Start post height relay
        postHeight();
    }, false);
}(window || undefined);