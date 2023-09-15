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
![](https://mermaid.ink/img/pako:eNqNVMFu2zAM_RVC16WHHHbxocCABFiHrSiQdrv4wshMys6WXElWExT991FW4sR1AswXW9Qj-fQerXelbUWqUJ5eOzKaFoxbh01pQJ4WXWDNLZoAEQE9_Kbaag57-Na2FzDejUAr7bgNU9zbSwbemRfSgSr4gRGvgmmdsH9o_YBbmu4z51KBZJFeboP6As6HeQKueDf_CqvHeWkyBnXgiIES4FMkYg7cW1nYSE4iBfzEzuhnWO6waWuCB2fTKY7lIt7c3n4RJQqgRAZK0dZ7tqZU4LVtD9QEkYDMhTQWmldOwCwoYVaArgkdVOzbGvd5s7b24MKps8hVyAZWSbh2UGwA9MysgWXqs0p8gKI0PoNlZsmkAri3CLYUHmknIp6ZNGWQnpQm6T0NR0IjpLyNsw2M2fRgWids38mRJo4Ea9R_-6Qx9ORBhj95yqWDFXaGXDLs-9MiUSQyF0nF3Cd0zkzkhgoDjrOyEOLQ2omeGn34n6zBsYNVwM3k3GY4TG_tIiPZbOFuDCZTnRanLNFt1ssgKrjsX4d1vQeDkbeihAd8O07JSeibNL66tiLdZDgqGsY-VT6O80Agi5Eq0I7Dtak-q8I8CQ1_2FksopqphlyDXMk99J4ApQrP1FCpCvmsaINdHUpVmg-BYhfsam-0KoLraKa6Viw4Xlvj4LLiYJ0qNlh7CVK__JXvu_7a-_gHqlqfGg)
<!-- Replace https://mermaid.ink/img/ with https://mermaid.live/edit/# to edit the diagram online -->


Custom Integration
===
Six15 has already written a Velocity script which sets up the previously described process.
An integrator would only need to take the following steps to customize this solution for a customer.

Using the Velocity Console and a text editor:

1. Add the script [six15_hud_sendText_on_scope.js](custom_integraion/src/six15_hud_sendText_on_scope.js) to the project, and link it to the "session" scope.
1. Customize [six15_hud_getSendTextData.js](custom_integraion/src/six15_hud_getSendTextData.js) to extract the desired text.
    - The behavior taken will likely change based on the current page URL. See Velocity's doc about [scopes](https://help.ivanti.com/wl/help/en_US/Velocity/1.2.109/admin/settingScopes.htm) for Web.
    - Extract strings from the website. Use document.getElementById(...).innerText, or more complex JavaScript. See the the existing file for more examples.
    - Customized the colors, formatting, ect... as defined by Six15's [Intent Interface](https://six15.engineering/intent_interface/). 
1. Add the modified script [six15_hud_getSendTextData.js](custom_integraion/src/six15_hud_getSendTextData.js) as a resource in your Velocity project.

To test or re-deploy the modified project:

1. Install and setup the Six15 ST1 app.
    - You must run the app, accept permissions, and plug in your ST1 before launching Velocity.
1. Re-deploy the updated wldep file into the Velocity app on your Android device.


Smart Integration
===
Six15's Smart Web integration is a pre-written integraion which can work with any website. It doesn't require customization per-website or per-webpage so can be used without writing any code. It uses the browser's "MutationObserver" API, "document.querySelectorAll()", and other techniques to analyze any website. It takes this information and sends it to the "Six15 ST1" app using the Intent Interface's action "com.six15.hudservice.ACTION_SEND_REGIONS".

The "Six15 ST1" app can then narrow down the information into what's most important by using the keywords and other hints defined by the "Smart Configurator" inside the app.

The "Six15 ST1" app contains a pre-made WLDEP file which includes the Smart Web Integration. The WLDEP file can be added to Velocity using the "Add Smart Six15 to Velocity" button inside the app. Website spesfic information can be edited inside the Velocity app by editing the Smart Web Host Profile. The default password to edit is "system".


Important File types and Folders
===
| File Name                   | Description                                                                                                                                                                                                          |
|-----------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| *.zip                       | Project for [Velocity Console](https://www.wavelink.com/download-velocity_enterprise-app-modernization-software/).                                                                                                   |
| *.wldep                     | Project Velocity deployment file. This file can be imported onto an Android device to run the demo.                                                                                                                  |
| docs                        | Example website which is rendered by Velocity. This site is hosted on GitHub Pages [here](https://six15-technologies.github.io/velocity-web-static-site/).                                                           |
| six15_hud_send*_on_scope.js | Source code to Velocity script which injects six15_hud_getSend*Data.js into the website and can sends data to the "Six15 ST1" app.                                                                                   |
| six15_hud_getSend*Data.js   | Source code to JavaScript file which is injected into the Velocity browser and has access to the website's contents.                                                                                                 |
| push-integrations           | ADB shell script to automatically push wldep files onto an Android device during development. Android File Transfer can also be used by copying the wldep file into /sdcard/Android/data/com.wavelink.velocity/files |
