//This is a Velocity Script which should be added to the project (i.e. copy pasted into the editor).
//It has no arguments, and should have six15_hud_getSendTextData.js added as a resource.
//It should be linked to the "session" scope.

var six15_app_package_name = "com.six15.st1_connect"

Action.launch({
    package: six15_app_package_name,
    class: "com.six15.intent_interface.IntentInterfaceActivity"
});

firstMessage = true

function injectHudScreen(event) {
    var scopeName = event.scope;

    if (!scopeName.startsWith("@")) {
        // View.toast("Skipping injection for scope:" + scopeName);
        return;
    }

    var errorCount = 0;
    View.insertJavaScript("six15_hud_getSendTextData.js", "HEAD", "TOP", { 'MATCH-URL': '', 'MATCH-SOURCE': '' });

    var intervalIdLoading = setInterval(function () {
        View.evaluateJavascript("six15_hud_hasLoaded()", function (loadedResult) {
            if (loadedResult == "true") {
                errorCount = 0;
                clearInterval(intervalIdLoading);
                // View.toast("Injection complete for:" + scopeName);
                var previousJsonResult = null;

                function updateHudScreen(empty_event) {
                    var arg = scopeName;
                    View.evaluateJavascript("six15_hud_getSendTextData('" + arg + "')", function (jsonResult) {
                        if (!jsonResult) {
                            //No message to send, don't send anything.
                            return
                        }
                        if (jsonResult == previousJsonResult) {
                            // Don't send the data again.
                            //It's best to not re-send broadcasts if we know the screen hasn't changed.
                            return
                        }
                        previousJsonResult = jsonResult
                        var message = JSON.parse(jsonResult);
                        if (!message) {
                            //No extras given, don't send anything.
                            if (!firstMessage) {
                                Action.sendBroadcast({
                                    action: "com.six15.hudservice.ACTION_CLEAR_DISPLAY"
                                });
                            }
                            return
                        }
                        //Even though we start the service at the top of this file,
                        //we use start service again the first time an image is shown.
                        //This helps avoid a race condition where a broadcast is send before the service is running
                        //We don't use startService every time so an end user can manually stop the service and not
                        //have it constantly restarted against their will.
                        if (firstMessage) {
                            Action.launch({
                                package: six15_app_package_name,
                                class: "com.six15.intent_interface.IntentInterfaceActivity",
                                action: "com.six15.hudservice.ACTION_SEND_TEXT",
                                extras: message
                            });
                        } else {
                            Action.sendBroadcast({
                                action: "com.six15.hudservice.ACTION_SEND_TEXT",
                                extras: message
                            });
                        }
                        firstMessage = false;
                    });
                }
                updateHudScreen({});
                setInterval(updateHudScreen, 30)
            } else {
                errorCount += 1;
                if (errorCount == 50) { //100ms*50 = 5 second timeout.
                    clearInterval(intervalIdLoading);
                    Action.launch({
                        package: six15_app_package_name,
                        class: "com.six15.intent_interface.IntentInterfaceActivity",
                        action: "com.six15.hudservice.ACTION_SEND_TEXT",
                        extras: [
                            { name: "text0", value: "Failed to inject six15_hud_getSendTextData.js", type: "string" },
                            { name: "text1", value: "into scope " + scopeName, type: "string" }
                        ]
                    });
                    View.toast("Failed to inject HUD Text Scraper");
                }
            }
        });
    }, 100);
}

WLEvent.on("EnterScope", injectHudScreen);