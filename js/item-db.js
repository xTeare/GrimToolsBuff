const scroller = document.getElementById("item-list");
const divMove = document.createElement("div");
const searchBox = document.createElement('input');
const searchIcon = document.createElement('span');
const searchWrapper = document.createElement('div');
const chipBox = document.createElement('div');
const chipBoxClear = document.createElement('div');
const gtSearch = document.getElementById('input-search');

let chips = [];

let settings = {
    "itemHideSupport" : true,
    "itemChipSearch" : true,
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
    if(settings["itemFullscreenMode"]){
        doFullscreenMode();
    }
    if(settings["itemHideSupport"]){
        removeSupportButton();
    }
    if(settings["scrollHelper"]){
        addScrollHelper();
    }
    if(settings["itemChipSearch"]){
        generateSearch();
    }
}

function performSearch(){
    if(chips.length === 0){
        return;
    }

    var searchTerms = '';

    chips.forEach((value, index, array) => {
        searchTerms += '"' + value + '"';
        if(index != chips.length - 1){
            searchTerms += " ";
        }
    });

    gtSearch.value = searchTerms;
    gtSearch.dispatchEvent(new KeyboardEvent('keydown',{'keyCode' : 13}));
}

function doFullscreenMode(){
    document.getElementById("item-db-right").parentElement.remove();
    document.getElementById("item-db-left").parentElement.remove();
    
    var content = document.getElementById("content");
    content.classList.remove("web");
    content.style.marginTop = "0px";

    document.getElementsByClassName("header centered")[0].remove();
}

function removeSupportButton(){
    document.getElementsByClassName("btn-support")[0].remove();
}

function move(scroller){
    if(divMove.innerText == "▲"){
        scroller.scroll({ top: 0 });
        divMove.innerText = "▼";
    }
    else{
        scroller.scroll({ top: scroller.scrollHeight });
        divMove.innerText = "▲";
    }

    divMove.classList.add("selected");
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

function generateSearch(){
    document.getElementsByClassName('bar-mid')[0].appendChild(searchWrapper);
    searchBox.classList.add('input');
    searchIcon.classList.add('search-icon');
    chipBoxClear.classList.add('chip-box-clear');
    searchWrapper.classList.add('input-block');
    chipBoxClear.innerText = 'clear';
    searchWrapper.style.width = '100%';
    chipBox.classList.add('chip-box');
    chipBox.style.visibility = "hidden";
    chipBoxClear.addEventListener('click', () => {
        clearChipBox();
    });

    searchBox.addEventListener('focusin', () =>{
        setChipBoxVisibility('visible');
    });

    searchBox.addEventListener('focusout', () =>{
        if(chips.length == 0){
            setChipBoxVisibility('hidden');
        }
    });
    
    searchBox.addEventListener('keydown', event =>{
        if(event.shiftKey && event.key === 'Enter'){
            performSearch();
            return;
        }

        if (event.isComposing || event.key === 'Enter') {
            if(searchBox.value === '')
                return;

            var chip = searchBox.value;
            searchBox.value = '';
            generateChip(chip);
          }
    });

    chipBox.appendChild(chipBoxClear);
    searchWrapper.appendChild(searchBox);
    searchWrapper.appendChild(searchIcon);
    searchWrapper.appendChild(chipBox);
}

function clearChipBox(){
    Array.from(chipBox.children).forEach(function(item) {
        if(item.innerText !== 'clear') {
            chipBox.removeChild(item);
        }
     });
    
    setChipBoxVisibility('hidden');
    chips = [];
    console.log(chips);
}

function setChipBoxVisibility(value){
    chipBox.style.visibility = value;
}

function generateChip(value){
    var chip = document.createElement('div');
    chip.classList.add('chip');
    chip.innerText = value;

    var chipClose = document.createElement('span');
    chipClose.classList.add('chip-close');
    chipClose.innerText = 'x';

    chip.appendChild(chipClose);
    chipBox.appendChild(chip);

    chips.push(value);

    chipClose.addEventListener('click', event => {
        chipBox.removeChild(event.currentTarget.parentElement);
        chips = chips.filter(e => e !== text.substring(0, text.length - 1));

        if(chips.length == 0){
            setChipBoxVisibility('hidden');
        }
    })
}
