let activeAtlas;
let tSize = 32;
let xOffset = 0;
let yOffset = 0;
let trimX = 0;
let trimY = 0;
let hMargin = 0;
let vMargin = 0;
let tAnim = 1;
let zoom = 2;

const domList = document.querySelector('#editor-atlas ul');
const confTitle = document.querySelector('#editor-atlas h4');
const confWrapper = document.getElementById('atlas-conf-wrapper');
const confControls = document.querySelectorAll('.atlas-new-cfg');
const filePicker = document.getElementById('atlas-file-picker');
const saveBtn = document.getElementById('atlas-save-btn');
const canvA = document.getElementById('atlas-canv-a');
const ctxA = canvA.getContext('2d');
const canvB = document.getElementById('atlas-canv-b');
const ctxB = canvB.getContext('2d');

const controlsVisible = (bool)=>{
  for(let i = 0; i < confControls.length; i++){
    confControls[i].style.display = bool ? 'block' : 'none';
  }
}
domList.addEventListener('mousewheel', e=>{
  domList.scrollLeft += e.deltaY;
});

const confBtns = document.querySelectorAll('#atlas-conf button');
const confInputs = document.querySelectorAll('#atlas-conf input');
for(let i = 0; i < confBtns.length; i++){
  confBtns[i].addEventListener('click', e=>{
    const ele = confInputs[Math.floor(i/2)];
    ele.value =  Math.max(ele.min, ele.value - (i % 2 ? -1 : 1));
    drawOnCanvas();
  });
}

const confAll = document.querySelectorAll('#atlas-conf input');
const refreshConf = ()=>{
  tSize = Number(confAll[0].value);
  xOffset = Number(confAll[1].value);
  yOffset = Number(confAll[2].value);
  trimX = Number(confAll[3].value);
  trimY = Number(confAll[4].value);
  hMargin = Number(confAll[5].value);
  vMargin = Number(confAll[6].value);
  tAnim = Number(confAll[7].value);
  zoom = Number(confAll[8].value);
}

let posX = 0;
let posY = 0;
let bW = 16;
const positionCanvB = (e)=>{
  const rect = e.target.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top + e.target.offsetTop;
  canvB.style.left = `${x < rect.width / 2 ? x : x - canvB.offsetWidth}px`;
  canvB.style.top = `${e.screenY > window.innerHeight / 2 ? y - canvB.offsetHeight : y}px`;
}
canvA.addEventListener('mousemove', e=>{
  positionCanvB(e);
  const rect = e.target.getBoundingClientRect();
  
  bW = canvB.width / 3;
  
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  const aScale = canvA.offsetWidth * (tSize + 1) / canvA.width;

  posX = Math.floor(x / aScale);
  posY = Math.floor(y / aScale);
});
let showingSecCanvas = false;
let anim = 0;
const drawCanvAnim = ()=>{
  anim = (anim + 1) % tAnim
  if(showingSecCanvas){
    for(let i = 0; i < 3; i++){
      for(let j = 0; j < 3; j++){
        ctxB.drawImage(canvA, (posX + anim) * (tSize + 1), posY * (tSize + 1), tSize, tSize, bW * i, bW * j, bW, bW);
      }
    }
  }
}
setInterval(drawCanvAnim,150);
canvA.addEventListener('mouseenter', e=>{
  positionCanvB(e);
  showingSecCanvas = true;
  canvB.width = 3 * tSize;
  canvB.height = 3 * tSize;
  canvB.style.transform = 'scale(1)';
  canvB.style.width = zoom * 10 + "%";
});
canvA.addEventListener('mouseleave', e=>{
  showingSecCanvas = false;
  canvB.style.transform = 'scale(0)';
});

