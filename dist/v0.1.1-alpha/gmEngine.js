/////////
// CPU //
/////////

const timer = new Float64Array(3);                // cpu, gpu, now
const delay = new Float32Array(3).fill(100 / 3);  // cpu, gpu
const calcTimeout = ()=>{
  delay[2] = Math.min(delay[0], delay[1])/4;
}
calcTimeout();

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
  setTimeout(flow, delay[2]);
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
    calcTimeout();
  },
  setFps: (x)=>{
    delay[1] = 1000 / x;
    calcTimeout();
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


// _gfx

// DOM setup
let res = 1;
const canv = document.getElementById('gm-main');
const checkFlip = ()=>{
  const r = window.innerWidth / window.innerHeight;
  canv.style = `
  box-shadow: 0 0 1px 1px grey;
  width: ${r < 1.79 ? '99%' : 'auto'};
  height: ${r < 1.79 ? 'auto' : window.innerHeight * .99 + 'px'};
  display: block;
  margin: 0 auto;
  image-rendering: pixelated;
  `;
}
checkFlip();
window.addEventListener("resize", checkFlip);


// internal values:
const deg = Math.PI/180;


// WEBGL2:
const gl = canv.getContext('webgl2');
gl.imageSmoothingEnabled = false;
gl.webkitImageSmoothingEnabled = false;
gl.mozImageSmoothingEnabled = false;
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

gl.clearColor(0.0,0.0,0.0,1);

const modelData = new Float32Array([-.5, -.5, -.5, .5, .5, .5, .5, .5, .5, -.5, -.5, -.5]);
const modelBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, modelBuffer);
gl.bufferData(gl.ARRAY_BUFFER, modelData, gl.STATIC_DRAW);

const spriteBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, spriteBuffer);

const vertexTxt = `#version 300 es
precision mediump float;

layout(location = 0) in vec2 vertPos;

layout(location = 1) in vec2 spritePos;
layout(location = 2) in vec2 sprSize;
layout(location = 3) in vec2 spin;
layout(location = 4) in vec2 scale;
layout(location = 5) in float type;
layout(location = 6) in vec4 data;

const float rad = 0.01745329;

uniform vec2 pxScale;

out float fType;
out float samplerPick;
out vec4 finalColor;
out vec3 finalCoord;

void main(){
  gl_Position = vec4(vec2(
    vertPos * sprSize * vec2(cos(spin.x * rad), cos(spin.y * rad)) + vec2(-vertPos.y * sprSize.y * sin(spin.y * rad), vertPos.x * sprSize.x * sin(spin.x * rad)) + spritePos / scale
  ) * pxScale * scale, 0.0, 1.0);
  fType = type;
  samplerPick = floor(data.x / 2.0);
  finalCoord = vec3((vertPos.x + .5) * .98, (vertPos.y + .5) * .98, floor(data.y / 2.0));
  finalColor = vec4(data.x - samplerPick * 2.0, data.y - floor(data.y / 2.0) * 2.0, data.z, data.a);
}
`;
const fragmentTxt = `#version 300 es
precision mediump float;
precision mediump sampler2DArray;

in float samplerPick;
in vec3 finalCoord;
in float fType;
in vec4 finalColor;

uniform sampler2DArray uFontSamplerA;
uniform sampler2DArray uFontSamplerB;
uniform sampler2DArray uFontSamplerC;
uniform sampler2DArray uFontSamplerD;
uniform sampler2DArray uSpriteSamplerA;
uniform sampler2DArray uSpriteSamplerB;
uniform sampler2DArray uSpriteSamplerC;
uniform sampler2DArray uSpriteSamplerD;

out vec4 outputColor;

void main(){
  if(fType == 0.0){
    outputColor = finalColor;
  }else if(fType == 1.0){
    if(samplerPick == 0.0){
      outputColor = texture(uFontSamplerA, finalCoord) + finalColor;
    }else if(samplerPick == 1.0){
      outputColor = texture(uFontSamplerB, finalCoord) + finalColor;
    }else if(samplerPick == 2.0){
      outputColor = texture(uFontSamplerC, finalCoord) + finalColor;
    }else if(samplerPick == 3.0){
      outputColor = texture(uFontSamplerD, finalCoord) + finalColor;
    }
  }else if(fType == 2.0){
    if(samplerPick == 0.0){
      outputColor = texture(uSpriteSamplerA, finalCoord);
    }else if(samplerPick == 1.0){
      outputColor = texture(uSpriteSamplerB, finalCoord);
    }else if(samplerPick == 2.0){
      outputColor = texture(uSpriteSamplerC, finalCoord);
    }else if(samplerPick == 3.0){
      outputColor = texture(uSpriteSamplerD, finalCoord);
    }
  }else{
    outputColor = vec4(1.0, 1.0, 1.0, 1.0);
  }
}
`;

const vShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vShader, vertexTxt);
gl.compileShader(vShader);

const fShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fShader, fragmentTxt);
gl.compileShader(fShader);

const triangleProgram = gl.createProgram();
gl.attachShader(triangleProgram, vShader);
gl.attachShader(triangleProgram, fShader);
gl.linkProgram(triangleProgram);
if(!gl.getProgramParameter(triangleProgram, gl.LINK_STATUS)){
  console.log(gl.getShaderInfoLog(vShader))
  console.log(gl.getShaderInfoLog(fShader))
}
gl.useProgram(triangleProgram);

// attribs
gl.enableVertexAttribArray(0);
gl.enableVertexAttribArray(1);
gl.enableVertexAttribArray(2);
gl.enableVertexAttribArray(3);
gl.enableVertexAttribArray(4);
gl.enableVertexAttribArray(5);
gl.enableVertexAttribArray(6);
gl.vertexAttribDivisor(1,1);
gl.vertexAttribDivisor(2,1);
gl.vertexAttribDivisor(3,1);
gl.vertexAttribDivisor(4,1);
gl.vertexAttribDivisor(5,1);
gl.vertexAttribDivisor(6,1);

// uniforms
const pxScaleLocation = gl.getUniformLocation(triangleProgram, 'pxScale');
const font0Location = gl.getUniformLocation(triangleProgram, 'fontSampler');

gl.uniform2f(pxScaleLocation, 2 / 640, 2 / 360);


// attrib pointers:
gl.bindBuffer(gl.ARRAY_BUFFER, modelBuffer);
gl.vertexAttribPointer(
  0,        // index
  2,        // size
  gl.FLOAT, // type
  false,    // normalization
  2 * 4,    // data size in bytes
  0         // attrib offset in bytes
);

gl.bindBuffer(gl.ARRAY_BUFFER, spriteBuffer);
gl.vertexAttribPointer(
  1,
  2,
  gl.FLOAT,
  false,
  13 * 4,
  0
);
gl.vertexAttribPointer(
  2,
  2,
  gl.FLOAT,
  false,
  13 * 4,
  2 * 4
);
gl.vertexAttribPointer(
  3,
  2,
  gl.FLOAT,
  false,
  13 * 4,
  4 * 4
);
gl.vertexAttribPointer(
  4,
  2,
  gl.FLOAT,
  false,
  13 * 4,
  6 * 4
);
gl.vertexAttribPointer(
  5,
  1,
  gl.FLOAT,
  false,
  13 * 4,
  8 * 4
);
gl.vertexAttribPointer(
  6,
  4,
  gl.FLOAT,
  false,
  13 * 4,
  9 * 4
);
let spriteArr = [];

const drawSprites = (arr)=>{
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr), gl.STATIC_DRAW);

  gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, Math.floor(arr.length / 13));
}
/////////////////////////////////////////////////////////////////

// sprites loader

const loaderCanvas = document.createElement('canvas');
loaderCanvas.width = 32;
loaderCanvas.height = 128;
const loaderCtx = loaderCanvas.getContext('2d');
loaderCtx.fillStyle = '#ff0';
loaderCtx.fillRect(0,0,32,32);
loaderCtx.fillStyle = '#f0f';
loaderCtx.fillRect(0,32,32,32);
loaderCtx.fillStyle = '#0ff';
loaderCtx.fillRect(0,64,32,32);
loaderCtx.fillStyle = '#00f';
loaderCtx.fillRect(0,96,32,32);


gl.uniform1i(gl.getUniformLocation(triangleProgram, 'uFontSamplerA'), 0);
gl.uniform1i(gl.getUniformLocation(triangleProgram, 'uFontSamplerB'), 1);
gl.uniform1i(gl.getUniformLocation(triangleProgram, 'uFontSamplerC'), 2);
gl.uniform1i(gl.getUniformLocation(triangleProgram, 'uFontSamplerD'), 3);

gl.uniform1i(gl.getUniformLocation(triangleProgram, 'uSpriteSamplerA'), 4);
gl.uniform1i(gl.getUniformLocation(triangleProgram, 'uSpriteSamplerB'), 5);
gl.uniform1i(gl.getUniformLocation(triangleProgram, 'uSpriteSamplerC'), 6);
gl.uniform1i(gl.getUniformLocation(triangleProgram, 'uSpriteSamplerD'), 7);


