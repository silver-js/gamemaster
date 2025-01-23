import {_loop, _pad, _cfg} from './gmCore_min.js';
// setup
const canv = document.getElementById('game');
const ctx = canv.getContext('2d');

_cfg.pointerTarget(canv);
_cfg.setClock(60);

//_cfg.tpAdd(-1,-.5,.8,.5,'btn',4);
//_cfg.tpRemove(-1,-.5);
_cfg.tpAdd(.2,-1,.8,.5,'btn',5);
_cfg.tpAdd(-1,0,1,1,'stick',[0,1],4);
_cfg.tpAdd(0,0,1,1,'swipe',[0,1,2,-1],5);


// draw methods
const drawCircle = (x,y,r,clr)=>{
  ctx.fillStyle = clr;
  ctx.beginPath();
  ctx.arc(x,y,r,0,Math.PI*2);
  ctx.fill();
}
const drawPad = (x,y,pad)=>{
  ctx.fillRect(x,y,128,64);
  drawCircle(x+20,y+32,12,'#fff8');
  drawCircle(
    x+20 + 8 * pad.axis[0],
    y+32 + 8 * pad.axis[1],
    8,'#0008'
  );  //a0-1
  drawCircle(x+78,y+46,12,'#fff8');
  drawCircle(
    x+78 + 8 * pad.axis[2],
    y+46 + 8 * pad.axis[3],
    8, '#0008'
  ); //a2-3

  drawCircle(x+108,y+32,16,'#fff8');

  ctx.fillStyle=pad.btn[0]?'#f00':'#0808';   //btn0
  ctx.fillRect(x+104,y+37,8,8);
  ctx.fillStyle=pad.btn[1]?'#0f0':'#0808';
  ctx.fillRect(x+113,y+28,8,8);
  ctx.fillStyle=pad.btn[2]?'#00f':'#0808';
  ctx.fillRect(x+95,y+28,8,8);
  ctx.fillStyle=pad.btn[3]?'#ff0':'#0808';   //btn3
  ctx.fillRect(x+104,y+19,8,8);
  ctx.fillStyle=pad.btn[4]?'#fff':'#0808';
  ctx.fillRect(x+2,y+2,32,8);
  ctx.fillStyle=pad.btn[5]?'#fff':'#0808';
  ctx.fillRect(x+94,y+2,32,8);

  drawCircle(x+48,y+32,4,'#000');  // btn6
  drawCircle(x+48,y+32,3,pad.btn[6] ? '#fff':'#000');  // btn6

  drawCircle(x+58,y+32,4,'#000'); // btn7
  drawCircle(x+58,y+32,3,pad.btn[7] ? '#fff':'#000');  // btn6
}


// init
let hue = 0;
let pointerX = 0;
let pointerY = 0;


_loop.update = ()=>{
  hue = (hue + 5) % 360;
  pointerX = Math.min(640,Math.max((pointerX + _pad[0].axis[2]*32), 0));
  pointerY = Math.min(360,Math.max((pointerY + _pad[0].axis[3]*32), 0));
  if(_pad[0].btn[4]){
    _cfg.pointerLock(true);
  }
  if(_pad[0].btn[5]){
    _cfg.pointerLock(false);
  }
}
_loop.draw = ()=>{
  ctx.clearRect(0,0,640,360);
  ctx.fillStyle = `hsl(${hue},50%,50%)`;
  drawPad(240,10,_pad[0]);
  ctx.fillStyle = `hsl(${hue+45},50%,50%)`;
  drawPad(120,140, _pad[1]);
  ctx.fillStyle = `hsl(${hue+90},50%,50%)`;
  drawPad(390,140, _pad[2]);
  ctx.fillStyle = `hsl(${hue+135},50%,50%)`;
  drawPad(120,260, _pad[3]);
  ctx.fillStyle = `hsl(${hue+180},50%,50%)`;
  drawPad(390,260, _pad[4]);
  ctx.strokeStyle='#246';
  ctx.beginPath();
  ctx.lineWidth = 1;
  const x = 320 + _pad[0].axis[2] * 320;
  const y = 180 + _pad[0].axis[3] * 180;
  ctx.moveTo(x - 16, y);
  ctx.lineTo(x + 16, y);
  ctx.moveTo(x, y - 16);
  ctx.lineTo(x, y + 16);
  ctx.stroke();
  ctx.strokeRect(.2*320+320,.5*-180+180,.8*320,.5*-180);
  ctx.strokeRect(-1*320+320,-1*-180+180,1*320,1*-180);
  ctx.strokeRect(0*320+320,-1*-180+180,1*320,1*-180);
  drawCircle(pointerX,pointerY,24,'#f008');
}

_cfg.kbAdd({key: 'KeyY', map: [2, 'btn', 3]});
//_cfg.kbRemove('KeyW','KeyJ');
console.log(_cfg.getKbMap());
