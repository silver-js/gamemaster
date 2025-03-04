//// <-- init --> ////
export const db  = {
  rom:{
    name: 'My Game',
    code: [''],
    maps: [],
    gfx: [],
    sfx: [],
  },
  onload: ()=>{}
};

let idb = null;


//// <-- idb methods --> ////
const getAllData = store =>{
  const tx = idb.transaction(store);
  tx.onerror = e => console.log(`ERROR loading '${store}' store.`, e.target.error);
  const storeData = tx.objectStore(store);
  return storeData.getAll();
}
const putData = (store, x) =>{
  const tx = idb.transaction(store, 'readwrite');
  tx.onerror = e => console.log(`ERROR loading '${store}' store.`, e.target.error);
  const storeData = tx.objectStore(store);
  storeData.put(x);
}

//// <-- idb rom load --> ////
const loadRomDB = ()=>{
  const dQuery = getAllData('game_data');
  dQuery.onsuccess = ()=>{
    const dRes = dQuery.result;
    dRes.forEach(n =>{
      db.rom[n.key] = n.value;
    });
    const cQuery = getAllData('game_code');
    cQuery.onsuccess = ()=>{
      const cRes = cQuery.result;
      cRes.forEach(n =>{
        db.rom.code[n.page] = n.value;
      });
      db.onload();
    }
  }
}

//// <-- indexedDB --> ////
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
  idb = e.target.result;
  loadRomDB();
}
dbRequest.onerror = e=>{
  console.log('ERROR:', e.target.error);
}
