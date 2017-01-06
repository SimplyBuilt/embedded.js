'use strict';

!function (win) {
    var MutationObserver = win.MutationObserver || win.WebKitMutationObserver;
    var doc = win.document;

    var listen = 'attachEvent' in win ? function (element, event, callback) {
        return element.attachEvent('on' + event, callback);
    } : function (element, event, callback) {
        return element.addEventListener(event, callback, false);
    };

    var id = void 0,
        height = void 0,
        passes = void 0,
        timer = void 0;

    function poll() {
        return win.setTimeout(function () {
            var newHeight = doc.body.scrollHeight;

            if (passes++ > 60) // 15s to settle down (60 * 250msec)
                return;

            // Poll again and wait for height to settle down
            if (height != newHeight) {
                poll();
                return;
            }

            // Height has now settled down
            postHeight();
        }, 250);
    }

    function startPoll() {
        if (timer != undefined) win.clearTimeout(timer);

        passes = 0;
        height = doc.body.scrollHeight;
        timer = poll();
    }

    function postHeight() {
        win.parent.postMessage({ id: id, height: height }, '*');
    }

    listen(win, 'message', function (ev) {
        if (ev.data == undefined || ev.data.id == undefined) return;

        if (id == undefined) {
            // first message -- initialize observers
            if (MutationObserver != undefined) {
                var observer = new MutationObserver(startPoll);

                observer.observe(doc, {
                    attributes: true, subtree: true, childList: true
                });
            }
        }

        // Always setup local ID
        id = ev.data.id;

        // Start post height relay
        startPoll();
    });
}(window || undefined);