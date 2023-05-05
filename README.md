Introduction
===
This repository demonstrates how a [Velocity](https://www.ivanti.com/products/velocity) deployed website can be HUD Enabled with [Six15's ST1](https://www.six-15.com/enterprise-hud).

Be sure to see our developer documentation on [six15.engineering](https://six15.engineering), specifically the sections about the
[Intent Interface](https://six15.engineering/intent_interface/) and [Velocity Web Integration](https://six15.engineering/intent_interface/#velocity-web).

View the demo wbesite at: https://six15-technologies.github.io/velocity-web-static-site/

Prerequisites
===
In order to successfully run this demo you need the following:

1. A physical ST1 device. Contact info@six-15.com.
1. An Android phone
1. Velocity app installed. [Play Store](https://play.google.com/store/apps/details?id=com.wavelink.velocity).
1. Six15 ST1 app installed. [Play Store](https://play.google.com/store/apps/details?id=com.six15.st1_connect).

Architecture
===
Velocity exposes a [Scripting API](https://help.ivanti.com/wl/help/en_US/Vscript/1.2/Using/ScriptingAPI.htm) which allows code to be executed when pages load or change.
By [injecting JavaScript](https://help.ivanti.com/wl/help/en_US/Vscript/1.2/view_insertjavascript.htm) into the Velocity web browser at runtime it's possible to examine the contents of any rendered web page.

Velocity's scripting API also allows [broadcast messages](https://help.ivanti.com/wl/help/en_US/Vscript/1.2/action_sendBroadcast.htm) to be sent to other apps running on the device.
Six15's "Six15 ST1" app exposes the [Intent Interface](https://six15.engineering/intent_interface/) which can receive these broadcasts and display information on the ST1.

Putting both together allows the Velocity scripting API to extract useful information from a website and display it on the ST1 HUD.


No changes need to be made on the original website.
Devices without the Six15 ST1 app or users without a physical ST1 can continue to work as if nothing changed.

Sequence Diagram
===
![](https://mermaid.ink/img/eyJjb2RlIjoic2VxdWVuY2VEaWFncmFtXG4gICAgcGFydGljaXBhbnQgdmEgYXMgVmVsb2NpdHkgQXBwXG4gICAgcGFydGljaXBhbnQgdnNyIGFzIFZlbG9jaXR5IFNjcmlwdFxuICAgIHBhcnRpY2lwYW50IHdqc3IgYXMgSW5qZWN0ZWQgSmF2YVNjcmlwdFxuICAgIHBhcnRpY2lwYW50IHdlYiBhcyBXZWJQYWdlXG4gICAgcGFydGljaXBhbnQgaWkgYXMgSW50ZW50IEludGVyZmFjZVxuICAgIHBhcnRpY2lwYW50IHN0MSBhcyBTaXgxNSBTVDFcblxuICAgIGFjdGl2YXRlIHN0MVxuICAgIGFjdGl2YXRlIHZhXG4gICAgTm90ZSBvdmVyIHZhOiBMYXVuY2ggRXhhbXBsZSBQcm9qZWN0XG5cbiAgICB2YS0-Pit2c3I6IGVudGVyIFwic2Vzc2lvblwiIHNjb3BlXG4gICAgdnNyLT4-K2lpOiBzdGFydCBJbnRlbnQgSW50ZXJmYWNlXG4gICAgaWktPj5zdDE6IGNsZWFyIGRpc3BsYXlcbiAgICBsb29wXG4gICAgICAgIHZhLT4-K3dlYjogbG9hZCB3ZWJwYWdlXG4gICAgICAgIHZhLT4-dnNyOiBvbiBFbnRlclNjb3BlIGV2ZW50XG4gICAgICAgIHZzci0-Pit3anNyOiBpbmplY3QgZ2V0VGV4dCBzY3JpcHRcbiAgICAgICAgd2pzci0-PndlYjogcmVhZCB0ZXh0IGZyb20gcGFnZVxuICAgICAgICB3ZWItPj53anNyOiByZWNlaXZlIGJhY2sgdGV4dFxuICAgICAgICBOb3RlIG92ZXIgd2pzcjogVXNlIHRleHQgdG8gZ2VuZXJhdGUgSFVEIHNjcmVlblxuICAgICAgICB3anNyLT4-dnNyOiByZXR1cm4gSW50ZW50IEludGVyZmFjZSBkYXRhXG4gICAgICAgIHZzci0-PmlpOmJyb2FkY2FzdCBJbnRlbnQgSW50ZXJmYWNlIGRhdGFcbiAgICAgICAgaWktPj5zdDE6ZGlzcGxheSBpbWFnZVxuICAgICAgICBub3RlIG92ZXIgc3QxOiBEaXNwbGF5aW5nIEltYWdlXG4gICAgICAgIG5vdGUgb3ZlciB3ZWIsd2pzcjpVc2VyIGV2ZW50dWFsbHkgbmF2aWdhdGVzIGF3YXlcbiAgICAgICAgd2ViLT4-LXZhOiBjbG9zZSB3ZWJwYWdlXG4gICAgICAgIGRlYWN0aXZhdGUgd2pzclxuXG4gICAgZW5kXG4gICAgdnNyLT4-LXZhOmV4aXQgXCJzZXNzaW9uXCIgc2NvcGVcbiAgICBkZWFjdGl2YXRlIGlpXG4gICAgZGVhY3RpdmF0ZSBzdDFcbiAgICBkZWFjdGl2YXRlIHZhIiwibWVybWFpZCI6eyJ0aGVtZSI6ImRlZmF1bHQifSwidXBkYXRlRWRpdG9yIjpmYWxzZSwiYXV0b1N5bmMiOnRydWUsInVwZGF0ZURpYWdyYW0iOmZhbHNlfQ)
<!-- Replace https://mermaid.ink/img/ with https://mermaid.live/edit/# to edit the diagram onnline -->

Integration
===
Six15 has already written a Velocity script which sets up the previously described process.
An integrator would only need to take the following steps to customize this solution for a customer.

Using the Velocity Console and a text editor:

1. Add the script [six15_hud_sendText_on_scope.js](six15_hud_sendText_on_scope.js) to the project, and link it to the "session" scope.
1. Customize [six15_hud_getSendTextData.js](six15_hud_getSendTextData.js) to extract the desired text.
    - The behavior taken will likely change based on the current page URL. See Velocity's doc about [scopes](https://help.ivanti.com/wl/help/en_US/Velocity/1.2.109/admin/settingScopes.htm) for Web.
    - Extract strings from the website. Use document.getElementById(...).innerText, or more complex JavaScript. See the the existing file for more examples.
    - Customized the colors, formatting, ect... as defined by Six15's [Intent Interface](https://six15.engineering/intent_interface/). 
1. Add the modified script [six15_hud_getSendTextData.js](six15_hud_getSendTextData.js) as a resource in your Velocity project.

To test or re-deploy the modified project:

1. Install and setup the Six15 ST1 app.
    - You must run the app, accept permissions, and plug in your ST1 before launching Velocity.
1. Re-deploy the updated wldep file into the Velocity app on your Android device.

Important Files
===
| File Name                      | Description                                                                                                                                                                                                     |
|--------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Six15_Velocity_Web_Demo.zip    | Example project for [Velocity Console](https://www.wavelink.com/download-velocity_enterprise-app-modernization-software/).                                                                                      |
| Six15_Velocity_Web_Demo.wldep  | Example project Velocity deployment file. This file can be imported onto an Android device to run the demo.                                                                                                     |
| docs                           | Example website which is rendered by Velocity. This site is hosted on GitHub Pages [here](https://six15-technologies.github.io/velocity-web-static-site/).                                                      |
| six15_hud_sendText_on_scope.js | Source code to Velocity script which injects [six15_hud_getSendTextData.js](six15_hud_getSendTextData.js) into the website.                                                                                     |
| six15_hud_getSendTextData.js   | Source code to JavaScript file which is injected into site.                                                                                                                                                     |
| push-wldep-to-device           | Shell script to automatically push wldep files onto an Android device during development. Android File Transfer can also be used by copying he wldep file into /sdcard/Android/data/com.wavelink.velocity/files |
