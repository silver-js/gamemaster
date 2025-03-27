// DOM setup

const canv = document.getElementById('gm-main');
//const ctx = canv.getContext('2d');
const ctx = canv.getContext('2d', {alpha:false});
canv.width = 640;
canv.height = 360;
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


// internal methods:
/*
const iClear = (c)=>{
  c.clearRect(0,0,640,360);
*/
// image layers

const hScale = 1 / 320;
const vScale = 1 / 180;
const iBuffer = ()=>{
  const bCanv = document.createElement('canvas');
  bCanv.width = 640;
  bCanv.height = 360;
  const gl = bCanv.getContext('webgl2');
  //gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  const program = gl.createProgram()
  gl.clearColor(0.0,0.0,0.0,0.0);

  // each webgl program is guaranteed at least 16 attributes
  // more than 65k vertices per draw call is theoricaly posible but not recomended

  const vShaderSource = `#version 300 es
  layout(location = 0) in vec2 aPosition;
  layout(location = 1) in vec2 aTextCoord;
  
  out vec2 vTextCoord;
  void main()
  {
    vTextCoord = aTextCoord;
    gl_Position = vec4(aPosition, 0, 1.0);
  }`;
//#in float vSprite;
  const fShaderSource = `#version 300 es
  precision mediump float;
  
  uniform sampler2D uSampler;
  in vec2 vTextCoord;

  out vec4 fragColor;
  void main()
  {
    fragColor = texture(uSampler, vTextCoord);
  }`;

  const vShader = gl.createShader(gl.VERTEX_SHADER)
  gl.shaderSource(vShader, vShaderSource);
  gl.compileShader(vShader);
  gl.attachShader(program, vShader);

  const fShader = gl.createShader(gl.FRAGMENT_SHADER)
  gl.shaderSource(fShader, fShaderSource);
  gl.compileShader(fShader);
  gl.attachShader(program, fShader);

  gl.linkProgram(program);
  if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
    console.log(gl.getShaderInfoLog(vShader))
    console.log(gl.getShaderInfoLog(fShader))
  }
  gl.useProgram(program);


  gl.enableVertexAttribArray(0);
  gl.enableVertexAttribArray(1);


  const elementIndexBuffer = gl.createBuffer()

  let sprBuffer = [];
  const sprSize = 1 / 20;
  let atlasStepX = .1;
  let atlasStepY = .1;
  let atlasW = .2;
  let atlasH = .2;
  let atlasColumns = 1;

  return {
    sprite: (x, y, spr)=>{
      const sX = x * hScale;
      const sY = y * vScale;
      const aX = (spr % atlasColumns) * atlasStepX;
      const aY = Math.floor(spr / atlasColumns) * atlasStepY;
      sprBuffer.push(
        sX, sY, aX, aY,
        sX + 32 * hScale, sY, aX + atlasW, aY,
        sX, sY + 32 * vScale, aX, aY +atlasH,

        sX + 32 * hScale, sY, aX + atlasW, aY,
        sX + 32 * hScale, sY + 32 * vScale, aX + atlasW, aY + atlasH,
        sX, sY + 32 * vScale, aX, aY + atlasH,
      );
    },
    setAtlas: (atlas)=>{
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      const textImg = new Image();
      textImg.onload = ()=>{
        const w = textImg.width;
        const h = textImg.height;
        atlasStepX = atlas.tileSize / w;
        atlasStepY = atlas.tileSize / h;
        atlasW = atlas.tileSize / w;
        atlasH = atlas.tileSize / h;
        atlasColumns = Math.floor(w / atlasW);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textImg);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      }
      textImg.src = atlas.src;
    },
    draw: ()=>{
      const bufferData = new Float32Array(sprBuffer);
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);

      gl.vertexAttribPointer(
        0,        // attrib location
        2,        // attrib values
        gl.FLOAT, // attrib type
        false,    // normalization
        4 * 4,    // elements per point * bytes
        0         // offset in bytes
      );

      gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 4 * 4, 2 * 4);
      
      gl.drawArrays(gl.TRIANGLES, 0, sprBuffer.length / 4);
      
      ctx.drawImage(bCanv,0,0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      sprBuffer = [];
    }
  }
  /*
  bCtx.imageSmoothingEnabled = false;
  bCtx.webkitImageSmoothingEnabled = false;
  bCtx.mozImageSmoothingEnabled = false;
  bCtx.filter = "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxmaWx0ZXIgaWQ9ImZpbHRlciIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj48ZmVDb21wb25lbnRUcmFuc2Zlcj48ZmVGdW5jUiB0eXBlPSJpZGVudGl0eSIvPjxmZUZ1bmNHIHR5cGU9ImlkZW50aXR5Ii8+PGZlRnVuY0IgdHlwZT0iaWRlbnRpdHkiLz48ZmVGdW5jQSB0eXBlPSJkaXNjcmV0ZSIgdGFibGVWYWx1ZXM9IjAgMSIvPjwvZmVDb21wb25lbnRUcmFuc2Zlcj48L2ZpbHRlcj48L3N2Zz4=#filter)";
  bCtx.font = "24px Verdana";
  bCtx.textBaseline = 'top';
  return {
    draw: ()=> ctx.drawImage(bCanv,0,0),
    clear: ()=> iClear(bCtx),
    lineColor: (c)=> bCtx.strokeStyle = c,
    color: (c)=> bCtx.fillStyle = c,
    font: (x)=> bCtx.font = x,
    textAlign: (x)=> bCtx.textAlign=x,
    text: (t,x,y)=> bCtx.fillText(t,x,y),
    lineText: (t,x,y)=> bCtx.strokeText(t,x,y),
    rect: (x,y,w,h)=> bCtx.fillRect(x,y,w,h),
    lineRect: (x,y,w,h)=> bCtx.strokeRect(x+.5,y+.5,w-1,h-1),
    arc: (x,y,r,s,e)=>{
      bCtx.beginPath();
      bCtx.arc(x,y,r,s*deg,e*deg);
      bCtx.lineTo(x,y);
      bCtx.fill();
    },
    lineArc: (x,y,r,s,e)=>{
      bCtx.beginPath();
      bCtx.arc(x,y,r,s*deg,e*deg);
      bCtx.stroke();
    },
    figure: (...args)=>{
      bCtx.beginPath();
      bCtx.moveTo(args[0],args[1]);
      for(let i=2; i<args.length; i+=2){
        bCtx.lineTo(args[i], args[i+1]);
      }
      bCtx.fill();
    },
    lines: (...args)=>{
      bCtx.beginPath();
      bCtx.moveTo(args[0],args[1]);
      for(let i=2; i<args.length; i+=2){
        bCtx.lineTo(args[i], args[i+1]);
      }
      bCtx.stroke();
    },
    img: (image,x,y)=>{
      bCtx.drawImage(image,x,y);
    },
    img2: (image,x,y,w,h)=>{
      bCtx.drawImage(
        image,
        0, 0, image.width, image.height,
        x, y, w, h
      );
    },
    img3: (image,a,x,y,w,h)=>{
      bCtx.save();
      bCtx.translate(x,y);
      bCtx.rotate(a * deg);
      bCtx.translate(- x,- y);
      bCtx.drawImage(
        image,
        0, 0, image.width, image.height,
        x-w/2, y-h/2, w, h
      );
      bCtx.restore();
    },
  }
  */
}


