import cpu from './cpu.js';
let timer = performance.now() + 1000;
let ups = 0;
let fps = 0;
cpu.setClock(240);
cpu.setFps(240);

cpu.draw = ()=>{
  fps++;
  if(performance.now() > timer){
    timer+=1000;
    document.body.innerHTML = `FPS= ${fps}<br/>UPS= ${ups}`;
    ups = 0;
    fps = 0;
  }
};
cpu.update = ()=>{
  ups++;
};

