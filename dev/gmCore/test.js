import {_loop, _pad, _cfg} from './gmCore.js';
// setup
const canv = document.getElementById('game');
const ctx = canv.getContext('2d');

_cfg.pointerTarget(canv);
_cfg.setClock(10);

_cfg.tpAdd(-1,.5,.8,.5,'btn',4);
_cfg.tpRemove(-1,.5);
_cfg.tpAdd(.2,.5,.8,.5,'btn',5);
_cfg.tpAdd(-1,-1,1,1,'stick',[0,1],4);
_cfg.tpAdd(0,-1,1,1,'swipe',[1,2,-1,0],5);


// draw methods
const drawCircle = (x,y,r,clr)=>{
  ctx.fillStyle = clr;
  ctx.beginPath();
  ctx.arc(x,y,r,0,Math.PI*2);
  ctx.fill();
}
const drawPad = (x,y,pad)=>{
   ctx.fillRect(x,y,256,128);
   drawCircle(x+40,y+64,24,'#fff8');
   drawCircle(
     x+40 + 16 * pad.axis[0],
     y+64 - 16 * pad.axis[1],
     16,'#0008'
    );  //a0-1
   drawCircle(x+156,y+92,24,'#fff8');
   
   drawCircle(
     x+156 + 16 * pad.axis[2],
     y+92 - 16 * pad.axis[3],
     16, '#0008'
    ); //a2-3
   drawCircle(x+216,y+64,32,'#fff8');
   
   ctx.fillStyle=pad.btn[0]?'#fff':'#0808';   //btn0
   ctx.fillRect(x+208,y+74,16,16);
   ctx.fillStyle=pad.btn[1]?'#fff':'#0808';
   ctx.fillRect(x+190,y+56,16,16);
   ctx.fillStyle=pad.btn[2]?'#fff':'#0808';
   ctx.fillRect(x+226,y+56,16,16);
   ctx.fillStyle=pad.btn[3]?'#fff':'#0808';   //btn3
   ctx.fillRect(x+208,y+38,16,16);
   ctx.fillStyle=pad.btn[4]?'#fff':'#0808';
   ctx.fillRect(x+4,y+4,64,16);
   ctx.fillStyle=pad.btn[5]?'#fff':'#0808';
   ctx.fillRect(x+188,y+4,64,16);
   
   drawCircle(x+96,y+64,8,'#000');  // btn6
   drawCircle(x+116,y+64,8,'#000'); // btn7
}


// init
let hue = 0;
let pointerX = 0;
let pointerY = 0;


_loop.update = ()=>{
  hue = (hue + 5) % 360;
  pointerX += _pad[0].axis[2]*10;
  pointerY -= _pad[0].axis[3]*10;
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
  drawPad(10,10,_pad[0]);
  ctx.strokeStyle='#246';
  ctx.beginPath();
  ctx.lineWidth = 3;
  const x = 320 + _pad[0].axis[2] * 320;
  const y = 180 - _pad[0].axis[3] * 180;
  ctx.moveTo(x - 16, y);
  ctx.lineTo(x + 16, y);
  ctx.moveTo(x, y - 16);
  ctx.lineTo(x, y + 16);
  ctx.stroke();
  ctx.strokeRect(.2*320+320,.5*-180+180,.8*320,.5*-180);
  ctx.strokeRect(-1*320+320,-1*-180+180,1*320,1*-180);
  ctx.strokeRect(0*320+320,-1*-180+180,1*320,1*-180);
  drawCircle(pointerX+156,pointerY+92,24,'#f008');
}

