export default function getViewportSize(w) {

    // Use the specified window or the current window if no argument
    w = w || window;

    // This works for all browsers except IE8 and before
    if (w.innerWidth != null) return { width: w.innerWidth, height: w.innerHeight };

    // For IE (or any browser) in Standards mode
    var d = w.document;
    if (document.compatMode == "CSS1Compat")
        return {
            width: d.documentElement.clientWidth,
            height: d.documentElement.clientHeight
        };

    // For browsers in Quirks mode
    return { width: d.body.clientWidth, height: d.body.clientHeight };

}