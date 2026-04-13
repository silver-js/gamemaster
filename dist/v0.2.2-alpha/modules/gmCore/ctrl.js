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
        _pad[0].btn[a.m[0]] = (tY(e) - a.oY) * tpRatio < -.1 ? 255 : 0;
        _pad[0].btn[a.m[1]] = tX(e) - a.oX > .1 ? 255 : 0;
        _pad[0].btn[a.m[2]] = (tY(e) - a.oY) * tpRatio > .1 ? 255 : 0;
        _pad[0].btn[a.m[3]] = tX(e) - a.oX < -.1 ? 255 : 0;
        break;
      default:
        break;
    }
    return;
  }
  if(pLock){
    _pad[0].axis.set([(tX(e) - tLockArr[0]) * 2, (tY(e) - tLockArr[1]) * 2], 2);
    tLockArr.set([tX(e), tY(e)], 2);
    return;
  }
  _pad[0].axis.set([tX(e), tY(e)], 2);
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
      if(tX(e) == a.oX && tY(e) == a.oY){
        padPulse.push([0, a.c, 0]);
      }
    }
    delete activeArea[e.changedTouches[0].identifier];
    return;
  }
  _pad[0].btn[3] = 0;
}

// keyboard /////////////////////////////////////////////////////////
const kbPreset = '{"KeyW":[1,"axis",1,true],"KeyA":[1,"axis",0,true],"KeyS":[1,"axis",1],"KeyD":[1,"axis",0],"Tab":[1,"btn",0],"KeyE":[1,"btn",1],"Space":[1,"btn",2],"KeyQ":[1,"btn",3],"KeyR":[1,"btn",4],"KeyF":[1,"btn",5],"AltLeft":[1,"btn",6],"Enter":[1,"btn",7],"ArrowUp":[1,"axis",3,true],"ArrowLeft":[1,"axis",2,true],"ArrowDown":[1,"axis",3],"ArrowRight":[1,"axis",2]}';
let kbMap = JSON.parse(kbPreset)
let kbLock = true;
const kbInputStream = [];
const kbArr = [];
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
  if (kbLock) {
    e.preventDefault();
    if (kbArr.find(n => n == e.code)) return;
    kbArr.unshift(e.code);
    return;
  }
  kbInputStream.push(e.key, e.code);
  if(kbInputStream.length > 16) kbInputStream.splice(0, 2);
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
let gpSlot = 0;
let currentSlot = 0;
const gpAlocate = (id)=>{
  if(gpArr.findIndex(n=>n==null)>=0){
    while(gpArr[gpSlot] != null){
      gpSlot = (gpSlot + 1) % 4;
    }
    gpArr[gpSlot] = id;
    console.log(`connected to slot ${gpSlot + 1}`);
    currentSlot = gpSlot;
    gpSlot = (gpSlot + 1)%4;
    return currentSlot
  }else{
    console.log('no more gamepad slots available');
    return false
  }
}
const gpRemove = (i)=>{
  const index = gpArr.findIndex(n=>n==i);
  if(index>=0){
    gpArr[index] = null;
  }
}
const gpStart = (e)=>{
  console.log(`${e.gamepad.id} detected.`, e);
  gpAlocate(e.gamepad.index);
}
const gpEnd = (e)=>{
  gpRemove(e.gamepad.index);
  console.log(`${e.gamepad.id} disconnected.`, gpArr);
}

const gpSwitchTracker = new Uint8Array(4);
const gpBtnMap = [0, 3, 1, 1, 2, 0, 3, 2, 4, 4, 5, 5, 8, 8, 9, 9];
const gpUpdate = ()=>{
  for (let gp of navigator.getGamepads()) {
    const padId = gpArr.findIndex(n => gp && n === gp.index);
    if (padId >= 0) {
      if (gp.buttons[8].pressed && gp.buttons[9].pressed) {
        if (!gpSwitchTracker[padId]) {
          gpRemove(gp.index);
          const pos = gpAlocate(gp.index);
          if (pos >= 0) {
            gpSwitchTracker[pos] = 255;
          }
        }
      } else {
        gpSwitchTracker[padId] = 0
        const gpMap = gp.buttons.length < 15 ? 0 : 1;
        
        // buttons
        for (let b = 0; b < 8; b++) {
          _pad[padId + 1].btn[b] = gp.buttons[gpBtnMap[b * 2 + gpMap]].pressed ? 255 : 0;
        }
        
        // axes
        for(let a = 0; a < 4; a++){
					_pad[padId + 1].axis[a] = 0;
          if(Math.abs(gp.axes[a]) > 0){
					  _pad[padId + 1].axis[a] = gp.axes[a];
          }
				}

        // triggers
        if(gp.buttons[6].pressed) _pad[padId + 1].btn[4] = 255;
        if(gp.buttons[7].pressed) _pad[padId + 1].btn[5] = 255;
        
        // check gamepad layouts then update dpad
        if(gpMap){
          // standard
          for (let d = 0; d < 4; d++) {
            if(gp.buttons[12 + d].pressed){
              _pad[padId + 1].axis[1 - Math.floor(d / 2)] = (d % 2 - .5) * 2;
            }
          }
        } else {
          // non-standard
          if (Math.abs(gp.axes[4]) > 0) {
            _pad[padId + 1].axis[0] = gp.axes[4];
          }
          if (Math.abs(gp.axes[5]) > 0) {
            _pad[padId + 1].axis[1] = gp.axes[5];
          }
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
  for(let i = padPulse.length - 1; i >= 0; i--){
    const p = padPulse[i];
    _pad[p[0]].btn[p[1]] = p[2] == 1 ? 0 : 255;
    if(p[2] == 1) padPulse.pop();
    p[2] = 1; 
  }
  // pointer lock
  if(pLock){
    mLockArr.set([0, 0]);
    tLockArr.set([tLockArr[2],tLockArr[3]]);
    _pad[0].axis.set([0, 0], 2);
  }
}

export const _padUpdate = ()=>{
  gpUpdate();
  kbUpdate();
  pulseUpdate();
}

// keyboard interaction
export const _kb = {
  typeMode: (l)=>{
    kbLock = !l;
  },
  input: ()=>{
    return kbInputStream.splice(0,2);
  }
}


////////////////////
// Config Methods //
////////////////////

export const _padCfg = {
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
      console.log('pointerLock on');
    }else{
      if(mLockTarget){
        mLockTarget.removeEventListener('click', mouseLockEvt);
      }
      document.exitPointerLock();
      console.log('pointerLock off');
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
  },
  getKbMap: ()=> kbMap,
  setKbMap: (mapString)=>{
    kbMap = JSON.parse(mapString);
  },
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