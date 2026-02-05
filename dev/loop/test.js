import {_loop} from './loop_min.js';
let timer = performance.now() + 1000;
let ups = 0;
let fps = 0;
_loop.setClock(60);
_loop.setFps(60);


// init
const canv = document.getElementById('game-canvas');
const ctx = canv.getContext('2d');
const point = {
  x:Math.floor(Math.random() * 320),
  y:Math.floor(Math.random() * 320),
  w: 16,
  sx:Math.floor(Math.random() * 8 + 4),
  sy:Math.floor(Math.random() * 8 + 4),
};
let cpuData = '';

// loops
_loop.draw = ()=>{
  fps++;
  ctx.clearRect(0, 0, 320, 320);
  ctx.fillText(cpuData, 10, 10);
  ctx.fillRect(point.x - point.w / 2, point.y - point.w / 2, point.w, point.w);
  if(performance.now() > timer){
    timer += 1000;
    cpuData = `${fps}fps, ${ups}ups`;
    ups = 0;
    fps = 0;
  }
};
_loop.update = ()=>{
  ups++;
  point.x += point.sx;
  point.y += point.sy;
  if(point.x > 320){
    point.sx = - Math.floor(Math.random() * 8 + 4);
  }
  if(point.y > 320){
    point.sy = - Math.floor(Math.random() * 8 + 4);
  }
  if(point.x < 0){
    point.sx = Math.floor(Math.random() * 8 + 4);
  }
  if(point.y < 0){
    point.sy = Math.floor(Math.random() * 8 + 4);
  }
};
