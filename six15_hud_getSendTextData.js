//This is a JavaScript file which is injected into every website.
//It should be added as a Velocity resource under the six15_hud_sendText_on_scope.js script. 

function six15_hud_hasLoaded() {
    //This function is used by the Velocity script to determine when this JavaScript
    //file is loaded into the webpage's runtime.
    return true;
}

function six15_hud_getSendTextData(scopeName) {
    scopeName = scopeName.trim(); //This seems to be needed in some cases.

    if (scopeName == "@velocity-web-static-site/" || scopeName.startsWith("@velocity-web-static-site/scan_location_")) {
        return getLocationScreen();
    }
    if (scopeName.startsWith("@velocity-web-static-site/scan_product_")) {
        return getProductScreen();
    }
    if (scopeName == "@velocity-web-static-site/finished/") {
        return getFinishedScreen();
    }
    // return null; //Don't change the HUD screen

    var text0 = "Un-handled Scope";
    var text1 = scopeName;
    return [
        { name: 'text0', value: text0, type: 'string' },
        { name: 'bg_color0', value: "#808080", type: 'string' },
        { name: 'text1', value: text1, type: 'string' },
        { name: 'weight1', value: "3", type: 'string' }
    ];
}

function getLocationScreen() {
    var hud_location_str = findTableElementMatching("Location", 0)

    return [
        { name: "text0", value: "Scan Location", type: "string" },
        { name: "text1", value: hud_location_str, type: "string" },
        { name: "weight1", value: "3", type: "string" },
        { name: "bg_color0", value: "BLUE", type: "string" },
    ];
}

function getProductScreen() {
    var hud_location_str = findTableElementMatching("Location", 0)
    var hud_product_str = findTableElementMatching("Product", 0)
    var hud_description_str = findTableElementMatching("Description", 0)

    return [
        { name: "text0", value: "Scan Product (" + hud_location_str + ")", type: "string" },
        { name: "text1", value: hud_product_str, type: "string" },
        { name: "text2", value: hud_description_str, type: "string" },
        { name: "weight0", value: "1", type: "string" },
        { name: "weight1", value: "2", type: "string" },
        { name: "weight2", value: "1", type: "string" },
        { name: "bg_color0", value: "BLUE", type: "string" },
    ];
}

function getFinishedScreen() {
    var hud_finished_str = findTableElementMatching("Completion Time", 0)

    return [
        { name: "text0", value: "Finished!", type: "string" },
        { name: "text1", value: hud_finished_str, type: "string" },
        { name: "weight1", value: "3", type: "string" },
        { name: "bg_color0", value: "#005500", type: "string" },
    ];
}

function findTableElementMatching(row_header_text, row_data_index) {
    return Array.from(document.getElementsByTagName("tr")).filter(
        tableRow => tableRow.getElementsByTagName("th")[0].innerText == row_header_text
    )[0].getElementsByTagName("td")[row_data_index].innerText
}