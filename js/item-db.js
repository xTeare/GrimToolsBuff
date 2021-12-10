const scroller = document.getElementById('item-list');
const gtSearch = document.getElementById('input-search');

const divMove = document.createElement('div');
const searchBox = document.createElement('input');
const searchIcon = document.createElement('span');
const searchButton = document.createElement('span');
const searchWrapper = document.createElement('div');
const chipBox = document.createElement('div');
const chipBoxClear = document.createElement('div');
const chipList = document.createElement('ul');
const autoCompleteList = document.createElement('div');

var chips = [];
var gameData = []
var skillData;

fetch('https://raw.githubusercontent.com/xTeare/GrimToolsBuff/master/data/gamedata.json')
  .then(response => response.json())
  .then(data => {
    gameData = data.gameData;
  })
  .then(() => {
      return fetch('https://raw.githubusercontent.com/xTeare/GrimToolsBuff/master/data/skills.json');
    }
  )
.then(response =>  response.json())
.then(data => {
    skillData = data.classes;
    console.log(gameData);
    console.log(skillData);
    generateHints('');
});


var settings = {
    'itemHideSupport' : true,
    'itemChipSearch' : true,
    'maphideSupport' : true,
    'itemFullscreenMode' : true,
    'mapFullscreenMode' : true,
    'scrollHelper' : true,
    'lastTab': 'tab-item-db'
}

chrome.storage.sync.get('settings', function(data) {
    settings = data.settings;
    applyChanges();

    document.addEventListener("click", function(evt) {
        let targetElement = evt.target;

        do {
            if(targetElement == searchBox || targetElement == searchButton || targetElement == searchIcon || targetElement == chipBox)
                return;

            if(targetElement != document && 
                (targetElement.classList.contains('chip-close') || 
                 targetElement.classList.contains('hint') || 
                 targetElement.classList.contains('chip-box-clear')))
                    return;

            targetElement = targetElement.parentNode;
        } 
        while (targetElement);
    
        setChipBoxVisibility('hidden');
    });
});

function applyChanges(){
    
    if(settings['itemFullscreenMode']){
        doFullscreenMode();
    }
    if(settings['itemHideSupport']){
        removeSupportButton();
    }
    if(settings['scrollHelper']){
        addScrollHelper();
    }
    if(settings['itemChipSearch']){
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
            searchTerms += ' ';
        }
    });

    gtSearch.value = searchTerms;
    gtSearch.dispatchEvent(new KeyboardEvent('keydown',{'keyCode' : 13}));
}

function doFullscreenMode(){
    document.getElementById('item-db-right').parentElement.remove();
    document.getElementById('item-db-left').parentElement.remove();
    
    var content = document.getElementById('content');
    content.classList.remove('web');
    content.style.marginTop = '0px';
    content.style.top = '32px';

    document.getElementsByClassName('header centered')[0].remove();
}

function removeSupportButton(){
    document.getElementsByClassName('btn-support2')[0].remove();
}

function move(scroller){
    if(divMove.innerText == '▲'){
        scroller.scroll({ top: 0 });
        divMove.innerText = '▼';
    }
    else{
        scroller.scroll({ top: scroller.scrollHeight });
        divMove.innerText = '▲';
    }

    divMove.classList.add('selected');
}

function addScrollHelper(){
    divMove.id= 'div-to-down';
    divMove.innerText = '▼'
    divMove.classList.add('tab');
    divMove.classList.add('legendary');
    divMove.classList.add('selected');
    divMove.style.fontSize = '2em';
    divMove.style.lineHeight = '0.5em';
    divMove.style.opacity = '0.75';
    divMove.onclick = function () { move(scroller); }

    document.getElementsByClassName('rarity-selector')[0].appendChild(divMove); 
}

function generateSearchHint(match, searchTerm){
    var hint = document.createElement('div');
    var index = match.toLowerCase().indexOf(searchTerm.toLowerCase());
    var innerHTML = "";

    if (index >= 0) { 
        if( index == 0){
            innerHTML = "<span class='hint-highlight'>" + match.substring(0, searchTerm.length) +  "</span>" + match.substring(searchTerm.length);
        }
        else{
            innerHTML = match.substring(0,index) + "<span class='hint-highlight'>" +  match.substring(index,index+searchTerm.length) +  "</span>" +  match.substring(index + searchTerm.length);
        }

        var skillClass = getSkillClass(match);

        if(skillClass){
            innerHTML += skillClass; 
        }

        hint.innerHTML = innerHTML;
    }
    else{
        hint.innerText = match;
    }
    hint.id = match;
    hint.classList.add('hint');
    autoCompleteList.appendChild(hint);

    hint.addEventListener('click', (event) => {
        var target = event.target;

        if(event.target.id === undefined){
            if(event.target.parentElement.id !== undefined){
                target = event.target.parentElement;
            }
            return;
        }

        if(chips.find(e => e.toLowerCase() === target.id))
            return;

        addAsChip(event.target);
    });
}

