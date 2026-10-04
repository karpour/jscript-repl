function fetch(url, options, success, failure) {
    var xhr = null;
    var method = "GET";
    var body = null;
    var headers = null;

    if (options) {
        if (options.method) method = options.method;
        if (options.body) body = options.body;
        if (options.headers) headers = options.headers;
    }

    xhr = new ActiveXObject("Microsoft.XMLHTTP");

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
                if (success) {
                    success(
                        xhr.responseText,
                        xhr.status,
                        xhr.getAllResponseHeaders()
                    );
                }
            } else {
                if (failure) {
                    failure(
                        xhr.status,
                        xhr.responseText
                    );
                }
            }
        }
    };

    xhr.open(method, url, 1);

    if (headers) {
        for (var h in headers) {
            xhr.setRequestHeader(h, headers[h]);
        }
    }

    xhr.send(body);
}