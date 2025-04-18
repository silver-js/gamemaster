import _gfx from './gfx.js';
let fps = 0;
let playState = true;
setInterval(()=>{
  if(playState){
    console.log(fps + ' fps');
    fps = 0;
  }
},1000)
/*
  Some test data! 
*/
const roomImg = {
  data: "data:image/png;base64,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",
  tileSize: 32
}

const tSet = {
      src: "data:image/png;base64,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",
      tileSize: 16,
}

const pxFont ={
      src: "data:image/png;base64,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",
      tileSize: 8
}

/*--------------------------------------------------------------------------*/
// to do:
/*
- uniforms
- instanced drawing
- texture3d
- normal mapping

// how to:
setup an intuitive way to use texture3d
*/
/*--------------------------------------------------------------------------*/



const deg = Math.PI / 4;

_gfx.loadAtlas(0, roomImg.data, 32);
_gfx.res(4)

const objArr = [];
const arrLength = 500;
for(let i = 0; i < arrLength; i ++){
  objArr.push({
    x: Math.random() * 640 - 320,
    y: Math.random() * 360 - 180,
    w: 8 + Math.random() * 56,
    h: 8 + Math.random() * 56,
    spin: Math.random() * 360
  });
}
const stressLoop = ()=>{
  fps++;
  let o;
  for(let i = 0; i < arrLength; i++){
    o = objArr[i];
    o.x = (o.x + 960 + Math.sin(i/deg)) % 640 - 320;
    o.y = (o.y + 540 + Math.cos(i/deg)) % 360 - 180;
    o.spin += (i % 2) * 2 - 1;
    _gfx.spr(0,0, o.x, o.y, o.w, o.h, o.spin);
  }
  _gfx.spr(
    0, 0,    // atlasId, spriteId
    128, 0,    // x, y
    64, 64,  // width, height (optional)
    45, 45,  // rotation X (optional), rotation Y optional
    1, .5     // scaleX, scaleY
  );
  _gfx.spr(
    0, 0,    // atlasId, spriteId
    -128, 0,    // x, y
    64, 64,  // width, height (optional)
  );
  _gfx.spr(
    0, 0,    // atlasId, spriteId
    0, 0,    // x, y
    64, 64,  // width, height (optional)
    45
  );
  _gfx.color(0,0,0,255)
  for(let i = 0; i < arrLength; i++){
    _gfx.lines(Math.random() * 640 - 320, Math.random()*360 - 180, Math.random() * 640 - 320, Math.random()*360 - 180);
  }

  _gfx.color(128,0,128,128)
  for(let i = 0; i < arrLength; i++){
    _gfx.rect(Math.random() * 640 - 320, Math.random()*360 - 180, Math.random()*64, Math.random()*64);
  }
  
  _gfx.color(128,0,128,128)
  for(let i = 0; i < arrLength; i++){
    _gfx.text('some text', Math.random() * 640 - 320, Math.random()*360 - 180);
  }

  _gfx.draw();
  setTimeout(stressLoop);
};

let d = 0;
_gfx.color(Math.random()*256,Math.random()*256,Math.random()*256,255);
const testLoop = ()=>{
  _gfx.color(255,255,0,255);
  d = (d+1)%360;
  _gfx.rect(0,0, 100,100, d);
  for(let i = 0; i<37; i ++){
    _gfx.rect(16 * i - 302,1, 15, 15);
  }
  _gfx.lines(-136, 132, -136, 164, 142, 164, 142, 132, -136, 132);
  _gfx.font(0);
  _gfx.text('a  b  c  d  e  f  g  h  i  j  k  l  m', -300,150);
  _gfx.font(1);
  _gfx.text('a  b  c  d  e  f  g  h  i  j  k  l  m', -300,100);
  
  //layer1.text('n  o  p  q  r  s  t  u  v  w  x  y  z', -300,100);
  _gfx.color(0,255,0,200);
  _gfx.text('A  B  C  D  E  F  G  H  I  J  K  L  M', -300,50);
  _gfx.text('N  O  P  Q  R  S  T  U  V  W  X  Y  Z', -300,0);
  _gfx.text('Hola Mundo!', 100,-50);
  
  _gfx.spr(0, 0, -100, -100);
  
  
  _gfx.spr(0, 1, -64, -68);
  _gfx.spr(0, 2, -32, -68);
  _gfx.spr(0, 3, 0, -68);
  _gfx.spr(0, 4, 32, -68);

  _gfx.spr(0, 5, -64, -100);
  _gfx.spr(0, 6, -32, -100);
  _gfx.spr(0, 7, 0, -100);
  _gfx.spr(0, 8, 32, -100);

  _gfx.spr(0, 9, -64, -132);
  _gfx.spr(0, 10, -32, -132);
  _gfx.spr(0, 11, 0, -132);
  _gfx.spr(0, 12, 32, -132);

  _gfx.lines(-100,-100,100,100)
  _gfx.lines(200,100,100,120)



  _gfx.draw();
  fps++;
  setTimeout(testLoop);
}