function addAsChip(element){
    generateChip(element.id);
    autoCompleteList.removeChild(element);
    searchBox.value = '';
    generateHints('');
}

function findHints(searchTerm){
    var term = searchTerm.toLowerCase();
    var matches = [];
    var counter = 0;

    for(let value of gameData){
        if(value.toLowerCase().indexOf(term) !== -1){
            counter ++;
            matches.push(value);
        }

        if(counter >= 200)
            break;
    }

    matches = matches.filter(element => !chips.find(rm => rm.toLowerCase() === element.toLowerCase()));

    return matches;
}

function generateHints(searchTerm){
    clearHints();

    let matches = findHints(searchTerm);

    matches.forEach((matchValue) => {
        generateSearchHint(matchValue, searchTerm);
    });

}

function clearHints(){
    while (autoCompleteList.firstChild)
        autoCompleteList.removeChild(autoCompleteList.firstChild);
}

function generateSearch(){
    setChipBoxVisibility('hidden');
    document.getElementsByClassName('bar-mid')[0].appendChild(searchWrapper);
    document.getElementsByClassName('input-block')[0].style.display = 'none';

    searchBox.classList.add('input');
    searchBox.style.paddingLeft = '268px';
    searchBox.placeholder = 'Enter search terms ...';
    searchIcon.classList.add('search-icon');

    searchButton.innerText = 'Search !';
    searchButton.classList.add('search-button');

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
    
    searchBox.addEventListener('keydown', event =>{
        if(event.shiftKey && event.key === 'Enter'){
            performSearch();
            return;
        }

        if (event.isComposing || event.key === 'Enter') {
            if(searchBox.value === '')
                return;

            if(chips.find(e => e.toLowerCase() === searchBox.value.toLowerCase()))
                return;

            generateChip(searchBox.value);
            searchBox.value = '';
          }
    });

    searchButton.addEventListener('click', () => {
        performSearch();
        setChipBoxVisibility('hidden');
    });

    chipBox.appendChild(chipBoxClear);
    searchWrapper.appendChild(searchBox);
    searchWrapper.appendChild(searchIcon);
    searchWrapper.appendChild(searchButton);
    searchWrapper.appendChild(chipBox);
}

function getSkillClass(term){
    for(let skill of skillData.Soldier.associations){
        if(skill == term){
            return "<span style='color: hsl(228deg 1% 48%);'> (Soldier)</span>";
        }
    }

    for(let skill of skillData.Demolitionist.associations){
        if(skill == term){
            return "<span style='color: hsl(228deg 1% 48%);'> (Demolitionist)</span>";
        }
    }
    
    for(let skill of skillData.Occultist.associations){
        if(skill == term){
            return "<span style='color: hsl(228deg 1% 48%);'> (Occultist)</span>";
        }
    }
    
    for(let skill of skillData.Arcanist.associations){
        if(skill == term){
            return "<span style='color: hsl(228deg 1% 48%);'> (Arcanist)</span>";
        }
    }
    
    for(let skill of skillData.Shaman.associations){
        if(skill == term){
            return "<span style='color: hsl(228deg 1% 48%);'> (Shaman)</span>";
        }
    }
    
    for(let skill of skillData.Inquisitor.associations){
        if(skill == term){
            return "<span style='color: hsl(228deg 1% 48%);'> (Inquisitor)</span>";
        }
    }
    
    for(let skill of skillData.Nightblade.associations){
        if(skill == term){
            return "<span style='color: hsl(228deg 1% 48%);'> (Occultist)</span>";
        }
    }
    
    for(let skill of skillData.Necromancer.associations){
        if(skill == term){
            return "<span style='color: hsl(228deg 1% 48%);'> (Necromancer)</span>";
        }
    }

    for(let skill of skillData.Oathkeeper.associations){
        if(skill == term){
            return "<span style='color: hsl(228deg 1% 48%);'> (Oathkeeper)</span>";
        }
    }
    return undefined;
}

function clearChipBox(){
    Array.from(chipList.children).forEach(function(item) {
        if(item.innerText !== 'clear') 
            chipList.removeChild(item);
     });
    
    chips = [];
    generateHints(searchBox.value);
}

function setChipBoxVisibility(value){
    chipBox.style.visibility = value;
}

function generateChip(value){
    var li = document.createElement('li');
    var liText = document.createElement('div');
    var liClose = document.createElement('div');

    liText.innerText = value;
    liText.classList.add('chip-text');

    liClose.classList.add('chip-close');
    li.appendChild(liText);
    li.appendChild(liClose);
    chipList.appendChild(li);
    chips.push(value);

    liClose.addEventListener('click', event => {
        chips.splice(chips.findIndex(e => e == event.currentTarget.parentElement.innerText), 1);
        chipList.removeChild(event.currentTarget.parentElement);
    })
}
