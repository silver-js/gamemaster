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
    mLockArr[1] += e.movementY/pTarget.offsetWidth * 2;
    _pad[0].axis.set([mLockArr[0], mLockArr[1]], 2);
    return
  }
  if(pLock) return;
  _pad[0].axis.set([e.offsetX / pTarget.offsetWidth * 2 - 1, e.offsetY/pTarget.offsetHeight * 2 - 1], 2);
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

// visualization


const tLockArr = new Float32Array(4);
const tX = (e)=> (e.changedTouches[0].pageX - pTarget.offsetLeft) / pTarget.offsetWidth * 2 - 1;
const tY = (e)=> (e.changedTouches[0].pageY - pTarget.offsetTop) / pTarget.offsetHeight * 2 - 1;

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
    a.dX = e.changedTouches[0].pageX;
    a.dY = e.changedTouches[0].pageY;
    document.body.appendChild(a.dom[1]);
    a.dom[1].style.top = a.dY + 'px';
    a.dom[1].style.left = a.dX + 'px';
    
    switch(a.t){
      case 'btn':
        _pad[0].btn[a.m] = 255;
        break;
      case 'stick':
        document.body.appendChild(a.dom[0]);
        a.dom[0].style.top = a.dY + 'px';
        a.dom[0].style.left = a.dX + 'px';
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
        a.dom[1].style.left = (a.dX + _pad[0].axis[a.m[0]]*16) + 'px';
        a.dom[1].style.top = (a.dY + _pad[0].axis[a.m[1]]*16) + 'px';
        break;
      case 'swipe':
        _pad[0].btn[a.m[0]] = (tY(e) - a.oY)*tpRatio > .1 ? 255 : 0;
        _pad[0].btn[a.m[1]] = tX(e) - a.oX > .1 ? 255 : 0;
        _pad[0].btn[a.m[2]] = tX(e) - a.oX < -.1 ? 255 : 0;
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
  _pad[0].axis.set([tX(e), tY(e)],2);
}
const tpEndEvt = (e)=>{
  if (e.cancelable) e.preventDefault();
  tLockArr.set([0,0]);
  const a = activeArea[e.changedTouches[0].identifier];
  if(a){
    document.body.removeChild(a.dom[1]);
    switch(a.t){
      case 'btn':
        _pad[0].btn[a.m] = 0;
        break;
      case 'stick':
        document.body.removeChild(a.dom[0]);
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
let kbLock = true;
const kbArr = [];
const kbMap = {
  KeyW: [1, 'axis', 1, true],
  KeyA: [1, 'axis', 0, true],
  KeyS: [1, 'axis', 1],
  KeyD: [1, 'axis', 0],
  KeyN: [1, 'btn', 0],
  KeyM: [1, 'btn', 1],
  Space: [1, 'btn', 2],
  AltLeft: [1, 'btn', 3],
  KeyQ: [1, 'btn', 4],
  KeyE: [1, 'btn', 5],
  Tab: [1, 'btn', 6],
  Enter: [1, 'btn', 7],
}
const kbAct = {
  F10: ()=> kbLock = !kbLock
}
const kbUpdate = (x)=>{
  let k;
  for(let i = kbArr.length - 1; i >= 0; i--){
    k = kbMap[kbArr[i]];
    if(k){
      switch(k[1]){
        case 'btn':
          _pad[k[0]].btn[k[2]] = 255;
          break;
        case 'axis':
          _pad[k[0]].axis[k[2]] = k[3] ? - 1 : 1;
          break;
      }
    }
  }
}
const kDwnEvt = (e)=>{
  if(kbAct[e.code]){
    e.preventDefault();
    kbAct[e.code]();
    return;
  }
  if(kbLock) e.preventDefault();
  if(kbArr.find(n=>n==e.code))return;
  kbArr.unshift(e.code);
}
const kUpEvt = (e)=>{
  const i = kbArr.findIndex(n=>n==e.code);
  if(i>=0){
    e.preventDefault();
    kbArr.splice(i,1);
    const rk = kbMap[e.code];
    if(rk){
      _pad[rk[0]][rk[1]][rk[2]] = 0;
    }
  }
}

// gamepad //////////////////////////////////////////////////////////
const gpArr = [null,null,null,null];
let gpIndex = 0;
const gpAlocate = (i)=>{
  if(gpArr.findIndex(n=>n==null)>=0){
    while(gpArr[gpIndex] != null){
      gpIndex = (gpIndex + 1) % 4;
    }
    gpArr[gpIndex] = i;
    console.log(`connected to slot ${gpIndex + 1}`);
    gpIndex = (gpIndex + 1)%4;
  }else{
    console.log('no more gamepad slots available');
  }
}
const gpRemove = (i)=>{
  const index = gpArr.findIndex(n=>n==i);
  if(index>=0){
    gpArr[index] = null;
  }
}
const gpStart = (e)=>{
  console.log(e.gamepad.buttons[0])
  console.log(`${e.gamepad.id} detected.`);
  gpAlocate(e.gamepad.index);
}
const gpEnd = (e)=>{
  gpRemove(n=>n==e.gamepad.index);
  console.log(`${e.gamepad.id} disconnected.`, gpArr);
}
let gpDelay = 0;
const gpUpdate = ()=>{
  for(const gp of navigator.getGamepads()){
    if(gp){
      if(gp.buttons[8].pressed && gp.buttons[9].pressed && gpDelay<performance.now()){
        gpRemove(gp.index);
        gpAlocate(gp.index);
        gpDelay = performance.now()+250;
      }
      const padId = gpArr.findIndex(n=>n==gp.index);
      if(padId>=0){
        for(let a = 0; a < 4; a++){
          _pad[padId + 1].axis[a] = gp.axes[a];
        }
        for(let b = 0; b < 6; b++){
          _pad[padId + 1].btn[b] = gp.buttons[b].pressed ? 255 : 0;
        }
        for(let b = 8; b < 10; b++){
          _pad[padId + 1].btn[b-2] = gp.buttons[b].pressed ? 255 : 0;
        }
      }
    }
  }
}


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
}
window.addEventListener('mouseup', mouseUpEvt);
document.addEventListener('pointerlockchange', pLockChangeEvt);
window.addEventListener('keydown', kDwnEvt);
window.addEventListener('keyup', kUpEvt);
window.addEventListener('gamepadconnected', gpStart);
window.addEventListener('gamepaddisconnected', gpEnd);


// update ///////////////////////////////////////////////////////////
const pulseUpdate = ()=>{
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
    gpUpdate();
    kbUpdate();
    _loop.update();
    pulseUpdate();
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

const areaDom = ()=>{
  const res = [
    document.createElement('div'),
    document.createElement('div')
  ];
  res[0].style = 'transform:translate(-10vmin,-10vmin);z-index:99;user-select:none;position:fixed;width:20vmin;height:20vmin;border-radius:50%;background:#5552;';
  res[1].style = 'transform:translate(-5vmin,-5vmin);z-index:100;user-select:none;position:fixed;width:10vmin;height:10vmin;border-radius:50%;background:#5552;';
  return res;
} 

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
    }else{
      if(mLockTarget){
        mLockTarget.removeEventListener('click', mouseLockEvt);
      }
      document.exitPointerLock();
    }
  },
  tpAdd: (x, y, w, h, t, m, c)=>{
    tpArea.push({
      x, y, w, h,
      t, m, c,
      dom: areaDom(),
      dX: 0, dY: 0,
      oX:0, oY:0
    });
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
  },
  getKbMap: ()=> kbMap,
  kbAdd: (...args)=>{
    args.forEach(n=>{
      kbMap[n.key] = n.map;
    });
  },
  kbRemove: (...args)=>{
    args.forEach(n=>{
      delete kbMap[n];
    });
  }
}
