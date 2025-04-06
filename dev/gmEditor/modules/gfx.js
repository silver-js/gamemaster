// DOM setup
let res = 1;
const gameWrapper = document.getElementById("game-wrapper")
const canv = document.createElement('canvas');
gameWrapper.appendChild(canv);
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
export default {
  canv,
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
    for(let i = 0; i < args.length - 2; i+=2){
      let a = args[i+2] - args[i];
      let o = args[i+3] - args[i+1];
      let h = Math.sqrt(a**2 + o**2);
      let spin = (o < 0 ? 1 : -1 ) * Math.acos(o/h) / deg;
      spriteArr.push(args[i] + a / 2, args[i + 1] + o / 2 , lineWidth, h , spin, spin, 1, 1, 0, ...clr);
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
        loaderCtx.drawImage(aImg, i * tileSize, j * tileSize, tileSize, tileSize, 0, loaderCanvas.height - tileSize * (2 + i + (j * tW)) , tileSize, tileSize);
      }
    };
    loadTexture(loaderCanvas, id + 4);
  }
}
