const scroller = document.getElementById("item-list");
const divMove = document.createElement("div");
const searchBox = document.createElement('input');
const searchIcon = document.createElement('span');
const searchWrapper = document.createElement('div');
const chipBox = document.createElement('div');
const chipBoxClear = document.createElement('div');
const gtSearch = document.getElementById('input-search');

const chipList = document.createElement('ul');
const autoCompleteList = document.createElement('div');

let chips = [];

let gameData = [
    "Resistances",
    "Fire",
    "Lightning",
    "Cold",
    "Poison & Acid",
    "Piercing",
    "Bleeding",
    "Vitality",
    "Aether",
    "Stun",
    "Chaos",
]

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

function generateSearchHint(match){
    var hint = document.createElement('div');
    hint.innerText = match;
    hint.classList.add('hint');
    autoCompleteList.appendChild(hint);

    hint.addEventListener('click', (event) => {
        if(chips.find(e => e.toLowerCase() === value.toLowerCase())){
            return;
        }
        
        addAsChip(event.target);
    });
}

function addAsChip(element){
    let text = element.innerText;
    generateChip(text);
    autoCompleteList.removeChild(element);
}

function findHints(searchTerm){
    let term = searchTerm.toLowerCase();
    let matches = [];

    gameData.forEach((value) => {
        if(value.toLowerCase().indexOf(term) !== -1){
            matches.push(value);
        }
    });

    matches = matches.filter(element => !chips.find(rm => rm.toLowerCase() === element.toLowerCase()));

    return matches;
}

function generateHints(searchTerm){
    clearHints();

    let matches = findHints(searchTerm);

    matches.forEach((matchValue) => {
        generateSearchHint(matchValue);
    });

}

function clearHints(){
    while (autoCompleteList.firstChild) {
        autoCompleteList.removeChild(autoCompleteList.firstChild);
    }
}

function generateSearch(){
    document.getElementsByClassName('bar-mid')[0].appendChild(searchWrapper);
    document.getElementsByClassName('input-block')[0].style.display = 'none';
    searchBox.classList.add('input');
    searchIcon.classList.add('search-icon');
    chipBoxClear.classList.add('chip-box-clear');
    searchWrapper.classList.add('input-block');
    chipBoxClear.innerText = 'clear';
    searchWrapper.style.width = '100%';

    chipBox.classList.add('chip-box');

    var chipListWrapper = document.createElement('div');
    chipListWrapper.classList.add('chip-list-wrapper');

    chipListWrapper.appendChild(chipList);
    chipBox.appendChild(chipListWrapper);

    autoCompleteList.classList.add('auto-complete-wrapper');
    chipBox.appendChild(autoCompleteList);

    chipBoxClear.addEventListener('click', () => {
        clearChipBox();
    });

    searchBox.addEventListener('keyup', event => {
        generateHints(searchBox.value);
    });

    searchBox.addEventListener('focusin', () =>{
        setChipBoxVisibility('visible');
    });

    searchBox.addEventListener('focusout', () =>{
            // setChipBoxVisibility('hidden');
    });
    
    searchBox.addEventListener('keydown', event =>{
        if(event.shiftKey && event.key === 'Enter'){
            performSearch();
            return;
        }

        if (event.isComposing || event.key === 'Enter') {
            if(searchBox.value === ''){
                return;
            }

            if(chips.find(e => e.toLowerCase() === value.toLowerCase())){
                return;
            }

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
}

function setChipBoxVisibility(value){
    chipBox.style.visibility = value;
}

function generateChip(value){

    

    var li = document.createElement('li');
    var liId = 'chip' + value;
    li.id = liId;

    var liText = document.createElement('div');
    liText.innerText = value;
    liText.classList.add('chip-text');

    var liClose = document.createElement('div');
    liClose.classList.add('chip-close');
    li.appendChild(liText);
    li.appendChild(liClose);

    chipList.appendChild(li);

    chips.push(value);

    liClose.addEventListener('click', event => {
        chips.splice(chips.findIndex(e => e == event.currentTarget.parentElement.innerText), 1);
        chipList.removeChild(event.currentTarget.parentElement);

        if(chips.length < 1){
            setChipBoxVisibility('hidden');
        }
    })
}
