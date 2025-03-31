// DOM setup
let res = .2
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
  const gl = sCanv.getContext('webgl2');
  gl.imageSmoothingEnabled = false;
  gl.webkitImageSmoothingEnabled = false;
  gl.mozImageSmoothingEnabled = false;
  
  /* ---------- TESTING ----------- */

  gl.clearColor(0.2,.2,.2,1.0);
  
  const modelData = new Float32Array([
    -16, -16,
    -16, 16,
    16, 16,
    16, 16,
    16, -16,
    -16, -16
  ]);
  const spriteData = new Float32Array([
    // position xy      scale xy    rotation
    -100,100,           4,1,          45 * Math.PI / 4,
    //-100,-100,          1,1,          0,
    //100,100,            1,1,          10,
    //100,-100,            2,2,         90,
  ]);

  const modelBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, modelBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, modelData, gl.STATIC_DRAW);

  const spriteBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, spriteBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, spriteData, gl.STATIC_DRAW);

  const vertexTxt = `#version 300 es
    precision mediump float;
    
    layout(location = 0) in vec2 vertPos;

    layout(location = 1) in vec2 spritePos;
    layout(location = 2) in vec2 spriteScale;
    layout(location = 3) in float spin;
    layout(location = 4) in float type;
    
    const float rad = 0.01745329;

    uniform vec2 pxScale;
    
    out vec3 texCoords;
    void main(){
      if(type == 0.0)
      {
        texCoords = vec3(vertPos, 1.0);
      }
      else if(type == 1.0)
      {
        texCoords = vec3(0.0, 0.0, 1.0);
      }
      else if(type == 2.0){
        texCoords = vec3(0.0, 1.0, 1.0);
      }
      else{
        texCoords = vec3(1.0, 0.0, 0.0);
      }
      gl_Position = vec4((vec2(vertPos.x * spriteScale.x * cos(spin * rad) - vertPos.y * spriteScale.y * sin(spin * rad), vertPos.x * spriteScale.x * sin(spin * rad) + vertPos.y * spriteScale.y * cos(spin * rad)) + spritePos) * pxScale, 0.0, 1.0);
    }
  `;
  const fragmentTxt = `#version 300 es
    precision mediump float;
    
    in vec3 texCoords;
    out vec4 outputColor;

    void main(){
      outputColor = vec4(texCoords,1.0);
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
  gl.vertexAttribDivisor(1,1);
  gl.vertexAttribDivisor(2,1);
  gl.vertexAttribDivisor(3,1);
  gl.vertexAttribDivisor(4,1);
  
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
    6 * 4,
    0
  );
  gl.vertexAttribPointer(
    2,
    2,
    gl.FLOAT,
    false,
    6 * 4,
    2 * 4
  );
  gl.vertexAttribPointer(
    3,
    1,
    gl.FLOAT,
    false,
    6 * 4,
    4 * 4
  );
  gl.vertexAttribPointer(
    4,
    1,
    gl.FLOAT,
    false,
    6 * 4,
    5 * 4
  );

  const drawSprites = (arr)=>{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr), gl.STATIC_DRAW);

    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, Math.floor(arr.length / 6));
    ctx.drawImage(sCanv,0,0);
  }
  let spin = 0;
  const spriteArr = [];
  for(let i = 0; i < 1000; i ++){
    spriteArr.push(
      Math.random() * 640 - 320, Math.random() * 360 - 180, // x, y
      10, 10,                                               // w, h
      Math.floor(Math.random()*360), Math.floor(Math.random() * 4)
    );
  }
  setInterval(()=>{
    for(let i = 0; i < spriteArr.length / 6; i++){
      spriteArr[6 * i] = (spriteArr[6*i] + 960 + Math.sin(i/deg)) % 640 - 320;
      spriteArr[6 * i + 1] = (spriteArr[6 * i + 1] + 540 + Math.cos(i/deg)) % 360 - 180;
      spriteArr[4 + 6 * i]+= (i % 2) * 2 - 1;
    }
    drawSprites(spriteArr);
  },100);

  /* ---------- TESTING ----------- */
  
  return {
    setAtlas: ()=>{}
  }
}


// sprites loader

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
