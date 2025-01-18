import {j0} from './ctrl.js';

// testing setup
const canv = document.createElement('canvas');
canv.width = 640;
canv.height = 360;
const ctx = canv.getContext('2d');
document.body.appendChild(canv);

const drawAxis = (x,y,xAxis,yAxis)=>{
  ctx.strokeRect(x, y, 16, 16);
  ctx.fillRect(x + 4 + xAxis/125,y + 4 + yAxis/125,8,8);
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
    x + 8, y + 20, pad.axis(0), pad.axis(1)
  );
  drawAxis(
    x + 72, y + 40, pad.axis(2), pad.axis(3)
  );

  const bX = x + 86;
  const bY = y + 14;
  drawBtn(bX + 10, bY + 20, pad.btn(0),8,8);
  drawBtn(bX, bY + 10, pad.btn(1),8,8);
  drawBtn(bX + 20, bY + 10, pad.btn(2),8,8);
  drawBtn(bX + 10, bY, pad.btn(3),8,8);

  drawBtn(x + 4, y, pad.btn(4),24,8);
  drawBtn(x + 92, y, pad.btn(5),24,8);
  
  drawBtn(x + 42, y + 40, pad.btn(6),8,4);
  drawBtn(x + 54, y + 40, pad.btn(7),8,4);
}
j0.target(canv);




setInterval(
  function(){
    ctx.clearRect(0,0,640,360);
    drawPad(j0,200,200);
    //drawPad(j1, 4, 4);
    //drawPad(j2, 176, 4);
    //drawPad(j3, 4, 86);
    //drawPad(j4, 176, 86);
    ctx.strokeStyle = '#0f0';
    ctx.strokeRect(312 + j0.axis(0) * .32, 172 + j0.axis(1) * .32, 16, 16);
    ctx.fillText(j0.axis(1),100,300)
  },33
);

//jConf.ptTarget(canv);
//jConf.kbClean(1,'axis', 2, false);
//jConf.kbRemap(1,'btn', 7);
