// init
let playState = false;
window.myLog = '';
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
const htmlStart = `<!doctype html><html>
  <head><title>My Game</title><style>*{margin:0;padding:0;box-sizing:border-box;}html{height:100%;}body{background:#000;display:flex;justify-content:space-evenly;align-items:center;height:100%;}#game-wrapper{flex-grow:100;}</style></head>
  <body><div id="game-wrapper"></div></body>
  <script type="module">import {_loop, _pad, _cfg} from './modules/gmCore_min.js';import _gfx from './modules/gfx.js';_cfg.pointerTarget(_gfx.canv);try{
`;
const htmlEnd = `
}catch(_e){console.log(_e.stack);}</script></html>`

const htmlLogger = `
  for(let key in console){
    console[key] = (...args) =>{
      parent.console[key](...args);
    }
  }
`;


const playRom = (code)=>{
  let codeResDeclarations = '';
  let codeResLoader = 'let gfxLoaded=false;(async()=>{';
  for(let key in db.rom.atlas){
    const x = db.rom.atlas[key];
    codeResDeclarations += `let ${key};`
    codeResLoader += `${key}=await _gfx.loadAtlas('${x.src}', ${x.tileSize}, ${x.scale}, ${x.offsetX}, ${x.offsetY}, ${x.hMargin}, ${x.vMargin});`
  }
  codeResLoader += 'gfxLoaded=true})();'; 
  gameWindow.srcdoc = htmlStart + htmlLogger + codeResDeclarations + codeResLoader + code + htmlEnd;
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

