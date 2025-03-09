// init
let playState = false;
const domPlayStop = document.getElementById('play-stop-btn');
const domEditor = document.getElementById('editor-wrapper');
const domGame = document.getElementById('game-wrapper');

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

const gameWindow = document.getElementById('game-iframe');
const headHtml = `
  <head>
    <style>
      *{
        color:pink;
      }
    </style>
  </head>
`;
const bodyHtml = `
  <body>
    <div id="game-wrapper"></div>
  </body>
`;
const preScript = `
<script type="module">
  import {_loop, _pad, _cfg} from './modules/gmCore_min.js';
  import gfx from './modules/gfx.js';
  for(let k in console){
    console[k] = parent.console[k];
  }
  try{
`;
const endScript = `
  }
  catch(_e){
    console.log(_e);
}
</script>
`;
export const playRom = (romData)=>{
  const romCode = romData.code.join('\n');
  try{
    console.clear();
    Function(romCode);
    gameWindow.srcdoc = headHtml + bodyHtml + preScript + romCode + endScript
  }
  catch(_e){
    const strArr = romCode.split('\n');
    let lastLine = "";
    
    for(let i = strArr.length; i > 0; i--){
      lastLine = strArr.pop();
      try{
        Function(strArr.join('\n'));
        for(let j = lastLine.length - 1; j > -1; j--){
          try{
            Function(strArr.join('\n') + lastLine.slice(0,j));
            console.error(`ROM compilation Error, line ${i + lineOffset}, position ${j}.\n`,_e);
            j = -1;
          }
          catch(_errj){}
        }
        i = 0;
      }
      catch(_erri){}
    }
  }
}
export const stopRom = ()=>{
  gameWindow.srcdoc = '';
}
