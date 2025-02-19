import {_pad, _padUpdate, _padCfg} from './ctrl_min.js';

// testing setup
const canv = document.createElement('canvas');
canv.width = 640;
canv.height = 360;
const ctx = canv.getContext('2d');
document.body.appendChild(canv);

// pad config
_padCfg.pointerTarget(canv);    // set the element that recieves mouse and touch interactions.

_padCfg.pointerLock(true);      // if pointerLock is active, mouse ponter locks in after initial click and tracks movement instead of position.

_padCfg.tpAdd(                  // adds a specific touch area to interact as a button or axis on _pad[0].
  -1, -1, 1, 1,                 // x, y, w, h, from -1, -1(top left) to 1, 1(bottom right).
  'btn',                        // type, can be "swipe", "btn" or "stick".
  0,                            // mapping, specify which button/axis interacts with this area.
  -1                            // you can add a secondary button pulse for tapping action on any area.
);

_padCfg.tpRemove(-1,-1);        // removes a touch area, just needs x,y coordinates.

console.log(_padCfg.getKbMap());  // returns keyboard mappings.

_padCfg.kbAdd(                        // adds new key mappings
  {key: 'KeyG', map: [2, 'btn', 2]},
  {key: 'KeyP', map: [2, 'btn', 1]}
);

_padCfg.kbRemove('Space', 'Tab');   // removes key mappings


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
  drawBtn(bX + 10, bY + 20, pad.btn[0],8,8);
  drawBtn(bX, bY + 10, pad.btn[1],8,8);
  drawBtn(bX + 20, bY + 10, pad.btn[2],8,8);
  drawBtn(bX + 10, bY, pad.btn[3],8,8);

  drawBtn(x + 4, y, pad.btn[4],24,8);
  drawBtn(x + 92, y, pad.btn[5],24,8);
  
  drawBtn(x + 42, y + 40, pad.btn[6],8,4);
  drawBtn(x + 54, y + 40, pad.btn[7],8,4);
}


setInterval(
  function(){
    ctx.clearRect(0,0,640,360);
    drawPad(_pad[0], 200,200);
    drawPad(_pad[1], 4, 4);
    drawPad(_pad[2], 176, 4);
    drawPad(_pad[3], 4, 86);
    drawPad(_pad[4], 176, 86);
    ctx.strokeStyle = '#0f0';
    ctx.strokeRect(312 + _pad[0].axis[0] * 32, 172 + _pad[0].axis[1] * 32, 16, 16);
    ctx.fillText(_pad[0].axis[1],100,300)
    _padUpdate()
  },33
);
