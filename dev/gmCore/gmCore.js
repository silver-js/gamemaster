/////////
// CPU //
/////////

const timer = new Float64Array(3);                // cpu, gpu, now
const delay = new Float32Array(2).fill(100 / 3);  // cpu, gpu
export const _loop = {
  update: ()=>{}, draw: ()=>{},
}


//////////////
// Gamepads //
//////////////

function Pad (){
  this.axis = new Float32Array(4);
  this.btn = new Uint8ClampedArray(8);
}
export const _pad = [];
for(let i = 0; i < 5; i++)_pad.push(new Pad);
const padPulse = [];

// pointer //////////////////////////////////////////////////////////
let pTarget;
let pLock = false;

// mouse controls ///////////////////////////////////////////////////
const mLockArr = new Float32Array(2);
const noDefault = (e)=> e.preventDefault();
const mouseDwnEvt = (e)=>{
  _pad[0].btn[e.button] = 255;
}
const mouseUpEvt = (e)=>{
  _pad[0].btn[e.button] = 0;
}
const mouseWheelEvt = (e)=>{
  e.preventDefault();
  if(e.deltaY >= 0){
    _pad[0].btn[4] = 255;
    padPulse.push([0,4]);
  }else{
    _pad[0].btn[5] = 255;
    padPulse.push([0,5]);
  }
}
const mouseMoveEvt = (e)=>{
  if(document.pointerLockElement){
    mLockArr[0] += e.movementX/pTarget.offsetWidth * 2;
    mLockArr[1] -= e.movementY/pTarget.offsetWidth * 2;
    _pad[0].axis.set([mLockArr[0], mLockArr[1]], 2);
    return
  }
  if(pLock) return;
  _pad[0].axis.set([e.offsetX / pTarget.offsetWidth * 2 - 1, 1 - e.offsetY/pTarget.offsetHeight * 2], 2);
}
const mouseOutEvt = (e)=>{
  _pad[0].axis[2] *= 1.2;
  _pad[0].axis[3] *= 1.2;

}
let mLockTarget;
const mouseLockEvt = ()=>{
  pTarget.requestPointerLock();
}

// touch controls ///////////////////////////////////////////////////
const tLockArr = new Float32Array(4);
const tX = (e)=> (e.changedTouches[0].pageX - pTarget.offsetLeft) / pTarget.offsetWidth * 2 - 1;
const tY = (e)=> 1 - (e.changedTouches[0].pageY - pTarget.offsetTop) / pTarget.offsetHeight * 2;

const tpArea = [];
const activeArea = {};
const areaCheck = (x, y, id)=>{
  const a = tpArea.find(a=>{
    if(a.x > x)return false;
    if(a.x + a.w < x)return false;
    if(a.y > y)return false;
    if(a.y + a.h < y)return false;
    return true;
  });
  if(a)activeArea[id] = a;
}
let tpRatio = 1;
const tpStartEvt = (e)=>{
  if (e.cancelable) e.preventDefault();
  tpRatio = pTarget.offsetHeight / pTarget.offsetWidth;
  const x = tX(e);
  const y = tY(e);
  areaCheck(x, y, e.changedTouches[0].identifier);
  const a = activeArea[e.changedTouches[0].identifier];
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
  if(pLock){
    tLockArr.set([x,y,x,y]);
    return;
  }
  _pad[0].axis.set([x, y], 2);
}
const tpMoveEvt = (e)=>{
  e.preventDefault();
  const a = activeArea[e.changedTouches[0].identifier]
  if(a){
    switch(a.t){
      case 'stick':
        _pad[0].axis[a.m[0]] = Math.max(-.2,Math.min(tX(e)-a.oX,.2))*5;
        _pad[0].axis[a.m[1]] = Math.max(-.2,Math.min((tY(e)-a.oY)*tpRatio,.2))*5;
        break;
      case 'swipe':
        _pad[0].btn[a.m[0]] = tX(e) - a.oX < -.1 ? 255 : 0;
        _pad[0].btn[a.m[1]] = tX(e) - a.oX > .1 ? 255 : 0;
        _pad[0].btn[a.m[2]] = (tY(e) - a.oY)*tpRatio > .1 ? 255 : 0;
        _pad[0].btn[a.m[3]] = (tY(e) - a.oY)*tpRatio < -.1 ? 255 : 0;
        break;
      default:
        break;
    }
    return;
  }
  if(pLock){
    _pad[0].axis.set([(tX(e) - tLockArr[0]) * 2, (tY(e) - tLockArr[1]) * 2], 2);
    tLockArr.set([tX(e),tY(e)],2);
    return;
  }
  _pad[0].axis.set([tX(e), tY(e), tX(e), tY(e)]);
}
const tpEndEvt = (e)=>{
  if (e.cancelable) e.preventDefault();
  tLockArr.set([0,0]);
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
    if(a.c>=0){
      if(tX(e)==a.oX && tY(e)==a.oY){
        _pad[0].btn[a.c] = 255;
        padPulse.push([0,a.c]);
      }
    }
    delete activeArea[e.changedTouches[0].identifier];
    return;
  }
  _pad[0].btn[3] = 0;
}

