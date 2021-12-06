let settings = {
    "itemHideSupport" : true,
    "maphideSupport" : true,
    "itemFullscreenMode" : true,
    "mapFullscreenMode" : true,
    "scrollHelper" : true,
    "lastTab": "tab-item-db"
}

chrome.storage.sync.get("settings", function(data) {
    settings = data.settings;
    applyChanges();
});

function applyChanges(){
    if(settings["maphideSupport"]){
        removeSupportButton();
    }
    if(settings["mapFullscreenMode"]){
        doFullscreenMode();
    }
}

function removeSupportButton(){
    document.getElementsByClassName("btn-support2")[0].remove();
}

function doFullscreenMode(){
    document.getElementById("map-right").parentElement.remove();
    document.getElementById("map-left").parentElement.remove();
    
    var content = document.getElementById("content");
    content.style.margin = "0px";
    content.style.top = "32px";

    var markerList = document.getElementsByClassName("search-list")[0];
    var leftBar = document.getElementsByClassName("left-bar")[0];
    leftBar.style.left = markerList.offsetWidth + "px";
    leftBar.style.zIndex = "3";
}