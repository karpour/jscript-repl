JSON = new Object();

JSON.stringify = function (value) {
    var t = typeof value;

    if (value === null)
        return "null";

    if (t == "string")
        return quote(value);

    if (t == "number")
        return isFinite(value) ? String(value) : "null";

    if (t == "boolean")
        return String(value);

    if (t == "undefined")
        return "null";

    if (t == "object") {
        var i;
        var s;
        var first;

        /* Array */
        if (value.constructor == Array) {
            s = "[";
            first = 1;

            for (i = 0; i < value.length; i++) {
                if (!first)
                    s += ",";

                s += JSON.stringify(value[i]);
                first = 0;
            }

            s += "]";
            return s;
        }

        /* Object */
        s = "{";
        first = 1;

        for (i in value) {
            if (!first)
                s += ",";

            s += quote(String(i));
            s += ":";
            s += stringify(value[i]);

            first = 0;
        }

        s += "}";
        return s;
    }

    return "null";
};

JSON.parse = function (value) {
    return eval('(' + value + ')');
};

function quote(str) {
    var i;
    var c;
    var s = "\"";

    for (i = 0; i < str.length; i++) {
        c = str.charAt(i);

        if (c == "\\")
            s += "\\\\";
        else if (c == "\"")
            s += "\\\"";
        else if (c == "\b")
            s += "\\b";
        else if (c == "\f")
            s += "\\f";
        else if (c == "\n")
            s += "\\n";
        else if (c == "\r")
            s += "\\r";
        else if (c == "\t")
            s += "\\t";
        else
            s += c;
    }

    s += "\"";
    return s;
}