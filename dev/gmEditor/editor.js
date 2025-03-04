//// <-- Init --> ////
import {db} from './idbManager.js';


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
    putData('game_data', {key: 'author', value: author});
  }
  const name = prompt('Project Name: ', db.rom.name);
  if(name && name != db.rom.name){
    db.rom.name = name;
    putData('game_data', {key: 'name', value: name});
  }
  const version = prompt('Version: ', db.rom.version);
  if(version && version != rom.version){
    db.rom.version = version;
    putData('game_data', {key: 'version', value: version});
  }
  ipdateTitle();
});

const updateTitle = ()=>{
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
  let i = codeLine;
  domCodePre.innerHTML = `<code class="language-javascript">\n/*${(i++).toString().padStart(3,"0")}*/ ${domCodeText.value.replace(
    /\n/g, ()=>`\n/*${(i++).toString().padStart(3,"0")}*/ `
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


domCodePages.addEventListener('click', e =>{
  const val = e.target.value;
  if(val >= 0){
    document.querySelector('#pages-list .selected').classList.remove('selected');
    e.target.classList.add('selected');
    codePage = e.target.value;
    const prevCodeStr = db.rom.code.slice(0,codePage).join('\n');
    codeLine = (prevCodeStr.match('\n') || '').length + 1;
    domCodeText.value = db.rom.code[codePage];
    renderCode();
  }else if(val == -1){
    db.rom.code.push('');
    loadCode();
  }
});
domCodePages.addEventListener('contextmenu', e =>{
  e.preventDefault();
  const p = e.target.value;
  if(p >= 0 && db.rom.code.length > 1 && confirm(`Delete page ${p+1}?`)){
    db.rom.code.splice(p,1);
    loadCode();
  }
});

const updateCode = ()=>{
  domCodeText.value = 'aslkdjasdlkjasdlk';
  renderCode();
}
const loadCode = ()=>{
  codePage = 0;
  domCodePages.innerHTML = '';
  db.rom.code.forEach((n, i)=>{
    domCodePages.innerHTML += `<li${i == 0 ? ' class = "selected"' : ''} value=${i}>${i+1}</li>`
  });
  domCodePages.innerHTML += '<li value=-1>+</li>';
  domCodeText.value = db.rom.code[0];
  renderCode();
}











db.onload = ()=>{
  updateTitle();
  loadCode();
}


const pageClick = (e)=>{
  console.log(e.data);
}
const updateCodePages = ()=>{
  domPages.innerHTML = '';
  rom.code.forEach((n, i)=>{
    const ele = document.createElement('li');
    ele.data = i;
    ele.innerText = i + 1;
    domPages.appendChild(ele);


  });
}

// title data

// code update / highlight



// ux
let playState = false;
const playPause = ()=>{
  playState = !playState;
  domPlayStop.innerHTML = playState?'&#x23f9 Stop':'&#9658 Play';
  domEditor.style.display = playState?'none':'flex';
  domGame.style.display = playState?'flex':'none';
}
domPlayStop.addEventListener('click',playPause);




