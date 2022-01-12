//This is a Velocity Script which should be added to the project (i.e. copy pasted into the editor).
//It has no arguments, and should have six15_hud_getSendTextData.js added as a resource.
//It should be linked to the "session" scope.


//The package name of the Six15 app may be "com.six15.launcher" is using the "HMD Service" app
// var six15_app_package_name = "com.six15.launcher"
var six15_app_package_name = "com.six15.st1_connect"

Action.startService({
    package: six15_app_package_name,
    class: "com.six15.intent_interface.IntentInterfaceService"
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

    var intervalId = setInterval(function() {
        View.evaluateJavascript("six15_hud_hasLoaded()", function(result1) {
            if (result1 == "true") {
                errorCount = 0;
                clearInterval(intervalId);
                // View.toast("Injection complete for:" + scopeName);

                function updateHudScreen(empty_event) {
                    var arg = scopeName;
                    View.evaluateJavascript("six15_hud_getSendTextData('" + arg + "')", function(result2) {
                        if (!result2) {
                            //No message to send, don't send anything.
                            return
                        }
                        var message = JSON.parse(result2);
                        //Even though we start the service at the top of this file,
                        //we use start service again the first time an image is shown.
                        //This helps avoid a race condition where a broadcast is send before the service is running
                        //We don't use startService every time so an end user can manually stop the service and not
                        //have it constantly restarted against their will.
                        if (firstMessage) {
                            Action.startService({
                                package: six15_app_package_name,
                                class: "com.six15.intent_interface.IntentInterfaceService",
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
                WLEvent.on("ScreenUpdated", updateHudScreen);
            } else {
                errorCount += 1;
                if (errorCount == 50) { //100ms*50 = 5 second timeout.
                    clearInterval(intervalId);
                    Action.startService({
                        package: six15_app_package_name,
                        class: "com.six15.intent_interface.IntentInterfaceService",
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