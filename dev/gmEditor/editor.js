//// <-- Init --> ////
const rom  = {
  name: 'My Game',
  code: [''],
  maps: [],
  gfx: [],
  sfx: [],
};

//// <-- UI --> ////
const domTitle = document.getElementById('game-h');
const domBtn = document.getElementById('play-stop-btn');
const domEditor = document.getElementById('editor-wrapper');
const domGame = document.getElementById('game-wrapper');

const updateUI = ()=>{
  domTitle.innerText = `${rom.name} v${rom.version}`;
}

// title data
domTitle.addEventListener('click', ()=>{
  const author = prompt('Author Name: ', rom.author);
  if(author && author != rom.author){
    rom.author = author;
    putData('game_data', {key: 'author', value: author});
  }
  const name = prompt('Project Name: ', rom.name);
  if(name && name != rom.name){
    rom.name = name;
    putData('game_data', {key: 'name', value: name});
  }
  const version = prompt('Version: ', rom.version);
  if(version && version != rom.version){
    rom.version = version;
    putData('game_data', {key: 'version', value: version});
  }
  updateUI();
});

// ux
let playState = false;
const playPause = ()=>{
  playState = !playState;
  domBtn.innerHTML = playState?'&#x23f9 Stop':'&#9658 Play';
  domEditor.style.display = playState?'none':'flex';
  domGame.style.display = playState?'flex':'none';
}
domBtn.addEventListener('click',playPause);


//// <-- idb rom load --> ////
const updateRom = ()=>{
  const dQuery = getAllData('game_data');
  dQuery.onsuccess = ()=>{
    const dRes = dQuery.result;
    dRes.forEach(n =>{
      rom[n.key] = n.value;
    });
    const cQuery = getAllData('game_code');
    cQuery.onsuccess = ()=>{
      const cRes = cQuery.result;
      cRes.forEach(n =>{
        rom.code[n.page] = n.value;
      });
      updateUI();
    }
  }
}


//// <-- idb methods --> ////
const getAllData = store =>{
  const tx = db.transaction(store);
  tx.onerror = e => console.log(`ERROR loading '${store}' store.`, e.target.error);
  const storeData = tx.objectStore(store);
  return storeData.getAll();
}
const putData = (store, x) =>{
  const tx = db.transaction(store, 'readwrite');
  tx.onerror = e => console.log(`ERROR loading '${store}' store.`, e.target.error);
  const storeData = tx.objectStore(store);
  storeData.put(x);
}


//// <-- indexedDB --> ////
let db = null;
const dbRequest = indexedDB.open("rom");
dbRequest.onupgradeneeded = e=>{
  const res = e.target.result;
  const dataStore = res.createObjectStore("game_data", {keyPath: 'key'});
  dataStore.put({key:"name", value: 'unnamed game'});
  dataStore.put({key:"author", value: 'anonymus'});
  dataStore.put({key:"version", value: 0.1});
  
  const codeStore = res.createObjectStore("game_code", {keyPath: 'page'});
  codeStore.put({page: 0, value: ''});

  res.createObjectStore("game_maps", {keyPath: 'name'});
  res.createObjectStore("game_gfx", {keyPath: 'name'});
  res.createObjectStore("game_sfx", {keyPath: 'name'});
  console.log('database created...');
}
dbRequest.onsuccess = e=>{
  db = e.target.result;
  updateRom()
}
dbRequest.onerror = e=>{
  console.log('ERROR:', e.target.error);
}


console.log('testing');
