const timer = new Float64Array(3);                // cpu, gpu, now
const delay = new Float32Array(2).fill(100 / 3);  // cpu, gpu

const cpu = {
  update: ()=>{},
  draw: ()=>{},
  setClock: (x)=>{
    delay[0] = 1000 / x;
  },
  setFps: (x)=>{
    delay[1] = 1000 / x;
  }
}

const loop = ()=>{
  timer[2] = performance.now();
  while(timer[0] < timer[2]){
    cpu.update();
    timer[0] += delay[0];
  }
  if(timer[1] < timer[2]){
    cpu.draw();
    while(timer[1] < timer[2]){
      timer[1] += delay[1];
    }
  }
  setTimeout(loop);
}
loop();

export default cpu
