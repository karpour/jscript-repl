var history = new Array("");
var HISTORY_SIZE = 8;
var hPtr = null;

var help = "JScript Shell\nUse up/down buttons for history\ntype clear() to clear output";

Array.isArray = function (a) {
    return a.constructor == Array;
};

function logRaw(text) {
    tb.innerHTML += text + "<br>";
}

function log(t) {
    tb.innerHTML += htmlEncode(t) + "<br>";
}

function logValue(t) {
    if (typeof (t) == "object") {
        if (t == null) {
            logRaw("<tt>null</tt>");
        } else if (t.constructor == Array) {
            logArray(t);
        } else {
            logObject(t);
        }
    } else if (t != null) {
        if (typeof (t) == "string") {
            logRaw("<tt>\"" + htmlEncode(t) + "\"</tt>");
        } else if (typeof (t) == "number") {
            logRaw("<tt>" + t + "</tt>");
        } else {
            tb.innerHTML += htmlEncode(t) + "<br>";
        }
    }
}

function logObject(obj) {
    var o = "{<br>";
    for (var name in obj) {
        if (name == "external" || name == "dataFld" || name == "dataFormatAs" || name == "dataSrc") {
            o += "&nbsp;&nbsp;<var>" + name + "</var>: <b>[native]</b>,<br>";
            continue;
        }
        val = obj[name];
        type = typeof (val);
        if (type == "object") {
            if (String(val) == "null") {
                t = "null";
            } else {
                t = "<b>[object]</b>";
            }
        } else if (type == "number") {
            t = "<tt>" + val + "</tt>";

        } else if (type == "string") {
            t = "<tt>\"" + htmlEncode(val) + "\"</tt>";

        } else if (type == "function") {
            t = "<b>[function]</b>";
        }
        o += "&nbsp;&nbsp;<var>" + name + "</var>: " + t + ",<br>";
    }
    o += "}<br>";
    tb.innerHTML += o;
}

function logArray(arr) {
    var emptyItems = 0;
    var o = "[<br>";
    for (var i = 0; i < arr.length; i++) {
        var val = arr[i];
        type = typeof (val);
        if (type == "undefined") {
            emptyItems++;
            continue;
        }
        if (emptyItems) {
            o += "&nbsp;&nbsp;&lt;" + emptyItems + " empty items&gt;<br>";
            emptyItems = 0;
        }
        if (type == "object") {
            if (String(val) == "null") {
                t = "null";
            } else {
                t = "<b>[object]</b>";
            }
        } else if (type == "number") {
            t = "<tt>" + val + "</tt>";

        } else if (type == "string") {
            t = "<tt>\"" + htmlEncode(val) + "\"</tt>";

        } else if (type == "function") {
            t = "<b>[function]</b>";
        }
        o += "&nbsp;&nbsp;" + t + ",<br>";
    }
    o += "]<br>";
    tb.innerHTML += o;
}

function htmlEncode(s) {
    s = String(s);

    var r = "";
    var i, ch;

    for (i = 0; i < s.length; i++) {
        ch = s.charAt(i);

        if (ch == "&")
            r += "&amp;";
        else if (ch == "<")
            r += "&lt;";
        else if (ch == ">")
            r += "&gt;";
        else if (ch == "\"")
            r += "&quot;";
        else if (ch == "\n")
            r += "<br>";
        else
            r += ch;
    }

    return r;
}

function htmlEncode2(s) {
    s = String(s);

    var r = "";
    var i, ch;

    for (i = 0; i < s.length; i++) {
        ch = s.charAt(i);
        switch (ch) {
            case "&":
                r += "&amp;";
                break;
            case "<":
                r += "&lt;";
                break;
            case "&":
                r += "&gt;";
                break;
            case "\"":
                r += "&quot;";
                break;
            case "\n":
                r += "<br>";
                break;
            default:
                r += ch;
        }
    }

    return r;
}

var mapping = new Object();
mapping["&"] = "&amp;";
mapping["<"] = "&lt;";
mapping[">"] = "&gt;";
mapping["\""] = "&quot;";
mapping["\n"] = "<br>";

function htmlEncode3(s) {
    s = String(s);

    var r = "";
    var i, ch;

    for (i = 0; i < s.length; i++) {
        ch = s.charAt(i);
        var c = mapping[ch];
        if (c) r += c;
        else r += ch;
    }

    return r;
}

function addHistory(code) {
    if (code == "")
        return;

    if (history[history.length - 1] !== code)
        history[history.length] = code;

    if (history.length > HISTORY_SIZE) {
        for (i = 1; i < history.length; i++) {
            history[i - 1] = history[i];
        }
        history.length = HISTORY_SIZE;
    }
}

function loadCookie() {
    if (document.cookie && document.cookie.length > 2)
        history = unescape(document.cookie.substring(2)).split("|");
}

function saveCookie() {
    //document.cookie = null;
    document.cookie = "h=" + escape(history.join("|"));
}

function clear() {
    tb.innerHTML = "";
}

function showHistory() {
    var i;

    for (i = 0; i < history.length; i++) {
        log(i + ": " + history[i]);
    }
}

function runCommand() {
    var code = cb.value;
    hPtr = null;
    addHistory(code);
    log("> " + code);
    if (code.charAt(0) == '{') code = '(' + code + ')';
    var result = eval(code);
    logValue(result);
    cb.value = "";
    cb.focus();
    document.body.scrollTop = document.body.scrollHeight;
}

function keyHandler() {
    //log("Keycode: " + window.event.keyCode)
    if (window.event.keyCode == 13) {
        runCommand();
        return false;
    } else if (window.event.keyCode == 38) { // Up
        if (hPtr == null) {
            showHistoryItem(history.length - 1);
        } else if (hPtr > 0) {
            showHistoryItem(hPtr - 1);
        }
    } else if (window.event.keyCode == 40) { // Down
        if (hPtr !== null && hPtr < history.length - 1) {
            showHistoryItem(hPtr + 1);
        } else {
            cb.value = "";
            hPtr = null;
        }
    }
    return true;
}

function showHistoryItem(i) {
    hPtr = i;
    cb.value = history[i];
    r = cb.createTextRange();
    r.collapse(false);
    r.select();
}

function handleError(m, url, line) {
    logRaw("<span>Error: " + m + " (" + line + ")</span>");
    cb.value = "";
    hPtr = null;
    document.body.scrollTop = document.body.scrollHeight;

    return true;
}

window.onunload = saveCookie;
window.onerror = handleError;
window.onload = function () {
    window.cb = document.all.commandbox;
    window.tb = document.all.textbox;
    window.console = new Object();
    window.console.log = log;
    loadCookie();
    cb.focus();
    logRaw("JScript Shell 0.2");
    logRaw(window.navigator.appName + " " + window.navigator.appVersion);
    logRaw(ScriptEngine() + " v" + ScriptEngineMajorVersion() + "." + ScriptEngineMinorVersion() + "." + ScriptEngineBuildVersion());
};