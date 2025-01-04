/*
- virtual joystick:
  2 analogs
  8 buttons

- 4 jotsticks, j0 is mouse controls
*/


///////////////////////////////
// Creating virtual joystick //
///////////////////////////////

const padBuffer = new ArrayBuffer(60);
const padData = new Int8Array(padBuffer);

function Pad(id){
  const offset = 12 * id;
  this.axis = new Int8Array(padBuffer, offset, 4);
  this.btn = new Int8Array(padBuffer, offset + 4, 8);
}
export const j0 = {
  axis: new Int16Array(padBuffer, 0, 2),
  btn: new Int8Array(padBuffer, 4, 8)
};
export const j1 = new Pad(1);
export const j2 = new Pad(2);
export const j3 = new Pad(3);
export const j4 = new Pad(4);

///////////////////
// Configuration //
///////////////////

const dCfg = {
  kb:{
    KeyA: -12,
    KeyD: 12,
    KeyW: 13,
    KeyS: -13,
    Space: 16,
    KeyF: 17,
    KeyR: 18,
    ShiftLeft: 19,
    KeyQ: 20,
    KeyE: 21,
    Tab: 22,
    Enter:23
  }
}
const cfg = {}
export const loadCfg = (type, data)=>{
  cfg[type] = data;
}

// Keyboard

loadCfg("kb", dCfg.kb);

const idInfo = (id)=>{
  const p = Math.floor(id/12);
  const o = id % 12;
  const s = o < 4 ? `axis${o + 1}` : `btn${o - 3}`;
  return `p${p}${s}`;
}
const getId = (j,t,i,r)=>{
  const res = j * 12 + (t == "axis" ? -1 : 3) + i;
  return r?-res:res;
}
const searchKey = (id)=>{
  for(let k in cfg.kb){
    if(id == cfg.kb[k]){
      return k;
    }
  }
}
let ptTarget = document.body;

// methods
export const jConf = {
  enabled: true,
  ptTarget: x=>{ptTarget = x; rzEvt()},
  listKb: (all)=>{
    const pi = [];
    for(let j = 1; j <=4 ; j++){
      for(let a = 0; a < 8; a++){
        let id = j * 12 + Math.floor(a / 2);
        let dir = -(a % 2) * 2 + 1;
        let key = searchKey(id * dir);
        if(key || all){
          pi.push(`${idInfo(id)}${dir > 0 ? '+':'-'}: ${key}`);
        }
      }
      for(let b = 0; b < 8; b++){
        let id = j * 12 + 4 + b;
        let key = searchKey(id);
        if(key || all){
          pi.push(`${idInfo(id)}: ${key}`)
        }
      }
    }
    return pi;
  },
  kbRemap: (j,t,i,r)=>{
    jConf.enabled = false;
    const id = getId(j,t,i,r);
    const kr = (e)=>{
      e.preventDefault();
      if(e.code === 'Escape'){
        console.log('remap canceled...');
        jConf.enabled = true;
        return;
      }
      delete cfg.kb[searchKey(id)];
      cfg.kb[e.code] = id;
      jConf.enabled = true;
      window.removeEventListener('keydown',kr);
    }
    window.addEventListener('keydown',kr);
  },
  kbClean: (j,t,i,r)=>{
    const id = getId(j,t,i,r);
    const key = searchKey(id);
    kuEvt({code:key});
    delete cfg.kb[searchKey(id)];
  }
}


///////////////////////
// Keyboard controls //
///////////////////////

let actKey = [];
const checkKeys = ()=>{
  for(let i = 0; i < actKey.length; i++){
    if(actKey[i]>0){
      padData[actKey[i]] = 127;
    }else{
      padData[-actKey[i]] = -127;
    }
  }
}
const kdEvt = e=>{
  if(!jConf.enabled){
    actKey = [];
    return;
  }
  e.preventDefault();
  if(e.repeat){return}
  if(cfg.kb[e.code]){
    actKey.push(cfg.kb[e.code]);
    checkKeys();
  }
}
const kuEvt = e=>{
  if(jConf.enabled){
    e.preventDefault()
  }
  padData[Math.abs(cfg.kb[e.code])] = 0;
  actKey = actKey.filter(n=>{
    if(n!=cfg.kb[e.code]){
      return true;
    }else{
      return false;
    }
  })
  checkKeys();
}
window.addEventListener('keydown', kdEvt);
window.addEventListener('keyup', kuEvt);


////////////////////
// Mouse controls //
////////////////////

let ptW = 1;
let ptH = 1;
let ptX = 0;
let ptY = 0;
const rzEvt = ()=>{
  ptW = 640 / ptTarget.offsetWidth;
  ptH = 360 / ptTarget.offsetHeight;
  ptX = ptTarget.offsetLeft;
  ptY = ptTarget.offsetTop;
}
rzEvt();
window.addEventListener('resize',rzEvt);
const mmEvt = e=>{
  j0.axis[0] = (e.pageX - ptX) * ptW;
  j0.axis[1] = (e.pageY - ptY) * ptH;
}
window.addEventListener('mousemove', mmEvt);
const mdEvt = e=>{
  e.preventDefault();
  j0.btn[e.button] = 128;
}
window.addEventListener('mousedown', mdEvt);
const muEvt = e=>{
  e.preventDefault();
  j0.btn[e.button] = 0;
}
window.addEventListener('contextmenu', (e)=>{e.preventDefault()});
window.addEventListener('mouseup', muEvt);
