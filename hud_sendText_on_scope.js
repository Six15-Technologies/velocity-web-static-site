Action.startService({
    package: "com.six15.st1_connect",
    class: "com.six15.intent_interface.IntentInterfaceService"
});

function injectHudScreen(event) {
    var scopeName = event.scope;

    if (!scopeName.startsWith("@")) {
        View.toast("Skipping injection for scope:" + scopeName);
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
                            //No message to send, don't sent anything.
                            return
                        }
                        var message = JSON.parse(result2);
                        Action.sendBroadcast({
                            action: "com.six15.hudservice.ACTION_SEND_TEXT",
                            extras: message
                        });
                    });
                }
                updateHudScreen({});
                WLEvent.on("ScreenUpdated", updateHudScreen);
            } else {
                errorCount += 1;
                if (errorCount == 100) {
                    clearInterval(intervalId);
                    Action.sendBroadcast({
                        action: "com.six15.hudservice.ACTION_SEND_TEXT",
                        extras: [
                            { name: "text0", value: "Failed to inject HUD Text Scraper", type: "string" }
                        ]
                    });
                    View.toast("Failed to inject HUD Text Scraper");
                }
            }
        });
    }, 10);
}

injectHudScreen({ scope: "session" });
WLEvent.on("EnterScope", injectHudScreen);