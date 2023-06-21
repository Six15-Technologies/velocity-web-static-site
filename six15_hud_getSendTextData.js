//This is a JavaScript file which is injected into every website.
//It should be added as a Velocity resource under the six15_hud_sendText_on_scope.js script.

function six15_hud_hasLoaded() {
    //This function is used by the Velocity script to determine when this JavaScript
    //file is loaded into the webpage's runtime.
    return true;
}

function six15_hud_getSendTextData(scopeName) {

    var screen_Identifier = document.querySelector("body > h1")
    // The screen_Identifier element may not have been found. So check for null before getting .innerText
    if (screen_Identifier) {
        //Velocity doesn't support the conditional chaining operator, so an if statement is required.
        screen_Identifier = screen_Identifier.innerText
    }
    if (screen_Identifier == "Scan Location") {
        //Parse text for "Scan Location" screen
        //If some fields may not be present, be sure to check for null before calling .innerText. This code will not check for errors in every case.
        var locationLabel = document.querySelector("body > form > table > tbody > tr:nth-child(2) > th")
        if (locationLabel) {
            //Velocity doesn't support the conditional, chaining operator so an if statement is required.
            locationLabel = locationLabel.innerText // "Normal" HTML elements use .innerText to read their text values. Input elements use .value to read the value entered by the user.
        }
        var locationValue = document.querySelector("body > form > table > tbody > tr:nth-child(2) > td").innerText
        var hudText0 = locationLabel + ": " + locationValue

        var confirmLocationLabel = document.querySelector("body > form > table > tbody > tr:nth-child(3) > th").innerText
        var confirmLocationValue = document.querySelector("#focusInput").value // Input elements use .value to read the value inputted by the user.
        var hudText1 = confirmLocationLabel + ": " + confirmLocationValue

        return [
            { name: 'text0', value: hudText0, type: 'string' },
            { name: 'text1', value: hudText1, type: 'string' },
            // There are lots of other formatting options you could send.
            // See: https://six15.engineering/intent_interface/#api-definition
        ];
    }

    // If Screen2 needs a different identifier than the Login screen, the variable screen_Identifier could be modified to have a new value.
    if (screen_Identifier == "Scan Product") {
        //Parse text for "Scan Product" screen
        var locationLabel = document.querySelector("body > form > table > tbody > tr:nth-child(2) > th").innerText
        var locationValue = document.querySelector("body > form > table > tbody > tr:nth-child(2) > td").innerText
        var hudText0 = locationLabel + ": " + locationValue

        var productLabel = document.querySelector("body > form > table > tbody > tr:nth-child(3) > th").innerText
        var productValue = document.querySelector("body > form > table > tbody > tr:nth-child(3) > td").innerText
        var hudText1 = productLabel + ": " + productValue

        var quantityLabel = document.querySelector("body > form > table > tbody > tr:nth-child(5) > th").innerText
        var quantityValue = document.querySelector("body > form > table > tbody > tr:nth-child(5) > td").innerText
        var hudText2 = quantityLabel + ": " + quantityValue

        var confirmProductLabel = document.querySelector("body > form > table > tbody > tr:nth-child(6) > th").innerText
        var confirmProductValue = document.querySelector("#focusInput").value // Input elements use .value to read the value inputted by the user.
        var hudText3 = confirmProductLabel + ": " + confirmProductValue

        return [
            { name: 'text0', value: hudText0, type: 'string' },
            { name: 'text1', value: hudText1, type: 'string' },
            { name: 'text2', value: hudText2, type: 'string' },
            { name: 'text3', value: hudText3, type: 'string' },
        ];
    }
    if (screen_Identifier == "Finished") {
        //Parse text for Screen3 screen
        var taskLabel = document.querySelector("body > form > table > tbody > tr:nth-child(1) > th").innerText
        var taskValue = document.querySelector("body > form > table > tbody > tr:nth-child(1) > td").innerText
        var hudText0 = taskLabel + ": " + taskValue

        var completionTimeLabel = document.querySelector("body > form > table > tbody > tr:nth-child(2) > th").innerText
        var completionTimeTask = document.querySelector("body > form > table > tbody > tr:nth-child(2) > td").innerText
        var hudText1 = completionTimeLabel + ": " + completionTimeTask

        return [
            { name: 'text0', value: hudText0, type: 'string' },
            { name: 'text1', value: hudText1, type: 'string' },
        ];
    }
}