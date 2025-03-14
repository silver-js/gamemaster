// init
let playState = false;
const domPlayStop = document.getElementById('play-stop-btn');
const domEditor = document.getElementById('editor-wrapper');
const domGame = document.getElementById('game-wrapper');
const gameWindow = document.getElementById('game-iframe');

const integrityCheck = (code)=>{
  try{
    Function(code);
    return true;
  }
  catch(e){
    console.log('COMPILATION ERROR:', e);
    const codeArr = code.split('\n');
    let lineError = 0;
    for(let i = codeArr.length; i >= 0; i--){
      try{
        Function(codeArr.slice(0, i).join('\n'));
        lineError = i + 1;
        i= -1;
      }
      catch(e2){}
    }
    alert(`COMPILATION ERROR on line ${codeLineOffset + lineError}:\n ${codeArr[lineError - 1]}`);
    return false;
  }
}
const preCode = `<head><style>*{color:pink;}</style></head><body><div id="game-wrapper"></div></body>`;
const preScripts = `<script type="module">import {_loop, _pad, _cfg} from './modules/gmCore_min.js';import gfx from './modules/gfx.js';for(let k in console){console[k] = parent.console[k];}try{`;
const endScript = `}catch(_e){console.log(_e);}</script>`;

const playRom = (code)=>{
  /*
  let atlasCode = 'let _al;'
  const atlas = db.rom.atlas;
  for(let k in atlas){
    atlasCode += `let ${k} = [];_al = async ()=>{let x = await gfx.loadAtlas('${atlas[k].src}', ${atlas[k].tileSize}, ${atlas[k].scale}, ${atlas[k].offsetX}, ${atlas[k].offsetY}, ${atlas[k].hMargin}, ${atlas[k].vMargin});${k} = x};_al();`;
  }
  atlasCode += `_al=null;`;
  try{
    gameWindow.srcdoc = headHtml + bodyHtml + preScript + atlasCode + romCode + endScript
  }
  catch(_e){
  }
  */
  gameWindow.srcdoc = preCode + preScripts + code + endScript;
}
const stopRom = ()=>{
  gameWindow.srcdoc = '';
}
const playPause = ()=>{
  playState = !playState;
  domPlayStop.innerHTML = playState?'&#x23f9 Stop':'&#9658 Play';
  domEditor.style.display = playState?'none':'flex';
  domGame.style.display = playState?'flex':'none';
  const romCode = db.rom.code.join('\n');
  if(playState){
    console.clear();
    if(integrityCheck(romCode)){
      playRom(romCode);
    }
    return
  }
  stopRom()
}
domPlayStop.addEventListener('click',playPause);

