const scroller = document.getElementById("item-list");
const divMove = document.createElement("div");

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
    if(settings["hideSupport"]){
        removeSupportButton();
    }
    if(settings["itemFullscreenMode"]){
        doFullscreenMode();
    }
    if(settings["scrollHelper"]){
        addScrollHelper();
    }
}

function removeSupportButton(){
    document.getElementsByClassName("btn-support")[0].remove();
}

function doFullscreenMode(){
    document.getElementById("item-db-right").parentElement.remove();
    document.getElementById("item-db-left").parentElement.remove();
    
    var content = document.getElementById("content");
    content.classList.remove("web");
    content.style.marginTop = "0px";

    document.getElementsByClassName("header centered")[0].remove();
}

function addScrollHelper(){
    divMove.id= "div-to-down";
    divMove.innerText = "▼"
    divMove.classList.add("tab");
    divMove.classList.add("legendary");
    divMove.classList.add("selected");
    divMove.style.fontSize = "2em";
    divMove.style.lineHeight = "0.5em";
    divMove.style.opacity = "0.75";
    divMove.onclick = function () { move(scroller); }

    document.getElementsByClassName("rarity-selector")[0].appendChild(divMove); 
}

function move(scroller){
    if(divMove.innerText == "▲"){
        scroller.scroll({
            top: 0,
            behavior: 'smooth'
          });
        divMove.innerText = "▼";
    }
    else{
        scroller.scroll({
            top: scroller.scrollHeight,
            behavior: 'smooth'
          });

        divMove.innerText = "▲";
    }

    divMove.classList.add("selected");
}



// document.getElementById("item-db-right").parentElement.remove();
// document.getElementById("item-db-left").parentElement.remove();

// var content = document.getElementById("content");
// content.classList.remove("web");
// content.style.marginTop = "0px";

// document.getElementsByClassName("header centered")[0].remove();
// document.getElementsByClassName("btn-support")[0].remove();

// divMove.id= "div-to-down";
// divMove.innerText = "▼"
// divMove.classList.add("tab");
// divMove.classList.add("legendary");
// divMove.classList.add("selected");
// divMove.style.fontSize = "2em";
// divMove.style.lineHeight = "0.5em";
// divMove.style.opacity = "0.75";
// divMove.onclick = function () { move(); }


// document.getElementsByClassName("rarity-selector")[0].appendChild(divMove);


// function move(){
//     if(divMove.innerText == "▲"){
//         scroller.scroll({
//             top: 0,
//             behavior: 'smooth'
//           });
//         divMove.innerText = "▼";
//     }
//     else{
//         scroller.scroll({
//             top: scroller.scrollHeight,
//             behavior: 'smooth'
//           });

//         divMove.innerText = "▲";
//     }

//     divMove.classList.add("selected");
// }