// keyboard /////////////////////////////////////////////////////////
const kbConf = {

}
const kDwnEvt = (e)=>{
  console.log(e);
}

// keyboard /////////////////////////////////////////////////////////
const kUpEvt = (e)=>{}

// target manager ///////////////////////////////////////////////////
const pLockChangeEvt = ()=>{
  if(document.pointerLockElement){
    pTarget.removeEventListener('mousewheel', mouseWheelEvt);
    window.addEventListener('mousewheel', mouseWheelEvt,{passive:false});
  }else{
    pTarget.addEventListener('mousewheel', mouseWheelEvt);
    window.removeEventListener('mousewheel', mouseWheelEvt);
  }
}
const newPTarget = (a)=>{
  if(pTarget){
    pTarget.removeEventListener('mousewheel', mouseWheelEvt);
    pTarget.removeEventListener('mouseleave', mouseOutEvt);
    pTarget.removeEventListener('mousemove', mouseMoveEvt);
    pTarget.removeEventListener('contextmenu', noDefault);
    pTarget.removeEventListener('mousedown', mouseDwnEvt);
    pTarget.removeEventListener('touchstart', tpStartEvt);
    pTarget.removeEventListener('touchmove', tpMoveEvt);
    pTarget.removeEventListener('touchend', tpEndEvt);
    pTarget.removeEventListener('touchcancel', tpEndEvt);
    window.removeEventListener('keydown', kDwnEvt);
  }
  pTarget = a;
  pLockChangeEvt();
  a.addEventListener('mouseleave', mouseOutEvt);
  a.addEventListener('mousemove', mouseMoveEvt);
  a.addEventListener('contextmenu', noDefault);
  a.addEventListener('mousedown', mouseDwnEvt);
  a.addEventListener('touchstart', tpStartEvt);
  a.addEventListener('touchmove', tpMoveEvt);
  a.addEventListener('touchend', tpEndEvt);
  a.addEventListener('touchcancel', tpEndEvt);
  window.addEventListener('keydown', kDwnEvt);
}
window.addEventListener('mouseup', mouseUpEvt);
document.addEventListener('pointerlockchange', pLockChangeEvt);


// update ///////////////////////////////////////////////////////////
const gpUpdate = ()=>{
  // pad pulse
  for(let i = padPulse.length; i > 0; i--){
    const p = padPulse.pop();
    _pad[p[0]].btn[p[1]] = 0;
  }
  // pointer lock
  if(pLock){
    mLockArr.set([0, 0]);
    tLockArr.set([tLockArr[2],tLockArr[3]]);
    _pad[0].axis.set([0, 0], 2);
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
  pointerLock: (l)=>{
    pLock = !!l;
    if(l){
      if(mLockTarget){
        mLockTarget.removeEventListener('click', mouseLockEvt);
      }
      mLockTarget = pTarget;
      pTarget.addEventListener('click', mouseLockEvt);
      console.log('mouse locked');
    }else{
      if(mLockTarget){
        mLockTarget.removeEventListener('click', mouseLockEvt);
      }
      document.exitPointerLock();
      console.log('mouse unlocked');
    }
  },
  tpAdd: (x, y, w, h, t, m, c)=>{
    tpArea.push({x, y, w, h, t, m, c, oX:0, oY:0});
  },
  tpRemove: (x, y)=>{
    const i = tpArea.findIndex(n=>{
      if(n.x !== x)return false;
      if(n.y !== y)return false;
      return true;
    });
    if(i >= 0){
      tpArea.splice(i, 1);
    }
  }
}
