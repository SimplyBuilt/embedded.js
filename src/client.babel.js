!function(win){
    const MutationObserver = win.MutationObserver || win.WebKitMutationObserver;
    const doc = win.document;

    const listen = 'attachEvent' in win ?
        (element, event, callback) => element.attachEvent(`on${event}`, callback) :
        (element, event, callback) => element.addEventListener(event, callback, false);

    let id, height, passes, timer;

    function poll(){
        return win.setTimeout(function(){
            if (passes++ > 60) // 15s to settle down
                return;

            if (height != doc.body.scrollHeight)
                return postHeight();
        }, 250);
    }

    function postHeight(){
        if (timer != undefined)
            win.clearTimeout(timer);

        passes = 0;
        height = doc.body.scrollHeight;
        timer  = poll();

        win.parent.postMessage({
            id: id, height: height
        }, '*');
    }

    listen(win, 'message', (ev) => {
        if (ev.data == undefined || ev.data.id == undefined)
            return;

        if (id == undefined){ // first message -- initialize observers
            if (MutationObserver != undefined){
                let observer = new MutationObserver(postHeight);

                observer.observe(doc, {
                    attributes: true, subtree: true, childList: true
                });
            }
        }

        // Always setup local ID
        id = ev.data.id;

        // Start post height relay
        postHeight();
    });
}(window || this);
