!function(win){
    let doc  = win.document;

    if (doc.querySelector('script#embedjs') == null){
        let script = doc.createElement('script');

        let apiMeta   = doc.querySelector('meta[name="embedjs-api"]');
        let apiScript = doc.querySelector('script[data-api]');

        let src = apiMeta != null ?
            apiMeta.content : apiScript != null ?
            apiScript.dataset.api : null;

        if (src == null)
            throw 'API URL Unknown';

        script.id = 'embedjs';
        script.src = src;

        doc.head.appendChild(script);
    }
}(window || this);
