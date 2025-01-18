/////////
// CPU //
/////////

const timer = new Float64Array(3);                // cpu, gpu, now
const delay = new Float32Array(2).fill(100 / 3);  // cpu, gpu
export const _loop = {
  update: ()=>{},
  draw: ()=>{},
}


//////////////
// Gamepads //
//////////////

function Pad (){
  this.axis = new Float32Array(4);
  this.btn = new Uint8ClampedArray(8);
}
export const _pad = [];
for(let i=0;i<5;i++){_pad.push(new Pad)}
const padPulse = [];

// pointer methods
let pTarget;
const pX = (x)=> x / pTarget.offsetWidth * 2 - 1;
const pY = (y)=> 1 - y/pTarget.offsetHeight * 2;
// mouse controls
const clickEvt = (e)=>{
  e.preventDefault();
  _pad[0].axis[2] = pX(e.offsetX);
  _pad[0].axis[3] = pY(e.offsetY);
  _pad[0].btn[0] = 255;
  padPulse.push([0,'btn',0]);
}

// touch controls
const tX = (e)=> e.changedTouches[0].pageX - pTarget.offsetLeft;
const tY = (e)=> e.changedTouches[0].pageY - pTarget.offsetTop;

const tpArea = [];
const activeArea = {};
const areaCheck = (x,y,id)=>{
  const a = tpArea.find(a=>{
    if(a.x>x)return false;
    if(a.x+a.w<x)return false;
    if(a.y>y)return false;
    if(a.y+a.h<y)return false;
    return true;
  });
  if(a)activeArea[id]=a;
}
let tpScale = 1;
const tpStartEvt = (e)=>{
  tpScale = Math.sqrt(pTarget.offsetWidth)/Math.sqrt(pTarget.offsetHeight);
  const x = pX(tX(e));
  const y = pY(tY(e));
  areaCheck(x,y,e.changedTouches[0].identifier);
  
  const a = activeArea[e.changedTouches[0].identifier]
  if(a){
    switch(a.t){
      case 'btn':
        _pad[0].btn[a.m] = 255;
        break;
      case 'stick':
        a.oX = x;
        a.oY = y;
        _pad[0].axis[a.m[0]] = 0;
        _pad[0].axis[a.m[1]] = 0;
        break;
      case 'swipe':
        a.oX = x;
        a.oY = y;
        break;
      default:
        break;
    }
    return;
  }
  _pad[0].btn[3] = 255;
  _pad[0].axis[2] = x;
  _pad[0].axis[3] = y;
}
const tpMoveEvt = (e)=>{
  e.preventDefault();
  const a = activeArea[e.changedTouches[0].identifier]
  if(a){
    switch(a.t){
      case 'stick':
        _pad[0].axis[a.m[0]] = Math.max(-.2,Math.min((pX(tX(e))-a.oX)/tpScale,.2))*5;
        _pad[0].axis[a.m[1]] = Math.max(-.2,Math.min((pY(tY(e))-a.oY)*tpScale,.2))*5;
        break;
      case 'swipe':
        _pad[0].btn[a.m[0]] = (pX(tX(e)) - a.oX)/tpScale < -.1 ? 255 : 0;
        _pad[0].btn[a.m[1]] = (pX(tX(e)) - a.oX)/tpScale > .1 ? 255 : 0;
        _pad[0].btn[a.m[2]] = (pY(tY(e)) - a.oY)*tpScale > .1 ? 255 : 0;
        _pad[0].btn[a.m[3]] = (pY(tY(e)) - a.oY)*tpScale < -.1 ? 255 : 0;
        break;
      default:
      break;
    }
    return;
  }
  _pad[0].axis[2] = pX(tX(e));
  _pad[0].axis[3] = pY(tY(e));
}
const tpEndEvt = (e)=>{
  const a = activeArea[e.changedTouches[0].identifier];
  if(a){
    switch(a.t){
      case 'btn':
        _pad[0].btn[a.m] = 0;
        break;
      case 'stick':
        _pad[0].axis[a.m[0]] = 0;
        _pad[0].axis[a.m[1]] = 0;
        break;
      case 'swipe':
        _pad[0].btn[a.m[0]] = 0;
        _pad[0].btn[a.m[1]] = 0;
        _pad[0].btn[a.m[2]] = 0;
        _pad[0].btn[a.m[3]] = 0;
        break;
      default:
        break;
    }
    delete activeArea[e.changedTouches[0].identifier];
    return;
  }
  _pad[0].btn[3] = 0;
}

// target manager

const newPTarget = (a)=>{
  if(pTarget){
    pTarget.removeEventListener('click',clickEvt);
    pTarget.removeEventListener('touchstart',tpStartEvt);
    pTarget.removeEventListener('touchmove',tpMoveEvt);
    pTarget.removeEventListener('touchend',tpEndEvt);
    pTarget.removeEventListener('touchcancel',tpEndEvt);
  }
  pTarget = a;
    a.addEventListener('click',clickEvt);
    a.addEventListener('touchstart',tpStartEvt);
    a.addEventListener('touchmove',tpMoveEvt);
    a.addEventListener('touchend',tpEndEvt);
    a.addEventListener('touchcancel',tpEndEvt);
}

// update
const gpUpdate = ()=>{
  for(let i=padPulse.length;i>0;i--){
    const p = padPulse.pop();
    _pad[p[0]][p[1]][p[2]]=0;
  }
}

//////////////////
// Flow Control //
//////////////////

const flow = ()=>{
  timer[2] = performance.now();
  while(timer[0] < timer[2]){
    _loop.update();
    gpUpdate();
    timer[0] += delay[0];
  }
  if(timer[1] < timer[2]){
    _loop.draw();
    while(timer[1] < timer[2]){
      timer[1] += delay[1];
    }
  }
  setTimeout(flow);
}
flow();


////////////////////
// Config Methods //
////////////////////

export const _cfg = {
  setClock: (x)=>{
    delay[0] = 1000 / x;
  },
  setFps: (x)=>{
    delay[1] = 1000 / x;
  },
  pointerTarget: (a)=>{
    newPTarget(a);
  },
  tpAdd: (x,y,w,h,t,m)=>{
    tpArea.push({x,y,w,h,t,m,oX:0,oY:0});
  },
  tpRemove: (x,y)=>{
    const i = tpArea.findIndex(n=>{
      if(n.x !== x)return false;
      if(n.y !== y)return false;
      return true;
    });
    if(i>=0){
      tpArea.splice(i,1);
    }
  }
}