const timer = new Float64Array(3);                // cpu, gpu, now
const delay = new Float32Array(3).fill(100 / 3);  // cpu, gpu

const calcTimeout = ()=>{
    delay[2] = Math.min(delay[0], delay[1])/4;
}
calcTimeout();

export const _loop = {
  update: ()=>{},
  draw: ()=>{},
  setClock: (x)=>{
    delay[0] = 1000 / x;
    calcTimeout();
  },
  setFps: (x)=>{
    delay[1] = 1000 / x;
    calcTimeout();
  }
}

const tick = ()=>{
  timer[2] = performance.now();
  while(timer[0] < timer[2]){
    _loop.update();
    timer[0] += delay[0];
  }
  if(timer[1] < timer[2]){
    _loop.draw();
    while(timer[1] < timer[2]){
      timer[1] += delay[1];
    }
  }
  setTimeout(tick, delay[2]);
}
tick();


