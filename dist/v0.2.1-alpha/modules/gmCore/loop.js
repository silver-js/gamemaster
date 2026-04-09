const timer = new Float64Array(6).fill(100 / 3);  // cpu, cDelay, gpu, gDelay, now, delay

const calcTimeout = ()=>{
    timer[5] = Math.min(timer[1], timer[3])/4;
}

export const _loop = {
  update: ()=>{},
  draw: ()=>{},
  setClock: (x)=>{
    timer[1] = 1000 / x;
    calcTimeout();
  },
  setFps: (x)=>{
    timer[3] = 1000 / x;
    calcTimeout();
  }
}

const tick = ()=>{
  timer[4] = performance.now();
  while(timer[0] < timer[4]){
    _loop.update();
    timer[0] += (timer[4] - timer[0]) > (8 * timer[1]) ? timer[1] * 8 : timer[1];
  }
  if(timer[2] < timer[4]){
    _loop.draw();
    while(timer[2] < timer[4]){
      timer[2] += timer[3];
    }
  }
  setTimeout(tick, timer[5]);
}

calcTimeout();
tick();