//stressLoop();
testLoop();










/*
layer1.setAtlas(pxFont);
const makeTile = ()=>{
  return {
  x: Math.random() * 640 - 320,
  sx: Math.random() * 16 - 8,
  y: Math.random() * 360 - 180,
  sy: Math.random() * 16 - 8,
  spr: Math.floor(Math.random()*4),
  }
}
const tileArr = [];
for(let i = 0; i < 5000; i++){
  tileArr.push(makeTile());
}
let anim = 0;
setInterval(()=>{anim = (anim + 1) % 4},100);
document.querySelector('button').addEventListener('click', ()=> playState = !playState);
let playState = false;
const draw = ()=>{
  if(playState){
    for(let x = -320; x < 320; x += 32){
      for(let y = -180; y < 180; y += 32){
        layer1.sprite(x,y,12+anim);
      }
    }

    //layer1.setAtlas(icons);
    layer1.sprite(0,0,anim)
    layer1.sprite(-320, -180,1);
    tileArr.forEach(n=>{
      n.x = ((n.x + 960 + n.sx) % 640) - 320;
      n.y = ((n.y + 540 + n.sy) % 360) - 180;

      layer1.sprite(n.x, n.y, n.spr + anim);
    });

    _gfx.clear();
    layer1.draw();
    fps++;
  }
  setTimeout(draw)
}
draw();

*/
/*
let loaded = false;     // since sprites are loaded asyncronously, you should have a loading state.


const drawPipeline = ()=>{
  gfx.clear();
  layer1.draw();
  layer2.draw();
}
let arcFrame = 0;
const drawLoop = ()=> {
  // layer1
  arcFrame = (arcFrame + 10) % 360;
  layer1.clear();
  layer1.color('#99f');
  layer1.arc(60, 60, 40, 0, 360);
  layer1.color('#00f');
  layer1.arc(60,60,40,arcFrame + 30, arcFrame + 60);
  layer1.lineColor('#f0f');
  layer1.lineArc(60,60,44, 270, arcFrame + 45);

  layer1.color('#f00');
  layer1.rect(100,100,60,60);
  layer1.lineColor('#0f0');
  layer1.lineRect(110,110,60,60);
  
  layer1.textAlign('left');
  layer1.font('32px courier');
  layer1.lineColor('#fff');
  layer1.lineText('left aligned test text...' + arcFrame/10, 0, 0);

  layer1.textAlign('center');
  layer1.font('italic 24px verdana');
  layer1.text('centered test text lol', 320,32);


  layer1.color('#95f');
  layer1.figure(
    200, 100,
    220, 140,
    270, 140,
    230, 180,
    250, 230,
    200, 200,
    150, 230,
    170, 180,
    130, 140,
    180, 140
  );
  layer1.lineColor('#369');
  layer1.lines(300, 200, 240, 140, 180, 200, 300,200);


  // layer2:
  if(loaded){
    layer2.clear();
    layer2.color('#fff');
    layer2.text('data loaded', 300,100);
    layer2.img(spr[1],300,120);
    layer2.img(spr[30],332,152);
    layer2.img(spr[104],300,184);
    layer2.img(spr[103],300,216);
    
    layer2.img2(spr[8],364,216, 32,64);

    layer2.img3(spr[9],arcFrame,420,200,64,64);
  }





  drawPipeline();
}

setInterval(drawLoop,1000/24);


let spr;
const loader = async () => {
  try{
    spr = await gfx.loadAtlas('tileset_1_1.png', 16, 2, 1, 1, 1, 1);
    const vShader = await layer3.vShader('./vsData.txt');
    if(vShader){
      const fShader = await layer3.fShader('./fsData.txt');
      if(fShader){
        const program = layer3.newProgram(vShader,fShader);
        layer3.useProgram(program);
        loaded = true;
      }
    }
  }
  catch(err){
    console.log('error:' , err)
  }
}
loader();



*/

console.log('test ok');
