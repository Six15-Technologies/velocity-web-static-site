//This is a JavaScript file which is injected into every website.
//It should be added as a Velocity resource under the six15_hud_sendText_on_scope.js script.


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
        var locationValue = document.querySelector("body > form > table > tbody > tr:nth-child(2) > td")
        if (locationValue) {
            //Velocity doesn't support the conditional, chaining operator so an if statement is required.
            locationValue = locationValue.innerText // "Normal" HTML elements use .innerText to read their text values. Input elements use .value to read the value entered by the user.
        }
        var hudText1 = locationValue

        var confirmLocationLabel = document.querySelector("body > form > table > tbody > tr:nth-child(3) > th").innerText
        var confirmLocationValue = document.querySelector("#focusInput").value // Input elements use .value to read the value inputted by the user.
        var hudText2 = confirmLocationLabel + ": " + confirmLocationValue

        return [
            { name: 'text0', value: "Scan Location", type: 'string' },
            { name: 'bg_color0', value: "BLUE", type: 'string' },

            { name: 'text1', value: hudText1, type: 'string' },
            { name: 'weight1', value: "3", type: 'string' },

            { name: 'text2', value: hudText2, type: 'string' },
            { name: 'bg_color2', value: "#444e83", type: 'string' },
            // There are lots of other formatting options you could send.
            // See: https://six15.engineering/intent_interface/#api-definition
        ];
    }

    // If Screen2 needs a different identifier than the Login screen, the variable screen_Identifier could be modified to have a new value.
    if (screen_Identifier == "Scan Product") {
        //Parse text for "Scan Product" screen
        var productValue = document.querySelector("body > form > table > tbody > tr:nth-child(3) > td").innerText
        var quantityValue = document.querySelector("body > form > table > tbody > tr:nth-child(5) > td").innerText
        var hudText1 = productValue + "\nQTY: " + quantityValue

        var confirmProductLabel = document.querySelector("body > form > table > tbody > tr:nth-child(6) > th").innerText
        var confirmProductValue = document.querySelector("#focusInput").value // Input elements use .value to read the value inputted by the user.
        var hudText2 = confirmProductLabel + ": " + confirmProductValue

        return [
            { name: 'text0', value: "Scan Product", type: 'string' },
            { name: 'bg_color0', value: "BLUE", type: 'string' },

            // Using max_lines with "\n" separated lines forces the lines to have the same font size.
            { name: 'text1', value: hudText1, type: 'string' },
            { name: 'weight1', value: "3", type: 'string' },
            { name: 'max_lines1', value: 2, type: 'integer' },

            { name: 'text2', value: hudText2, type: 'string' },
            { name: 'bg_color2', value: "#444e83", type: 'string' },

        ];
    }
    if (screen_Identifier == "Finished") {
        //Parse text for Screen3 screen
        var completionTimeLabel = document.querySelector("body > form > table > tbody > tr:nth-child(2) > th").innerText
        var completionTimeTask = document.querySelector("body > form > table > tbody > tr:nth-child(2) > td").innerText
        var hudText1 = completionTimeLabel + ": " + completionTimeTask

        return [
            { name: 'text0', value: "Finished", type: 'string' },
            { name: 'bg_color0', value: "#005500", type: 'string' },

            { name: 'text1', value: hudText1, type: 'string' },
            { name: 'weight1', value: "4", type: 'string' },
        ];
    }
}