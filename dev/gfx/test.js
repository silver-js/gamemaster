import gfx from './gfx.js';

const layer1 = gfx.iBuffer();
const layer2 = gfx.iBuffer();
const layer3 = gfx.sBuffer('./vdata.txt', './fdata.txt');
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
const testSprites = async () => {
  spr = await gfx.loadAtlas('tileset_1_1.png', 16, 2, 1, 1, 1, 1);
  loaded = true;
  console.log('test done...');
}
testSprites();





console.log('test ok');