const loadTexture = (img, tu) =>{
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  const texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + tu);
  gl.bindTexture(gl.TEXTURE_2D_ARRAY, texture);
  gl.texImage3D(gl.TEXTURE_2D_ARRAY, 0, gl.RGBA, loaderCanvas.width, loaderCanvas.width, loaderCanvas.height / loaderCanvas.width , 0, gl.RGBA, gl.UNSIGNED_BYTE, img);

  gl.generateMipmap(gl.TEXTURE_2D_ARRAY);
  //gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
  //gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.NEAREST_MIPMAP_NEAREST);
}

loadTexture(loaderCanvas, 4);


// font
const fontStrArr = [];
for(let i = 0; i< 95; i++){
  fontStrArr.unshift(String.fromCharCode(32 + i));
}

const loadFont = (id, font)=>{
  let tSize = 16;
  loaderCanvas.width = tSize;
  loaderCanvas.height = tSize * fontStrArr.length;
  loaderCtx.font = `${tSize - 1}px ${font}`;
  loaderCtx.imageSmoothingEnabled = false;
  loaderCtx.webkitImageSmoothingEnabled = false;
  loaderCtx.mozImageSmoothingEnabled = false;
  loaderCtx.textBaseline = 'bottom';
  loaderCtx.fillStyle = `#000`;
  fontStrArr.forEach((n, i)=>{
    loaderCtx.fillText(n, 0, (1 + i) * tSize);
  });
  loadTexture(loaderCanvas, id);
}
loadFont(0, 'sans-serif');
loadFont(1, 'times-new-roman');
loadFont(2, 'courier-new');


const reRes = ()=>{
  canv.width = 640 * res;
  canv.height = 360 * res;
  gl.viewport(0,0, canv.width,canv.height)
}
reRes();
/////////////////////////////////////////////////////////////////
let clr = [1,1,1,1];
let lineWidth = 2;
let activeFont = 0;
export const _gfx = {
  res: (x)=>{
    res = x;
    reRes();
  },
  motionBlur: (x)=>{
    gl.clearColor(0.0,0.0,0.0,x);
  },
  color: (r,g,b,a = 255)=>{
    clr = [r/255, g/255, b/255, a/255];
  },
  lineWidth: (x)=> lineWidth = x,
  localFont: (id, font)=>{
    loadFont(id, font);
  },
  font: (id)=>activeFont = id,
  lines: (...args)=>{
    for(let i = 2; i < args.length; i+=2){
      let a = args[i] - args[i - 2];
      let o = args[i + 1] - args[i - 1];
      let h = Math.sqrt(a ** 2 + o ** 2);
      let spin = Math.atan(-a/o) / deg;
      spriteArr.push(args[i] - a / 2, args[i + 1] - o / 2 , lineWidth, h , spin, spin, 1, 1, 0, ...clr);
    }
  },
  rect: (x, y, w, h, sX = 0, sY, scaleX = 1, scaleY = 1)=>{
    spriteArr.push(x, y, w, h, sX, sY != undefined ? sY : sX, scaleX, scaleY, 0, ...clr);
  },
  text: (txt, x, y, w, h, sX = 0, sY, scaleX = 1, scaleY = 1) =>{
    let lineOffset = 0;
    for(let i = 0; i < txt.length; i++){
      spriteArr.push(x + lineOffset, y, w = 16, h = 16, sX, sY != undefined ? sY : sX, scaleX, scaleY, 1, activeFont * 2 + clr[0], (txt.charCodeAt(i) - 32) * 2 + clr[1], clr[2], 0);
      lineOffset += 16;
    }
  },
  spr: (aId, iId, x, y, w = 32, h = 32, sX = 0, sY, scaleX = 1, scaleY = 1)=>{
    spriteArr.push(x, y, w, h, sX, sY != undefined ? sY : sX, scaleX, scaleY, 2, aId * 2, iId * 2, 0, 0);
  },
  draw: ()=>{
    drawSprites(spriteArr)
    spriteArr = [];
  },
  loadAtlas: async (id, url, tileSize)=>{
    const aImg = new Image();
    aImg.src = url;
    await aImg.decode();
    let tW = Math.floor(aImg.width / tileSize);
    let tH = Math.floor(aImg.height / tileSize);
    loaderCanvas.width = tileSize;
    loaderCanvas.height = tileSize * tW * tH;
    loaderCtx.imageSmoothingEnabled = false;
    loaderCtx.webkitImageSmoothingEnabled = false;
    loaderCtx.mozImageSmoothingEnabled = false;
    loaderCtx.fillStyle = "#fff";
    for(let i = 0; i < tW; i++){
      for(let j = 0; j < tH; j++){
        loaderCtx.drawImage(aImg, i * 32, j * 32, 32, 32, 0, loaderCanvas.height - 32 * (2 + i + (j * tW)) , 32, 32);
      }
    };
    loadTexture(loaderCanvas, id + 4);
  }
}
