// DOM setup
let res = 1;
const canv = document.getElementById('gm-main');
//const ctx = canv.getContext('2d');
const ctx = canv.getContext('2d', {alpha:false});
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
const reRes = ()=>{
  canv.width = 640 * res;
  canv.height = 360 * res;
}
reRes();


// internal values:
const deg = Math.PI/180;


// layers:

const spriteLayer = ()=>{
  const sCanv = document.createElement('canvas');
  sCanv.width = 640 * res;
  sCanv.height = 360 * res;
  sCanv.style = 'image-rendering: pixelated';
  const gl = sCanv.getContext('webgl2');
  gl.imageSmoothingEnabled = false;
  gl.webkitImageSmoothingEnabled = false;
  gl.mozImageSmoothingEnabled = false;
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  gl.clearColor(0.2,.2,.2,1.0);
  
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
    
    out vec2 texCoord;
    out vec4 fData;
    out float fType;

    void main(){
      gl_Position = vec4(vec2(
        vertPos * sprSize * vec2(cos(spin.x * rad), cos(spin.y * rad)) + vec2(-vertPos.y * sprSize.y * sin(spin.y * rad), vertPos.x * sprSize.x * sin(spin.x * rad)) + spritePos / scale
      ) * pxScale * scale, 0.0, 1.0);
      fData = data;
      fType = type;
      texCoord = vertPos;
    }
  `;
  const fragmentTxt = `#version 300 es
    precision mediump float;
    
    in vec2 texCoord;
    uniform sampler2D uSampler;
    
    in vec4 fData;
    in float fType;
    out vec4 outputColor;
    
    vec4 fColor;
    
    void main(){
      if(fType == 0.0){
        fColor = fData;
      }else if(fType == 1.0){
        fColor = vec4(fData.x / 256.0,0.0,0.0,.5);
      }else if(fType == 2.0){
        fColor = vec4(1.0,1.0,1.0,1.0);
      }else{
        fColor = vec4(.5,1.0,.5,1.0);
      }
      outputColor = texture(uSampler, vec2(texCoord.x + .5, texCoord.y + .5));
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
    ctx.drawImage(sCanv,0,0);
  }
/////////////////////////////////////////////////////////////////
  
  // sprites loader

  const loaderCanvas = document.createElement('canvas');
  loaderCanvas.width = 300;
  loaderCanvas.height = 300;
  const loaderCtx = loaderCanvas.getContext('2d');
  document.body.appendChild(loaderCanvas);
  loaderCtx.fillStyle = '#ff0';
  loaderCtx.fillRect(0,0,150,150);
  loaderCtx.fillStyle = '#f0f';
  loaderCtx.fillRect(150,0,150,150);
  loaderCtx.fillStyle = '#0ff';
  loaderCtx.fillRect(0,150,150,150);
  loaderCtx.fillStyle = '#00f';
  loaderCtx.fillRect(150,150,150,150);

  const loadTexture = (img) =>{
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  }

  loadTexture(loaderCanvas);


// font
const fontStrArr = [];
for(let i = 0; i< 95; i++){
  fontStrArr.push(String.fromCharCode(32 + i));
}

const loadExternalFont = (id, fontdata)=>{

}
const loadFont = (id, font)=>{
    let tSize = 64;
    loaderCanvas.height = tSize;
    loaderCanvas.width = tSize;
    loaderCtx.font = `${tSize}px ${font}`;
    loaderCtx.filter = "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxmaWx0ZXIgaWQ9ImZpbHRlciIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj48ZmVDb21wb25lbnRUcmFuc2Zlcj48ZmVGdW5jUiB0eXBlPSJpZGVudGl0eSIvPjxmZUZ1bmNHIHR5cGU9ImlkZW50aXR5Ii8+PGZlRnVuY0IgdHlwZT0iaWRlbnRpdHkiLz48ZmVGdW5jQSB0eXBlPSJkaXNjcmV0ZSIgdGFibGVWYWx1ZXM9IjAgMSIvPjwvZmVDb21wb25lbnRUcmFuc2Zlcj48L2ZpbHRlcj48L3N2Zz4=#filter)";

    loaderCtx.imageSmoothingEnabled = false;
    loaderCtx.webkitImageSmoothingEnabled = false;
    loaderCtx.mozImageSmoothingEnabled = false;
    loaderCtx.textBaseline = 'bottom';
    loaderCtx.fillStyle = `#fff`;
    fontStrArr.forEach((n, i)=>{
      loaderCtx.clearRect(0,0,80,80);
      loaderCtx.fillText(n, 0, tSize);
    });
    loadTexture(loaderCanvas);
  }
  
  





  /////////////////////////////////////////////////////////////////
  let clr = [1,1,1,1];
  let lineWidth = 2;
  return {
    color: (r,g,b,a = 255)=>{
      clr = [r/255, g/255, b/255, a/255];
    },
    localFont: (id, font)=>{
      loadFont(id, font);
    },
    lines: (...args)=>{
      for(let i = 0; i < args.length - 2; i+=2){
        let a = args[i+2] - args[i];
        let o = args[i+3] - args[i+1];
        let h = Math.sqrt(a**2 + o**2);
        let spin = -Math.asin(a/h) / deg;
        spriteArr.push(args[i] + a / 2, args[i + 1] + o / 2 , lineWidth, h , spin, spin, 1, 1, 0, ...clr);
      }
    },
    rect: (x, y, w, h, sX = 0, sY, scaleX = 1, scaleY = 1)=>{
      spriteArr.push(x, y, w, h, sX, sY != undefined ? sY : sX, scaleX, scaleY, 0, ...clr);
    },
    text: (txt, x, y, w, h, sX = 0, sY, scaleX = 1, scaleY = 1) =>{
      let lineOffset = 0;
      for(let i = 0; i < txt.length; i++){
        spriteArr.push(x + lineOffset, y, w = 16, h = 16, sX, sY != undefined ? sY : sX, scaleX, scaleY, 1, txt.charCodeAt(i) - 32, 0, 0,.5);
        lineOffset += 16;
      }
    },
    spr: (aId, iId, x, y, w = 32, h = 32, sX = 0, sY, scaleX = 1, scaleY = 1)=>{
      spriteArr.push(x, y, w, h, sX, sY != undefined ? sY : sX, scaleX, scaleY, 2, 1, 0, 1, 1);
    },
    draw: ()=>{
      drawSprites(spriteArr)
      spriteArr = [];
    },
    setAtlas: ()=>{}
  }
}