// base img buffer
const domImg = document.createElement('img');
const drawOnCanvas = ()=>{
  refreshConf();
  if(domImg.src === '//:0' || tSize < 4 || hMargin <= -tSize || vMargin <= -tSize){
    canvA.width = 100;
    canvA.height = 100;
    return;
  }
  const tQtyX = Math.ceil((domImg.width - xOffset)/(tSize + hMargin)) - trimX;
  const tQtyY = Math.ceil((domImg.height - yOffset)/(tSize + vMargin)) - trimY;
  canvA.width = (tSize + 1) * tQtyX;
  canvA.height = (tSize + 1) * tQtyY;
  for(let i = 0; i < tQtyX; i++){
    for(let j = 0; j < tQtyY; j++){
      const canvIndex = j * tQtyX + i;
      ctxA.fillStyle = "#000";
      ctxA.fillRect(
        (canvIndex % tQtyX) * (tSize + 1) - 1, Math.floor(canvIndex / tQtyX) * (tSize + 1) - 1,
        tSize + 2, tSize + 2
      );
      ctxA.fillStyle = "#f0f";
      ctxA.fillRect(
        (canvIndex % tQtyX) * (tSize + 1), Math.floor(canvIndex / tQtyX) * (tSize + 1),
        tSize, tSize
      );
      ctxA.drawImage(
        domImg,
        i * (tSize + hMargin) + xOffset, j * (tSize + vMargin) + yOffset, tSize, tSize,
        (canvIndex % tQtyX) * (tSize + 1), Math.floor(canvIndex / tQtyX) * (tSize + 1), tSize, tSize
      );
    }
  }
}
for(let i = 0; i < 9; i++){
  confAll[i].addEventListener('change', drawOnCanvas);
}
domImg.onload = ()=>{
  drawOnCanvas()
}

const updateAtlas = ()=>{
  domList.innerHTML = '';
  for(let i = 0; i < 4; i ++){
    if(db.rom.atlas[i]){
      domList.innerHTML += `<li value=${i}><img alt=${i} src="${db.rom.atlas[i].data}"/>${i}</li>`;
    }else{
      domList.innerHTML += `<li value=${i} class="empty">${i}</li>`;
    }
  }
}

domList.addEventListener('click', e=>{
  if(e.target.classList.contains("empty")){
    confTitle.innerText = 'Creating new tileset:';
    saveBtn.innerText = 'Save';
    confWrapper.classList.remove('hidden');
    controlsVisible(true);
    activeAtlas = e.target.value;
    domImg.src = "//:0";
    drawOnCanvas();
    return;
  }
  if(e.target.alt != undefined){
    confTitle.innerText = `Viewing atlas '${e.target.alt}'`;
    confWrapper.classList.remove('hidden');
    saveBtn.innerText = 'Rename'
    activeAtlas = e.target.value;
    domImg.src = e.target.src;
    confAll[0].value = db.rom.atlas[e.target.alt].tileSize;
    for(let i = 1; i < 7; i++){
      confAll[i].value = 0;
    }
    controlsVisible(false);
    drawOnCanvas();
  }
});
domList.addEventListener('contextmenu', e=>{
  e.preventDefault()
  if(e.target.alt != undefined){
    const ok = confirm(`Delete atlas "${e.target.alt}"?`);
    if(ok){ 
      db.deleteEntry('atlas', parseInt(e.target.alt));
      location.reload();
    }
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

const generateAtlas = ()=>{
  const tQtyX = Math.ceil((domImg.width - xOffset)/(tSize + hMargin)) - trimX;
  const tQtyY = Math.ceil((domImg.height - yOffset)/(tSize + vMargin)) - trimY;
  canvA.width = tSize * tQtyX;
  canvA.height = tSize * tQtyY;
  for(let i = 0; i < tQtyX; i++){
    for(let j = 0; j < tQtyY; j++){
      const canvIndex = j * tQtyX + i;
      ctxA.drawImage(
        domImg,
        i * (tSize + hMargin) + xOffset, j * (tSize + vMargin) + yOffset, tSize, tSize,
        (canvIndex % tQtyX) * tSize, Math.floor(canvIndex / tQtyX) * tSize, tSize, tSize
      );
    }
  }
  return canvA.toDataURL();
}
saveBtn.addEventListener('click', ()=>{
  if(domImg.src){
    const dataUri = generateAtlas()
    db.rom.atlas[activeAtlas] = {
      data: dataUri,
      tileSize: tSize,
    }
    updateAtlas()
    db.updateRom('atlas', activeAtlas);
    confWrapper.classList.add('hidden');
    confTitle.innerText = 'Nothing Selected';
    activeAtlas = null;
    domImg.src = "//:0";
    drawOnCanvas();
  }
});

db.loaderFunctions.push(updateAtlas);
