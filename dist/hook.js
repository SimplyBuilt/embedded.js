'use strict';

!function (win) {
    var doc = win.document;

    if (doc.querySelector('script#embedjs') == null) {
        var script = doc.createElement('script');

        var apiMeta = doc.querySelector('meta[name="embedjs-api"]');
        var apiScript = doc.querySelector('script[data-api]');

        var src = apiMeta != null ? apiMeta.content : apiScript != null ? apiScript.dataset.api : null;

        if (src == null) throw 'API URL Unknown';

        script.id = 'embedjs';
        script.src = src;

        doc.head.appendChild(script);
    }
}(window || undefined);