//--------------------------------------------------------------------------------------------




const loadAtlas = async(url, res, scale = 1, ox = 0, oy = 0, hGap = 0, vGap = 0)=>{
  const aImg = new Image();
  aImg.src = url;
  await aImg.decode();

  const cSize = res * scale;

  const aCanv = document.createElement('canvas');
  aCanv.width = cSize;
  aCanv.height = cSize;
  const aCtx = aCanv.getContext('2d');
  aCtx.imageSmoothingEnabled = false;
  aCtx.webkitImageSmoothingEnabled = false;
  aCtx.mozImageSmoothingEnabled = false;

  const imgArr = [];
  const saveImg = ()=>{
    const nImg = new Image();
    nImg.src = aCanv.toDataURL('image/png');
    imgArr.push(nImg)
  }
  saveImg();
  for(let vIndex=oy; vIndex<aImg.height; vIndex+=res+vGap){
    for(let hIndex=ox; hIndex<aImg.width; hIndex+=res+hGap){
      aCtx.drawImage(
        aImg,
        hIndex, vIndex, res, res,
        0, 0, cSize, cSize
      );
      saveImg();
    }
  }
  return imgArr;
}


// shader buffer

const sBuffer = ()=>{
  const bCanv = document.createElement('canvas');
  bCanv.width = 640;
  bCanv.height = 360;
  const bGl = bCanv.getContext('webgl');

  const vBuffer = bGl.createBuffer();
  bGl.bindBuffer(bGl.ARRAY_BUFFER, vBuffer);
  
  return {
    vShader: async (vsTxt)=>{
      try{
        const vRes = await fetch(vsTxt);
        if(vRes.ok){
          const vData = await vRes.text();
          const vShader = bGl.createShader(bGl.VERTEX_SHADER);
          bGl.shaderSource(vShader, vData);
          bGl.compileShader(vShader);
          return vShader;
        }else{
          console.log('failed to fetch vertex shader');
        }
      }
      catch(err){
        console.log('error: ', err);
      }
      return false;
    },
    fShader: async (fsTxt)=>{
      try{
        const fRes = await fetch(fsTxt);
        if(fRes.ok){
          const fData = await fRes.text();
          const fShader = bGl.createShader(bGl.FRAGMENT_SHADER);
          bGl.shaderSource(fShader, fData);
          bGl.compileShader(fShader);
          return fShader;
        }else{
          console.log('failed to fetch fragment shader');
        }
      }
      catch(err){
        console.log('error: ', err);
      }
      return false;
    },
    newProgram: (vShader,fShader)=>{
      const program = bGl.createProgram();
      bGl.attachShader(program,vShader);
      bGl.attachShader(program,fShader);
      bGl.linkProgram(program);
    },
    useProgram: (p)=>{
      bGl.useProgram(p);
    },
    vertexBuffer: (data)=>{
      bGl.bufferData(bGl.ARRAY_BUFFER, data, bGl.STATIC_DRAW);
    }
  }
}


// main canvas methods

const clear = ()=> ctx.clearRect(0,0,640,360);


// export

export default {spriteLayer, sBuffer, clear, loadAtlas};


/*
to test...

  bCtx.filter = 'url(data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><filter id="f" color-interpolation-filters="sRGB"><feComponentTransfer><feFuncA type="discrete" tableValues="0 1"/></feComponentTransfer></filter></svg>#f)';

*/
