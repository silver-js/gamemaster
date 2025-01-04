// DOM setup

const gWrapper = document.getElementById('game-wrapper');
const canv = document.createElement('canvas');
const ctx = canv.getContext('2d', {alpha:false});
canv.width = 640;
canv.height = 360;
gWrapper.appendChild(canv);
const checkFlip = ()=>{
  const r = window.innerWidth/window.innerHeight;
  const w = r < 1.8 ? "100%" : "auto";
  const h = r < 1.8 ? "auto" : "98vh";
  canv.style = `
    box-shadow: 0 0 1px 1px grey;
    width:${w};
    height:${h};
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

const iClear = (c)=>{
  c.clearRect(0,0,640,360);
}


// image layers

const iBuffer = ()=>{
  const bCanv = document.createElement('canvas');
  bCanv.width = 640;
  bCanv.height = 360;
  const bCtx = bCanv.getContext('2d');
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

const sBuffer = ()=>{}


// main canvas methods

const clear = ()=> iClear(ctx);


// export

export default {iBuffer, sBuffer, clear, loadAtlas};


/*
to test...

  bCtx.filter = 'url(data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><filter id="f" color-interpolation-filters="sRGB"><feComponentTransfer><feFuncA type="discrete" tableValues="0 1"/></feComponentTransfer></filter></svg>#f)';

*/
