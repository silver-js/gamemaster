//// <-- Init --> ////
import {db, dbUpdateData, dbUpdateRom, dbDeleteEntry} from './idbManager.js';
import {playRom, stopRom} from './romPlayer.js';
const codeLineOffset = 7;


//// <-- DOM --> ////

// rom
const domTitle = document.getElementById('game-title');
const domPlayStop = document.getElementById('play-stop-btn');

// editor & player
const domEditor = document.getElementById('editor-wrapper');
const domGame = document.getElementById('game-wrapper');

// code
const domCodePages = document.getElementById('pages-list');
const domCodeText = document.querySelector('#code-area textarea');
const domCodePre = document.querySelector('#code-area pre');


//// <-- UI --> ////

domTitle.addEventListener('click', ()=>{
  const author = prompt('Author Name: ', db.rom.author);
  if(author && author != db.rom.author){
    db.rom.author = author;
    dbUpdateData('author');
  }
  const name = prompt('Project Name: ', db.rom.name);
  if(name && name != db.rom.name){
    db.rom.name = name;
    dbUpdateData('name');
  }
  const version = prompt('Version: ', db.rom.version);
  if(version && version != db.rom.version){
    db.rom.version = version;
    dbUpdateData('version');
  }
  updateData();
});

const updateData = ()=>{
  domTitle.innerText = `${db.rom.name} v${db.rom.version}`;
}


//// <-- Code editor --> ////

let codePage = 2;
let codeLine = 0;

const codeScroll = ()=>{
  const code = document.querySelector('#code-area code');
  code.scrollTop = domCodeText.scrollTop;
  code.scrollLeft = domCodeText.scrollLeft;
}

const renderCode = (e)=>{
  if( e && e.inputType == 'insertLineBreak'){
    const cPoint = e.target.selectionStart;
    const preStr = e.target.value.slice(0,cPoint);
    let padding = '';
    preStr.split('\n').splice(-2)[0].replace(/^[\t\s]+/g, (x)=>{
      padding = x;
    });
    e.target.value = preStr + padding + e.target.value.slice(cPoint);
  }
    db.rom.code[codePage] = domCodeText.value;
    dbUpdateRom('code', codePage);
  let i = codeLine + 1;
  domCodePre.innerHTML = `<code class="language-javascript">\n/*${(i++).toString().padStart(5," ")}*/ ${domCodeText.value.replace(
    /\n/g, ()=>`\n/*${(i++).toString().padStart(5," ")}*/ `
    )}</code>`;
  hljs.highlightAll();
  codeScroll();
};
domCodeText.addEventListener('input', renderCode);
domCodeText.addEventListener('keydown', e=>{
  if(e.key == 'Tab'){
    e.preventDefault();
    const cPoint = e.target.selectionStart;
    e.target.value = e.target.value.slice(0,cPoint) + '\t' + e.target.value.slice(cPoint);
    e.target.selectionStart = cPoint + 1;
    e.target.selectionEnd = cPoint + 1;
    renderCode();
  }
});
domCodeText.addEventListener('scroll', codeScroll);

const switchPage = (val)=>{
  if(val >= 0){
    const lastPage = document.querySelector('#pages-list .selected');
    if(lastPage){
      lastPage.classList.remove('selected');
    }
    const nextPage = document.querySelector(`#pages-list li[value="${val}"]`);
    if(nextPage){
      nextPage.classList.add('selected');
    }
    codePage = val;
    codeLine = codePage ? db.rom.code.slice(0,codePage).join('\n').split('\n').length + codeLineOffset: codeLineOffset;
    domCodeText.value = db.rom.code[codePage];
    renderCode();
  }else if(val == -1){
    db.rom.code.push('');
    loadCode();
    switchPage(db.rom.code.length - 1)
  }
  domCodeText.focus();
}
domCodePages.addEventListener('click', e =>{
  switchPage(e.target.value);
});
domCodePages.addEventListener('contextmenu', e =>{
  e.preventDefault();
  const p = e.target.value;
  if(p >= 0 && db.rom.code.length > 1 && confirm(`Delete page ${p+1}?`)){
    db.rom.code.splice(p,1);
    for(let i = p; i < db.rom.code.length; i++){
      dbUpdateRom('code', i);
    }
    dbDeleteEntry('code', db.rom.code.length);
    loadCode();
    switchPage(codePage < p ? codePage : codePage - 1);
  }
});

const loadCode = ()=>{
  domCodePages.innerHTML = '';
  db.rom.code.forEach((n, i)=>{
    domCodePages.innerHTML += `<li${i == 0 ? ' class = "selected"' : ''} value=${i}>${i+1}</li>`
  });
  domCodePages.innerHTML += '<li value=-1>+</li>';
}

db.onload = ()=>{
  updateData();
  loadCode();
  switchPage(0);
}


// project menu
document.getElementById('project-new-btn').addEventListener('click', e=>{
  const ok = confirm('Create new project?\n All unsaved data will be lost!')
  if(ok){
    window.indexedDB.deleteDatabase('rom');
    location.reload();
  }
});
document.getElementById('project-save-btn').addEventListener('click', e=>{
  const romJson = JSON.stringify(db.rom);
  
  const link = document.createElement('a');
  const file = new Blob([romJson], {type: 'text/plain'});
  link.href = URL.createObjectURL(file);
  link.download = `${db.rom.name} v${db.rom.version}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
});
document.getElementById('project-load-btn').addEventListener('click', e=>{
  const input = document.createElement('input');
  input.type = 'file';
  input.onchange = (e)=>{
    try{
      const file = e.target.files[0];

      const reader = new FileReader();
      reader.readAsText(file,'UTF-8');
      // here we tell the reader what to do when it's done reading...
      reader.onload = readerEvent => {
        try{
          var content = readerEvent.target.result; // this is the content!
          const loadedRom = JSON.parse(content);
          if(Array.isArray(loadedRom.code) && Array.isArray(loadedRom.maps) && Array.isArray(loadedRom.gfx) && Array.isArray(loadedRom.sfx)){
            db.rom = loadedRom;
            db.onload();
            return
          }
          alert('Invalid ROM data!');

        }
        catch(err2){
          alert('Invalid ROM File!');
          console.log(err2)
        }
      }
    }
    catch(err){
      console.log(err)
    }
  }
  input.click();
})


// ux

let playState = false;
const playPause = ()=>{
  playState = !playState;
  domPlayStop.innerHTML = playState?'&#x23f9 Stop':'&#9658 Play';
  domEditor.style.display = playState?'none':'flex';
  domGame.style.display = playState?'flex':'none';
  if(playState){
    playRom(db.rom);
    return
  }
  stopRom()
}
domPlayStop.addEventListener('click',playPause);




