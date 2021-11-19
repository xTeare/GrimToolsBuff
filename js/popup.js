const btn_Reload = document.getElementById("reload");

const tabBtn_item_db = document.getElementById("tabBtn-item-db");
const cb_chipSearch = document.getElementById("cb_chipSearch");
const cb_itemHideSupport = document.getElementById("cb_itemHideSupport");
const cb_itemFullscreenMode = document.getElementById("cb_itemFullscreenMode");
const cb_scrollHelper = document.getElementById("cb_scrollHelper");

const tabBtn_map = document.getElementById("tabBtn-map");
const cb_mapFullscreenMode = document.getElementById("cb_mapFullscreenMode");
const cb_mapHideSupport = document.getElementById("cb_mapHideSupport");

let somethingChanged = false;

let settings = {
    "itemHideSupport" : true,
    "itemChipSearch" : true,
    "maphideSupport" : true,
    "itemFullscreenMode" : true,
    "mapFullscreenMode" : true,
    "scrollHelper" : true,
    "lastTab": "tab-item-db"
}

let tabMap = {
    "tab-item-db" : tabBtn_item_db,
    "tab-map" : tabBtn_map
}

chrome.storage.sync.get("isFirstStart", ({ isFirstStart }) => {
    if(isFirstStart == undefined){
        chrome.storage.sync.set({ "settings": settings });
    }
});

chrome.storage.sync.get("settings", function(data) {
    settings = data.settings;

    setCheckboxState();
    setupEvents();
});

function saveSettings(){
    somethingChanged = true;
    chrome.storage.sync.set({"settings": settings});
}

function reload(){
    chrome.tabs.query({active: true, highlighted: true},function(tab){
        tab.forEach(function(item, index, array) {
            if(item.url != undefined && item.url.includes("grimtools.com")){
                chrome.tabs.reload(item.id);
            }
          })
    });
}

function changeTab(tab, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    tablinks = document.getElementsByClassName("tablinks");

    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    document.getElementById(tabName).style.display = "block";
    tab.className += " active";
    settings["lastTab"] = tabName;
    saveSettings();
}

function setCheckboxState(){
    cb_mapHideSupport.checked = settings["maphideSupport"];
    cb_itemHideSupport.checked = settings["itemHideSupport"];
    cb_itemFullscreenMode.checked = settings["itemFullscreenMode"];
    cb_scrollHelper.checked = settings["scrollHelper"];
    cb_mapFullscreenMode.checked = settings["mapFullscreenMode"];
    cb_chipSearch.checked = settings["itemChipSearch"];
}

function setupEvents(){
    tabBtn_item_db.addEventListener("click", () => changeTab(tabBtn_item_db, "tab-item-db"));
    tabBtn_map.addEventListener("click", () => changeTab(tabBtn_map, "tab-map"));

    var tabName = settings["lastTab"];
    changeTab(tabMap[tabName], tabName);

    cb_mapHideSupport.addEventListener("click", async () => {
        settings["maphideSupport"] = !settings["maphideSupport"];
        saveSettings();
    });

    cb_itemHideSupport.addEventListener("click", async () => {
        settings["itemHideSupport"] = !settings["itemHideSupport"];
        saveSettings();
    });

    cb_itemFullscreenMode.addEventListener("click", async () => {
        settings["itemFullscreenMode"] = !settings["itemFullscreenMode"];
        saveSettings();
    });

    cb_chipSearch.addEventListener("click", async () => {
        settings["itemChipSearch"] = !settings["itemChipSearch"];
        saveSettings();
    });

    cb_scrollHelper.addEventListener("click", async () => {
        settings["scrollHelper"] = !settings["scrollHelper"];
        saveSettings();
    });

    cb_mapFullscreenMode.addEventListener("click", async () => {
        settings["mapFullscreenMode"] = !settings["mapFullscreenMode"];
        saveSettings();
    });
    
    btn_Reload.addEventListener("click", async () => {
        reload();
    });
}