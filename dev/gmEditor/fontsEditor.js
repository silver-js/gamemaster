let editName = '';

const domList = document.querySelector('#editor-fonts ul');
const confTitle = document.querySelector('#editor-fonts h4');
const confWrapper = document.getElementById('fonts-conf-wrapper');
const filePicker = document.getElementById('fonts-file-picker');
const saveBtn = document.getElementById('fonts-save-btn');
const canvA = document.getElementById('fonts-canv-a');
const ctxA = canvA.getContext('2d');
const canvB = document.getElementById('fonts-canv-b');
const ctxB = canvB.getContext('2d');


// <-- Draw On Canvas --> //

const demoArr = [];
let demoStr = '';
for(let i = 0; i< 95; i++){
  demoStr += String.fromCharCode(33 + i);
}
while(demoStr.length > 0){
  demoArr.push(demoStr.slice(0,16));
  demoStr = demoStr.slice(16);
}
canvA.height = demoArr.length * 80;
const resizeCanvas = (f)=>{
  ctxA.font = `64px ${f}`;
  let max = 0;
  demoArr.forEach(n=>{
    let l = ctxA.measureText(n).width;
    if(l > max) max = l;
  });
  canvA.width = max;
  ctxA.font = `64px ${f}`;
  ctxA.filter = "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxmaWx0ZXIgaWQ9ImZpbHRlciIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj48ZmVDb21wb25lbnRUcmFuc2Zlcj48ZmVGdW5jUiB0eXBlPSJpZGVudGl0eSIvPjxmZUZ1bmNHIHR5cGU9ImlkZW50aXR5Ii8+PGZlRnVuY0IgdHlwZT0iaWRlbnRpdHkiLz48ZmVGdW5jQSB0eXBlPSJkaXNjcmV0ZSIgdGFibGVWYWx1ZXM9IjAgMSIvPjwvZmVDb21wb25lbnRUcmFuc2Zlcj48L2ZpbHRlcj48L3N2Zz4=#filter)";

  ctxA.imageSmoothingEnabled = false;
  ctxA.webkitImageSmoothingEnabled = false;
  ctxA.mozImageSmoothingEnabled = false;
  ctxA.textBaseline = 'bottom';
}
resizeCanvas('verdana');
const drawOnCanvas = ()=>{
  ctxA.clearRect(0,0,canvA.width,canvA.height);
  ctxA.fillStyle = `#fff`;
  demoArr.forEach((n, i)=>{
    ctxA.fillText(n, 0, 64 + i * 80);
  });
}


// <-- Listing Fonts --> //

const updateFontsList = ()=>{
  domList.innerHTML = '';
  const i = 100;
  const dbFonts = db.rom.fonts;
  for(let k in dbFonts){
    domList.innerHTML += `<li>${k}</li>`
  }
  domList.innerHTML += `<li value=-1> + </li>`
}

domList.addEventListener('click', e=>{
  if(e.target.value == -1){
    confTitle.innerText = 'Creating new font:';
    saveBtn.innerText = 'Save';
    confWrapper.classList.remove('hidden');
    editName = '';
    filePicker.style.display = 'block';
    ctxA.clearRect(0,0,canvA.width,canvA.height);
    return;
  }
  if(e.target.value === 0){
    confTitle.innerText = 'Viewing Font:';
    saveBtn.innerText = 'Rename';
    confWrapper.classList.remove('hidden');
    editName = e.target.innerHTML;
    fontUrl = db.rom.fonts[e.target.innerHTML];
    filePicker.style.display = 'none';
    loadFonts();
  }
});

domList.addEventListener('mousewheel', e=>{
  domList.scrollLeft += e.deltaY;
});

domList.addEventListener('contextmenu', e=>{
  e.preventDefault()
  if(e.target.value === 0){
    const ok = confirm(`Delete "${e.target.innerHTML}"?`);
    if(ok){ 
      db.deleteEntry('fonts', e.target.innerHTML);
      location.reload();
    }
  }
});


// <-- File Picker --> //

let fontUrl = null;
filePicker.addEventListener('click', e=>{
  const input = document.createElement('input');
  input.type = 'file';
  input.onchange = (i)=>{
    const file = i.target.files[0];
    const reader = new FileReader();
    reader.onload = ()=>{
      fontUrl = reader.result;
      loadFonts();
    }
    reader.readAsArrayBuffer(file);
  }
  input.click();
});

async function loadFonts() {
  const font = new FontFace("my-font", fontUrl);
  await font.load();
  document.fonts.add(font);
  resizeCanvas('my-font');
  drawOnCanvas();
}

saveBtn.addEventListener('click', ()=>{
  if(fontUrl){
    const fontName = prompt('Font name: ', editName);
    const regEx = /^\d|[\s\.\-\(\)\[\]\{\},$!]/g
    if(!fontName.length || fontName.match(regEx)){
      alert(`Invalid Name:\n It can only contain numbers, characters and "_" and can't start with a number`);
      return;
    }
    if(db.rom.atlas[fontName]){
      alert(`"${fontName}" already exists as an atlas variable!`);
      return;
    }
    if(db.rom.fonts[fontName] && fontName !== editName){
      alert(`"${fontName}" already exists!`);
      return;
    }
    if(editName !== ''){
      delete db.rom.fonts[editName];
      db.deleteEntry('fonts', editName);
    }
    db.rom.fonts[fontName] = fontUrl;
    db.updateRom('fonts', fontName);
    confWrapper.classList.add('hidden');
    confTitle.innerText = 'Nothing Selected';
    editName = '';
    updateFontsList();
  }
});


db.loaderFunctions.push(updateFontsList);
