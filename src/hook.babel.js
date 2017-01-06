!function(win){
    const doc = win.document;

    if (doc.querySelector('script#embedjs') == null){
        const script = doc.createElement('script');

        const apiMeta   = doc.querySelector('meta[name="embedjs-api"]');
        const apiScript = doc.querySelector('script[data-api]');

        const src = apiMeta != null ?
            apiMeta.content : apiScript != null ?
            apiScript.dataset.api : null;

        if (src == null)
            throw 'API URL Unknown';

        script.id = 'embedjs';
        script.src = src;

        doc.head.appendChild(script);
    }
}(window || this);
