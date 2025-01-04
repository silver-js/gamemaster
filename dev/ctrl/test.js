import {j0, j1, j2, j3, j4, jConf} from './ctrl.js';

const canv = document.createElement('canvas');
canv.width = 640;
canv.height = 360;
const ctx = canv.getContext('2d');
document.body.appendChild(canv);

const drawPad = (j,x,y)=>{
  ctx.strokeStyle = '#00f';
  ctx.strokeRect(x, y, 120, 60);
  
  const a1X = x + 8;
  const a1Y = y + 20;
  ctx.strokeRect(a1X, a1Y, 16, 16);
  ctx.fillRect(a1X + 4 + j.axis[0]/16,a1Y + 4 - j.axis[1]/16,8,8);

  const a2X = x + 72;
  const a2Y = y + 40;
  ctx.strokeRect(a2X, a2Y, 16, 16);

  const bX = x + 86;
  const bY = y + 14;
  ctx.strokeRect(bX + 10, bY + 20, 8, 8);
  if(j.btn[0]){
    ctx.fillRect(bX + 11,bY + 21,6,6);
  }
  ctx.strokeRect(bX, bY + 10, 8, 8);
  if(j.btn[1]){
    ctx.fillRect(bX + 1,bY + 11,6,6);
  }
  ctx.strokeRect(bX + 20, bY + 10, 8, 8);
  if(j.btn[2]){
    ctx.fillRect(bX + 21,bY + 11,6,6);
  }
  ctx.strokeRect(bX + 10, bY, 8, 8);
  if(j.btn[3]){
    ctx.fillRect(bX + 11,bY + 1,6,6);
  }

  ctx.strokeRect(x + 4, y, 24, 8);
  if(j.btn[4]){
    ctx.fillRect(x + 5, y + 1, 22, 6);
  }
  ctx.strokeRect(x + 92, y, 24, 8);
  if(j.btn[5]){
    ctx.fillRect(x + 93, y + 1, 22, 6);
  }

  const mnuX = x + 42;
  const mnuY = y + 40;
  ctx.strokeRect(mnuX,mnuY,8,4);
  if(j.btn[6]){
    ctx.fillRect(mnuX + 1,mnuY + 1,6,2);
  }
  ctx.strokeRect(mnuX + 12,mnuY,8,4);
  if(j.btn[7]){
    ctx.fillRect(mnuX + 13,mnuY + 1,6,2);
  }
}





setInterval(
  function(){
    ctx.clearRect(0,0,640,360);
    drawPad(j0,200,200);
    drawPad(j1, 4, 4);
    drawPad(j2, 176, 4);
    drawPad(j3, 4, 86);
    drawPad(j4, 176, 86);
    ctx.strokeStyle = '#0f0';
    ctx.strokeRect(j0.axis[0] - 8, j0.axis[1] - 8, 16, 16);
    ctx.fillText(j0.axis[0],100,300)
  },33
);

jConf.ptTarget(canv);
//jConf.kbClean(1,'axis', 2, false);
//jConf.kbRemap(1,'btn', 7);
