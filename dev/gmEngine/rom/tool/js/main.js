import {trunk, branch} from './uTree.js';
import {uImg, uImgData} from './branches/uImg.js';
import {uMap, uMapData} from './branches/uMap.js';
import {uMp3, uMp3Data} from './branches/uMp3.js';
import {uMidi, uMidiData} from './branches/uMidi.js';
import {uMisc, uMiscData} from './branches/uMisc.js';

// rom res
const res = {};
/*
  img => arr with base64 data?
  map => arr with map data?
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
const navLoadSave = navBar.add(branch('ul', {
  classAdd: 'flex-centered txt-center'
}));

navLoadSave.add(
  branch('li', {
    txt: 'Load', classAdd: 'clickable'
    }
  )
).dom.addEventListener('click', ()=>{
  alert('here goes the "load file" script');
});

navLoadSave.add(branch('li', {
    txt: 'Save', classAdd: 'clickable'
})).dom.addEventListener('click', ()=>{
    console.log(uImgData);
  alert('here goes the "save to file" script');
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
