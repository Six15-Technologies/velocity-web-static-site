//This is a JavaScript file which is injected into every website.
//It should be added as a Velocity resource under the six15_hud_sendRegion_on_scope.js script.
//This files name should always be six15_hud_getSendRegionData.js to match what six15_hud_sendRegion_on_scope.js expects.

// IN_VELOCITY = false // Use for copy/paste into browser console.
IN_VELOCITY = true // Use for Velocity.


function absolutePosition(el) {
    let left = 0, top = 0, width = 0, height = 0;
    let offsetBase = absolutePosition.offsetBase;
    if (!offsetBase && document.body) {
        offsetBase = absolutePosition.offsetBase = document.createElement('div');
        offsetBase.style.cssText = 'position:absolute;left:0;top:0';
        document.body.appendChild(offsetBase);
    }
    if (el && el.ownerDocument === document && 'getBoundingClientRect' in el && offsetBase) {
        var boundingRect = el.getBoundingClientRect();
        var baseRect = offsetBase.getBoundingClientRect();
        left = boundingRect.left - baseRect.left;
        top = boundingRect.top - baseRect.top;
        width = boundingRect.right - boundingRect.left;
        height = boundingRect.bottom - boundingRect.top;
    }
    return {
        left: Math.floor(left),
        top: Math.floor(top),
        right: Math.ceil(left + width),
        bottom: Math.ceil(top + height),
        raw_height: height
    };
}

function elementMightBeVisible(ele) {
    return ele.offsetParent !== null && ele.offsetWidth !== 0 && ele.offsetHeight !== 0

}

function elementIsVisible(ele) {
    if (!ele) { return true; }

    const style = window.getComputedStyle(ele);

    const isVisibilityHidden = style.visibility === 'hidden';
    const isDisplayNone = style.display === 'none';
    const isZeroFontSize = style.fontSize === '0';
    const isZeroOpacity = style.opacity === '0';
    const isQuestionableClip = style.clip !== 'auto' && ele.offsetHeight < 2

    if (isVisibilityHidden || isDisplayNone || isZeroFontSize || isZeroOpacity || isQuestionableClip) {
        return false;
    }
    return elementIsVisible(ele.parentElement);
}

function inputContainsText(input) {
    // console.log(input.type)
    if (input.type == "text") {
        return true
    }
    if (input.value == "") {
        return false
    }
    return true
}
function elementContainsText(ele) {
    child = ele.firstChild
    while (child) {
        if (child.nodeType == Node.TEXT_NODE) {
            if (child.data && child.data.trim() != "") {
                return true
            }
        } else if (child.nodeType == Node.ELEMENT_NODE) {
            let pName = ele.nodeName;
            if ((pName == "P" || pName == "PRE" || pName == "STRONG")) {
                return true
            }
        }
        child = child.nextSibling;
    }
    return false
}

function element2RegionInfo(ele) {
    let child = ele.firstChild
    let pName = ele.nodeName;
    texts = [];
    while (child) {
        if (child.nodeType == Node.TEXT_NODE) {
            if ((pName == "PRE")) {
                // For pre, newlines in the HTML ARE shown.
                texts.push(child.data);
            } else {
                // Everything else newlines in the HTML are NOT shown.
                texts.push(child.data.replace(/\s+/g, " "));
            }
        } else if (child.nodeType == Node.ELEMENT_NODE) {
            if (pName == "P" || pName == "STRONG") {
                // For p, newlines in the HTML are NOT shown.
                texts.push(child.innerText.replace(/\s+/g, " "));
            } else if ((pName == "PRE")) {
                // For pre, newlines in the HTML ARE shown.
                texts.push(child.innerText);
            }
        }
        child = child.nextSibling;
    }
    var text = texts.join("");


    text = text.trim();

    rect = absolutePosition(ele)
    result = {}
    if (IN_VELOCITY) {
        result["l"] = rect.left
        result["t"] = rect.top
        result["r"] = rect.right
        result["b"] = rect.bottom
    } else {
        result["ele"] = ele;
    }
    result["text"] = text

    return result;
}

function input2RegionInfo(input) {
    text = input.value.trim()
    rect = absolutePosition(input)
    result = {}
    if (IN_VELOCITY) {
        result["l"] = rect.left
        result["t"] = rect.top
        result["r"] = rect.right
        result["b"] = rect.bottom
    } else {
        result["ele"] = input;
    }
    result["text"] = text

    return result;
}