// <-- Based on Indigo Code Tutorial --> //
const spriteLayer = ()=>{
  const sCanv = document.createElement('canvas');
  sCanv.width = 640;
  sCanv.height = 360;
  const gl = sCanv.getContext('webgl2');
  
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
  
  gl.uniform2f(pxScaleLocation, 2 / canv.width, 2 / canv.height);


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

    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, Math.floor(arr.length / 5));
    ctx.drawImage(sCanv,0,0);
  }
  let spin = 0;
  const spriteArr = [];
  for(let i = 0; i < 20000; i ++){
    spriteArr.push(
      Math.random() * 640 - 320, Math.random() * 360 - 180,
      .3, .3,
      spin, Math.floor(Math.random() * 4)
    );
  }
  setInterval(()=>{
    spin = (spin + 2) % 360;
    for(let i = 0; i < spriteArr.length / 6; i++){
      spriteArr[4 + 6 * i] = spin + i * 15;
    }
    drawSprites(spriteArr);
  },16);

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

export default {spriteLayer, iBuffer, sBuffer, clear, loadAtlas};


/*
to test...

  bCtx.filter = 'url(data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><filter id="f" color-interpolation-filters="sRGB"><feComponentTransfer><feFuncA type="discrete" tableValues="0 1"/></feComponentTransfer></filter></svg>#f)';

*/
