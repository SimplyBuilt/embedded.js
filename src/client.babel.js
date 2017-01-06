!function(win){
    const MutationObserver = win.MutationObserver || win.WebKitMutationObserver;
    const doc = win.document;

    const listen = 'attachEvent' in win ?
        (element, event, callback) => element.attachEvent(`on${event}`, callback) :
        (element, event, callback) => element.addEventListener(event, callback, false);

    let id, height, passes, timer;

    function poll(){
        return win.setTimeout(function(){
            const newHeight = doc.body.scrollHeight;

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

    function startPoll(){
        if (timer != undefined)
            win.clearTimeout(timer);

        passes = 0;
        height = doc.body.scrollHeight;
        timer  = poll();
    }

    function postHeight(){
        win.parent.postMessage({ id, height }, '*');
    }

    listen(win, 'message', (ev) => {
        if (ev.data == undefined || ev.data.id == undefined)
            return;

        if (id == undefined){ // first message -- initialize observers
            if (MutationObserver != undefined){
                let observer = new MutationObserver(startPoll);

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
}(window || this);