function drawRectangleAroundResults(results) {
    let canvas = document.getElementById("six15_debug_canvas")
    let attachCanvasToBody = false;
    let useFixed = false
    if (canvas == null) {
        canvas = document.createElement("canvas");
        canvas.id = "six15_debug_canvas"
        canvas.style.left = 0
        canvas.style.top = 0
        canvas.style.right = 0
        canvas.style.bottom = 0
        if (useFixed) {
            canvas.style.position = "fixed"
        } else {
            document.body.style.position = "relative"
            canvas.style.position = "absolute"

        }
        attachCanvasToBody = true;
        setInterval(function () {
            if (canvas.style.display === 'none') {
                canvas.style.display = 'block';
            } else {
                canvas.style.display = 'none';
            }
        }, 3000);
    }
    if (useFixed) {
        canvas.width = document.documentElement.clientWidth
        canvas.height = document.documentElement.clientHeight
    } else {
        canvas.width = document.body.scrollWidth
        canvas.height = document.body.scrollHeight
    }

    ctx = canvas.getContext("2d");

    ctx.fillStyle = "rgba(128, 128, 128, 0.8)";

    if (!IN_VELOCITY) {
        results.forEach(result => {
            rect = absolutePosition(result["ele"])
            result["l"] = rect.left
            result["t"] = rect.top
            result["r"] = rect.right
            result["b"] = rect.bottom
        })
    }

    results.forEach(result => {
        ctx.fillRect(result.l, result.t, result.r - result.l, result.b - result.t);
    })
    ctx.font = "10px Mono";
    ctx.fillStyle = "rgba(255, 0, 0)";
    results.forEach(result => {
        // text = result.text.replace(/\s+/g, " ")// Replace all whitespace with a single space
        text = result.text
        text_x = result.l + 2
        text_y = result.t + 10 + 2
        ctx.save()
        ctx.rect(result.l, result.t, result.r - result.l, result.b - result.t);
        ctx.clip()
        lines = text.split("\n")
        lines.forEach((line, index) => {
            ctx.fillText(line, text_x, text_y + index * 10);
        })
        ctx.restore()
    })
    if (attachCanvasToBody) {
        document.body.appendChild(canvas);
    }

}

function convertResultsToString(all_results) {
    return JSON.stringify(all_results);
}

// If reCalculateResults is true, cachedElementsResult and/or cachedInputsResult will be re-calculated
// if they are null.
reCalculateResults = true;
cachedElementsResult = null;
cachedInputsResult = null;

// These flags keep track if event listeners have already been setup once.
hasSetMutObs = false;
hasSetWindowResize = false;

function clearFullCache() {
    console.log("Clear!")
    cachedInputsResult = null;
    cachedElementsResult = null;
    reCalculateResults = true;
}

function clearInputCache() {
    console.log("Clear Input!")
    cachedInputsResult = null;
    reCalculateResults = true;
}

function attachInputChangeListener(input) {
    input.addEventListener('input', clearInputCache);
    input.addEventListener('propertychange', clearInputCache); // for IE8
}

function six15_hud_getSendRegionData() {
    if (reCalculateResults == false) {
        return null;
    }
    if (hasSetMutObs == false) {
        let mutObs = new window.MutationObserver(clearFullCache)
        mutObs.observe(document.body, {
            childList: true, subtree: true, characterData: true, attributeFilter: [
                "expanded",
                "visibility",
                "display",
                "fontSize",
                "opacity",
                "clip",
                "offsetHeight",
            ]
        })

        hasSetMutObs = true
    }
    if (hasSetWindowResize == false) {
        window.addEventListener('resize', clearFullCache, true);
        hasSetWindowResize = true;
    }


    if (cachedElementsResult == null) {

        let sel = "body *" +
            ":not(body *[class|='footer'] *,    body *[class|='footer'])" +
            ":not(body *[class|='copyright'] *, body *[class|='copyright'])" +
            ":not(body *[id|='footer'] *,       body *[id|='footer'])" +
            ":not(body *[id|='copyright'] *,    body *[id|='copyright'])" +
            ":not(body *[role|='navigation'] *, body *[role|='navigation'])" +
            ":not(body footer *, body footer)" +
            ":not(body nav *, body nav)" +
            ":not(body p *, body pre *, body strong *)" + //Merge b,a,i,span into their descendant p by removing them here and using p's innerText
            ":not(empty):not(script):not(noscript):not(style)";
        // clear();
        // console.log(sel);

        let elements = Array.from(document.querySelectorAll(sel))
            .filter(ele => elementMightBeVisible(ele) && elementContainsText(ele) && elementIsVisible(ele));

        cachedElementsResult = elements.map(ele => element2RegionInfo(ele))
    }
    if (cachedInputsResult == null) {
        let inputs = Array.from(document.querySelectorAll("body input"))
            .filter(input => elementMightBeVisible(input) && inputContainsText(input) && elementIsVisible(input))
        inputs.forEach(input => attachInputChangeListener(input))
        cachedInputsResult = inputs.map(input => input2RegionInfo(input))
    }
    let all_results = cachedElementsResult.concat(cachedInputsResult)
    reCalculateResults = false;

    if (IN_VELOCITY) {
        json_result = convertResultsToString(all_results)
        // console.log("Json LEN:" + json_result.length)
        // drawRectangleAroundResults(all_results)
        result = [
            { name: 'regions_json', value: json_result, type: 'string' }
        ];
        if (json_result.length < 200000) {
            return result;
        } else {
            return null;
        }
    } else {
        console.log(all_results)
        drawRectangleAroundResults(all_results)
        return null;
    }
}
if (!IN_VELOCITY) {
    // console.clear();
    setInterval(six15_hud_getSendRegionData, 30)
}