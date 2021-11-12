// Initialize button with user's preferred color
let changeColor = document.getElementById("changeColor");

const cb_hideSupport = document.getElementById("cb_hideSupport");
const cb_fullscreenMode = document.getElementById("cb_fullscreenMode");
const btn_Reload = document.getElementById("reload");

let hideSupp = true;
let fsMode = true;

let somethingChanged = false;

let settings = {
    "hideSupport" : true,
    "fullscreenMode" : true,
}

chrome.storage.sync.get("isFirstStart", ({ isFirstStart }) => {
    if(isFirstStart == undefined){
        chrome.storage.sync.set({ "settings": settings });
    }
});

chrome.storage.sync.get("settings", function(data) {
    settings = data.settings;
    cb_hideSupport.checked = data.settings["hideSupport"];
    cb_fullscreenMode.checked = data.settings["fullscreenMode"];
});


setupEvents();


function setupEvents(){
    cb_hideSupport.addEventListener("click", async () => {
        settings["hideSupport"] = !settings["hideSupport"];
        saveSettings();

    });

    cb_fullscreenMode.addEventListener("click", async () => {
        settings["fullscreenMode"] = !settings["fullscreenMode"];
        saveSettings();
    });

    
    btn_Reload.addEventListener("click", async () => {
        reload();
    });
}

function saveSettings(){
    somethingChanged = true;
    chrome.storage.sync.set({"settings": settings});
}

function reload(){
    chrome.tabs.query({active: true, highlighted: true},function(tab){


        tab.forEach(function(item, index, array) {
            console.log(item, index)

            if(item.url != undefined){
                if(item.url.includes("grimtools.com")){

                    chrome.tabs.reload(item.id);
                    console.log("is grimmtools tab");
                }
            }
            
          })

    });

}

function reloadTab(){

    chrome.tabs.getCurrent( function(tab){
        console.log(tab);
    });
}
