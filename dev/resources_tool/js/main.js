import {trunk, branch} from './uTree.js';
import {uImg, uImgData, setImgData} from './branches/uImg.js';
import {uMap, uMapData, setMapData} from './branches/uMap.js';
import {uMp3, uMp3Data} from './branches/uMp3.js';
import {uMidi, uMidiData} from './branches/uMidi.js';
import {uMisc, uMiscData} from './branches/uMisc.js';

// rom res
/*
  img => arr with base64 data
  tilesets => arr with tilesets(img, tilewidth, tileheight, offsetX, offsetY, marginX, marginY)
  map => arr with map data(layers, objects)
  mp3 => arr with base64 data?
  midi => arr with midi data?
  misc => random data
*/


// header
const header = branch(`header`);
trunk.add(header);
header.add(branch('h1', {txt: `GM resource tool`, classAdd: 'txt-center'}));

const navBar = header.add(branch('nav', {
  scopedStyle: 'margin: 0 .5rem; ul{margin-top: .5rem} li{width: 8rem;}'
}));


// load/save menu

const fileToResourceData = async (file)=>{
  try{
    const p = await new Promise(function(res,rej){
      if(!file){
        rej('File not found!');
      }
      const reader = new FileReader();
      reader.onload = ()=>{
        res(reader.result);
      }
      reader.readAsText(file);
    });
    const rData = JSON.parse(p);
    return rData;
  }
  catch(err){
    console.log(err);
  }
}

const filePicker = document.createElement('input');
filePicker.type = 'file';
filePicker.addEventListener('input', async(e)=>{
  const file = e.target.files[0];

  // checking file
  if(!file) return;
  const x = await fileToResourceData(file);
  if(!x) return;

  // loading data
  setMapData(x.map);
  setImgData(x.img);

  e.target.value = null;
});

const navLoadSave = navBar.add(branch('ul', {
  classAdd: 'flex-centered txt-center'
}));

navLoadSave.add(
  branch('li', {
    txt: 'Load', classAdd: 'clickable'
    }
  )
).dom.addEventListener('click', ()=>{
  filePicker.click();
});

navLoadSave.add(branch('li', {
    txt: 'Save', classAdd: 'clickable'
})).dom.addEventListener('click', ()=>{
  const resData = {
    img: uImgData,
    map: uMapData
  }
  const resStr = JSON.stringify(resData);
  console.log('resource file size(kb):', resStr.length / 100, resData);
  
  // save file script:
  const link = document.createElement('a');
  const blob = new Blob([resStr], {type: 'application/json'});
  const url = URL.createObjectURL(blob);

  link.href = url;
  link.download = 'resources.json';
  link.click();
});

// navigation
const navSections = navBar.add(branch('ul', {
  classAdd: 'flex-centered txt-center'
}));

const navSectionsArr = [
  navSections.add(branch('li', {
    txt: 'Images', classAdd: 'clickable', data: 'img'
  }))
  ,
  navSections.add(branch('li', {
    txt: 'Maps', classAdd: 'clickable', data: 'map'
  }))
  ,
  navSections.add(branch('li', {
    txt: 'MP3', classAdd: 'clickable', data: 'mp3'
  }))
  ,
  navSections.add(branch('li', {
    txt: 'MIDI', classAdd: 'clickable', data: 'midi'
  }))
  ,
  navSections.add(branch('li', {
    txt: 'Misc', classAdd: 'clickable', data: 'misc'
  }))
]
navSectionsArr.forEach(n=>{
  n.dom.addEventListener('click', ()=>{
    updateMode(n.dom.data);
    n.classAdd('selected');
  });
});

// main
const main = branch('main', {scopedStyle: 'padding: .5rem; section{box-shadow: 0 0 1px #fff; padding: .3rem}'});
trunk.add(main);

// page modes handler
let currentBranch = null;
const pageModes = {
  img: uImg,
  map: uMap,
  mp3: uMp3,
  midi: uMidi,
  misc: uMisc
}

const updateMode = (mode)=>{
  if(currentBranch){
    main.remove(currentBranch);
  }
  if(pageModes[mode]){
    currentBranch = pageModes[mode];
    main.add(currentBranch);
  }else{
    currentBranch = null;
  }
  navSectionsArr.forEach(n=>n.classRemove('selected'))
}

// defaulting to images tab
navSectionsArr[0].dom.click();