let imgTarget = -1;
let tSize = 32;
let xOffset = 0;
let hMargin = 0;
let tScale = 1;
let yOffset = 0;
let vMargin = 0;
let zoom = 1;

const domList = document.querySelector('#editor-gfx ul');
const confTitle = document.querySelector('#editor-gfx h4');
const confWrapper = document.getElementById('gfx-conf-wrapper');
const filePicker = document.getElementById('gfx-file-picker');
const canvA = document.getElementById('gfx-canv-a');
const ctxA = canvA.getContext('2d');
const canvB = document.getElementById('gfx-canv-a');
const ctxB = canvB.getContext('2d');

const confAll = document.querySelectorAll('#gfx-conf input');
const refreshConf = ()=>{
  tSize = Number(confAll[0].value);
  xOffset = Number(confAll[1].value);
  hMargin = Number(confAll[2].value);
  zoom = Number(confAll[3].value) / 2;
  tScale = Number(confAll[4].value);
  yOffset = Number(confAll[5].value);
  vMargin = Number(confAll[6].value);
}

// base img buffer

const domImg = document.createElement('img');
const drawOnCanvas = ()=>{
  refreshConf();
  if(tSize > 1){
    const tileQtyX = Math.floor((domImg.width - xOffset + hMargin)/(tSize + hMargin))
    const tileQtyY = Math.ceil((domImg.height - yOffset + vMargin)/(tSize + vMargin));
    canvA.width = (tSize+1) * 8;
    canvA.height = (tSize+1) * Math.ceil(tileQtyX * tileQtyY / 8);
    const scaleSize = tSize * tScale * zoom;
    for(let i = 0; i < tileQtyX; i++){
      for(let j = 0; j < tileQtyY; j++){
        const canvIndex = j * tileQtyX + i;
        ctxA.drawImage(
          domImg,
          i * (tSize + hMargin) + xOffset, j * (tSize + vMargin) + yOffset, tSize, tSize,
          (canvIndex % 8) * (scaleSize + 1), Math.floor(canvIndex / 8) * (scaleSize + 1), scaleSize, scaleSize
        );
      }
    }
  }
}
for(let i = 0; i < 7; i++){
  confAll[i].addEventListener('change', drawOnCanvas);
}
domImg.onload = ()=>{
  drawOnCanvas()
}

const updateGfx = ()=>{
  console.log(db.rom.gfx);
  domList.innerHTML = '';
  for(let k in db.rom.gfx){
    domList.innerHTML += `<li><img />${k}</li>`
  }
  domList.innerHTML += `<li value=-1> + </li>`
}





domList.addEventListener('click', e=>{
  if(e.target.value != undefined){
    if(e.target.value == -1){
      confTitle.innerText = 'Creating new tileset:';
    }
    confWrapper.classList.remove('hidden');
    imgTarget = e.target.value;

  }
});



filePicker.addEventListener('click', e=>{
  const input = document.createElement('input');
  input.type = 'file';
  input.onchange = (i)=>{
    const file = i.target.files[0];
    const reader = new FileReader();
    reader.onload = ()=>{
      domImg.src = reader.result;
    }
    reader.readAsDataURL(file);
  }
  input.click();
})



db.loaderFunctions.push(updateGfx);

