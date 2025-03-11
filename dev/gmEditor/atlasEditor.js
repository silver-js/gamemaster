let editName = '';
let tSize = 32;
let xOffset = 0;
let hMargin = 0;
let tScale = 1;
let yOffset = 0;
let vMargin = 0;
let zoom = 2;

const domList = document.querySelector('#editor-atlas ul');
const confTitle = document.querySelector('#editor-atlas h4');
const confWrapper = document.getElementById('atlas-conf-wrapper');
const filePicker = document.getElementById('atlas-file-picker');
const saveBtn = document.getElementById('atlas-save-btn');
const canvA = document.getElementById('atlas-canv-a');
const ctxA = canvA.getContext('2d');
const canvB = document.getElementById('atlas-canv-b');
const ctxB = canvB.getContext('2d');

const confAll = document.querySelectorAll('#atlas-conf input');
const refreshConf = ()=>{
  tSize = Number(confAll[0].value);
  xOffset = Number(confAll[1].value);
  hMargin = Number(confAll[2].value);
  zoom = Number(confAll[3].value);
  tScale = Number(confAll[4].value);
  yOffset = Number(confAll[5].value);
  vMargin = Number(confAll[6].value);
}

canvA.addEventListener('mousemove', e=>{
  const rect = e.target.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  canvB.style.left = x + e.target.offsetLeft - canvB.offsetWidth / 2 + 'px';
  canvB.style.top = y + e.target.offsetTop - canvB.offsetHeight / 2 +'px';
  
  const tW = canvA.offsetWidth / 8
  const bW = canvB.width / 3;

  const posX = Math.floor(x/tW);
  const posY = Math.floor(y/tW);
  const scaleSize = tSize * tScale;
  for(let i = 0; i < 3; i++){
    for(let j = 0; j < 3; j++){
      ctxB.drawImage(canvA, posX * (scaleSize + 1), posY * (scaleSize + 1), scaleSize, scaleSize, bW * i, bW * j, bW, bW);
    }
  }
});
canvA.addEventListener('mouseenter', e=>{
  canvB.width = 3 * tSize * zoom;
  canvB.height = 3 * tSize * zoom;
  canvB.style.transform = 'scale(1)';
});
canvA.addEventListener('mouseleave', e=>{
  canvB.style.transform = 'scale(0)';
});

// base img buffer
const domImg = document.createElement('img');
const drawOnCanvas = ()=>{
  refreshConf();
  if(domImg.src === '//:0' || tSize < 4 || tScale < 1 || hMargin <= -tSize || vMargin <= -tSize){
    canvA.width = 100;
    canvA.height = 10;
    return;
  }
  if(tSize > 1){
    const scaleSize = tSize * tScale;
    const tileQtyX = Math.floor((domImg.width - xOffset + hMargin)/(tSize + hMargin))
    const tileQtyY = Math.ceil((domImg.height - yOffset + vMargin)/(tSize + vMargin));
    canvA.width = (scaleSize+1) * 8;
    canvA.height = (scaleSize+1) * Math.ceil(tileQtyX * tileQtyY / 8);
    for(let i = 0; i < tileQtyX; i++){
      for(let j = 0; j < tileQtyY; j++){
        const canvIndex = j * tileQtyX + i;
        ctxA.fillStyle = "#000";
        ctxA.fillRect(
          (canvIndex % 8) * (scaleSize + 1) - 1, Math.floor(canvIndex / 8) * (scaleSize + 1) - 1,
          scaleSize + 2, scaleSize + 2
        );
        ctxA.fillStyle = "#f0f";
        ctxA.fillRect(
          (canvIndex % 8) * (scaleSize + 1), Math.floor(canvIndex / 8) * (scaleSize + 1),
          scaleSize, scaleSize
        );
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

const updateAtlas = ()=>{
  domList.innerHTML = '';
  const i = 100;
  for(let k in db.rom.atlas){
    domList.innerHTML += `<li><img alt="${k}" src="${db.rom.atlas[k].src}"/>${k}</li>`
  }
  domList.innerHTML += `<li value=-1> + </li>`
}

domList.addEventListener('click', e=>{
  if(e.target.value == -1){
    confTitle.innerText = 'Creating new tileset:';
    confWrapper.classList.remove('hidden');
    editName = '';
    domImg.src = "//:0";
    drawOnCanvas();
    return;
  }
  if(e.target.alt != undefined){
      confTitle.innerText = `Editing ${e.target.alt} tileset`;
      confWrapper.classList.remove('hidden');
      editName = e.target.alt;
      domImg.src = e.target.src;
      confAll[0].value = db.rom.atlas[e.target.alt].tileSize;
      confAll[1].value = db.rom.atlas[e.target.alt].offsetX;
      confAll[2].value = db.rom.atlas[e.target.alt].hMargin;
      confAll[4].value = db.rom.atlas[e.target.alt].scale;
      confAll[5].value = db.rom.atlas[e.target.alt].offsetY;
      confAll[6].value = db.rom.atlas[e.target.alt].vMargin;
      drawOnCanvas();
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
saveBtn.addEventListener('click', ()=>{
  if(domImg.src){
    const atlasName = prompt('Atlas name:', editName);
    if(atlasName){
      if(editName !== ''){
        delete db.rom.atlas[editName];
        db.deleteEntry('atlas', editName);
      }
      db.rom.atlas[atlasName] = {
        src: domImg.src,
        tileSize: tSize,
        offsetX: xOffset,
        hMargin,
        scale: tScale,
        offsetY: yOffset,
        vMargin,
      }
      updateAtlas()
      db.updateRom('atlas', atlasName);
      confWrapper.classList.add('hidden');
      confTitle.innerText = 'Nothing Selected';
      editName = '';
      domImg.src = "//:0";
      drawOnCanvas();
    }
  }
});

db.loaderFunctions.push(updateAtlas);
