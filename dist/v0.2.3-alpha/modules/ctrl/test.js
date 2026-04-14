import {_pad, _kb, _padUpdate, _padCfg} from './ctrl.js';

// testing setup
const canv = document.createElement('canvas');
canv.width = 640;
canv.height = 360;
const ctx = canv.getContext('2d');
document.body.appendChild(canv);

// pad config
_padCfg.pointerTarget(canv);    // set the element that recieves mouse and touch interactions.

//_padCfg.pointerLock(true);      // if pointerLock is active, mouse ponter locks in after initial click and tracks movement instead of position.

_padCfg.tpAdd(                  // adds a specific touch area to interact as a button or axis on _pad[0].
  -1, -1, 1, 1,                 // x, y, w, h, from -1, -1(top left) to 1, 1(bottom right).
  'btn',                        // type, can be "swipe", "btn" or "stick".
  0,                            // mapping, specify which button/axis interacts with this area.
  -1                            // you can add a secondary button pulse for tapping action on any area.
);

_padCfg.tpRemove(-1,-1);        // removes a touch area, just needs x,y coordinates.

_padCfg.tpAdd(
  -1, -1, 1, 1,
  'swipe',
  [0, 1, 2, 3], 5
)

console.log(_padCfg.getKbMap());  // returns keyboard mappings.

_padCfg.kbAdd(                        // adds new key mappings
  {key: 'KeyG', map: [2, 'btn', 2]},
  {key: 'KeyP', map: [2, 'btn', 1]}
);

//_padCfg.kbRemove('Space', 'Tab');   // removes key mappings


// testing code
const drawAxis = (x,y,xAxis,yAxis)=>{
  ctx.strokeRect(x, y, 16, 16);
  ctx.fillRect(x + 4 + xAxis * 6,y + 4 + yAxis * 6,8,8);
}
const drawBtn = (x,y,btn,w,h)=>{
  ctx.strokeRect(x, y, w, h);
  if(btn){
    ctx.fillRect(x + 1, y + 1, w-2, h-2);
  }
}
const drawPad = (pad,x,y)=>{
  ctx.strokeStyle = '#00f';
  ctx.strokeRect(x, y, 120, 60);
  
  drawAxis(
    x + 8, y + 20, pad.axis[0], pad.axis[1]
  );
  drawAxis(
    x + 72, y + 40, pad.axis[2], pad.axis[3]
  );

  const bX = x + 86;
  const bY = y + 14;
  drawBtn(bX + 10, bY, pad.btn[0],8,8);
  drawBtn(bX + 20, bY + 10, pad.btn[1],8,8);
  drawBtn(bX + 10, bY + 20, pad.btn[2],8,8);
  drawBtn(bX, bY + 10, pad.btn[3],8,8);

  drawBtn(x + 4, y, pad.btn[4],24,8);
  drawBtn(x + 92, y, pad.btn[5],24,8);
  
  drawBtn(x + 42, y + 40, pad.btn[6],8,4);
  drawBtn(x + 54, y + 40, pad.btn[7],8,4);
}

const player0 = {
  x: 480,
  y: 180,
  color: "#123"
}

const player1 = {
  x: 160,
  y: 180,
  color: "#321"
}

const updatePlayerColor = (player, pad)=>{
  let colorChange = pad.btn[0] ? '#f00' :
    pad.btn[1] ? '#0f0' :
    pad.btn[2] ? '#00f' :
    pad.btn[3] ? '#f0f' :
    pad.btn[4] ? '#0ff' :
    pad.btn[5] ? '#ff0' :
    pad.btn[6] ? '#08f' :
    pad.btn[7] ? '#f80' :
    false;
  if(colorChange){
    player.color = colorChange;
  }
}

setInterval(
  function(){
    _padUpdate();
    ctx.clearRect(0,0,640,360);
    
    // drawing pads:
    drawPad(_pad[0], 200,200);
    drawPad(_pad[1], 4, 4);
    drawPad(_pad[2], 176, 4);
    drawPad(_pad[3], 4, 86);
    drawPad(_pad[4], 176, 86);
    ctx.strokeStyle = '#0f0';
    ctx.strokeRect(
      312 + _pad[0].axis[2] * 320,    //640w
      172 + _pad[0].axis[3] * 180,     //360h
      16, 16
    );
    const kbInput = _kb.input();
    if(kbInput.length) console.log(kbInput);

    // updating players:
    player0.x = Math.max(0, Math.min(player0.x + 8 * _pad[0].axis[2], 640));
    player0.y = Math.max(0, Math.min(player0.y + 8 * _pad[0].axis[3], 360));
    updatePlayerColor(player0, _pad[0]);
    ctx.fillStyle = player0.color;
    ctx.fillRect(player0.x - 20, player0.y  -20, 40, 40);
    
    player1.x = Math.max(0, Math.min(player1.x + 8 * _pad[1].axis[0], 640));
    player1.y = Math.max(0, Math.min(player1.y + 8 * _pad[1].axis[1], 360));
    updatePlayerColor(player1, _pad[1]);
    ctx.fillStyle = player1.color;
    ctx.fillRect(player1.x - 20, player1.y  -20, 40, 40);
  },16
);

_kb.typeMode(false);