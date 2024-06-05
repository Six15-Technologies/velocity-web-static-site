//This is a Velocity Script which should be added to the project (i.e. copy pasted into the editor).
//It has no arguments, and should have six15_hud_getSendTextData.js added as a resource.
//It should be linked to the "session" scope.

var six15_app_package_name = "com.six15.st1_connect"

Action.launch({
    package: six15_app_package_name,
    class: "com.six15.intent_interface.IntentInterfaceActivity",
    action: "com.six15.hudservice.ACTION_START_INTENT_SERVICE"
});

var firstMessage = true

function updateHudScreen() {
    View.evaluateJavascript("typeof six15_hud_getSendRegionData == 'function' ? six15_hud_getSendRegionData() : null", function (jsonResult) {
        if (!jsonResult) {
            //No message to send, don't send anything.
            return
        }

        var message = JSON.parse(jsonResult);
        if (!message) {
            //No extras given, don't send anything.
            return
        }
        message.push({ name: "smart_web_version", value: 1, type: "integer" })
        //Even though we start the service at the top of this file,
        //we use start service again the first time an image is shown.
        //This helps avoid a race condition where a broadcast is sent before the service is running
        //We don't use launch every time so an end user can manually stop the intent interface and not
        //have it constantly restarted against their will.
        if (firstMessage) {
            Action.launch({
                package: six15_app_package_name,
                class: "com.six15.intent_interface.IntentInterfaceActivity",
                action: "com.six15.hudservice.ACTION_SEND_REGIONS",
                extras: message
            });
        } else {
            Action.sendBroadcast({
                action: "com.six15.hudservice.ACTION_SEND_REGIONS",
                extras: message
            });
        }
        firstMessage = false;
    });
}

View.insertJavaScript("six15_hud_getSendRegionData.js", "HEAD", "TOP", { 'MATCH-SOURCE': '', 'MATCH-URL': '' });
setInterval(updateHudScreen, 30)