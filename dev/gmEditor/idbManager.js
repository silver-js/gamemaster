//// <-- init --> ////
window.db  = {
  rom:{
    name: 'Loading...',
    author: 'Awaiting database',
    version: 'x.x',
    code: [''],
    maps: [],
    atlas: [null, null, null, null],
    fonts: [null, null, null, null],
    sfx: [],
  },
  loaderFunctions: [],
  onload: function(){
    this.loaderFunctions.forEach(n=>{
      n();
    })
  }
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
const deleteData = (store, x) =>{
  const tx = idb.transaction(store, 'readwrite');
  tx.onerror = e => console.log(`ERROR loading '${store}' store.`, e.target.error);
  const storeData = tx.objectStore(store);
  storeData.delete(x);
}
const clearStore = async (store) =>{
  const p = new Promise(res=>{
    const tx = idb.transaction(store, 'readwrite');
    tx.onerror = e => console.log(`ERROR loading '${store}' store.`, e.target.error);
    const storeData = tx.objectStore(store);
    const req = storeData.clear();
    req.onsuccess = ()=>{
      res(true);
    }
  });
}

//// <-- idb rom load --> ////
const loadRomDB = ()=>{
  const aQuery = getAllData('game_data');
  aQuery.onsuccess = ()=>{
    const aRes = aQuery.result;
    aRes.forEach(n =>{
      db.rom[n.key] = n.value;
    });
    const bQuery = getAllData('code');
    bQuery.onsuccess = ()=>{
      const bRes = bQuery.result;
      bRes.forEach(n =>{
        db.rom.code[n.id] = n.value;
      });
      const cQuery = getAllData('atlas');
      cQuery.onsuccess = ()=>{
        const cRes = cQuery.result;
        cRes.forEach(n=>{
          db.rom.atlas[n.id] = n.value;
        });
        const dQuery = getAllData('fonts');
        dQuery.onsuccess = ()=>{
          const dRes = dQuery.result;
          dRes.forEach(n=>{
            db.rom.fonts[n.id] = n.value;
          });
          db.onload();
        }
      }
    }
  }
}

//// <-- indexedDB --> ////

const startDb = new Promise(res=>{
  const dbRequest = indexedDB.open("rom");
    dbRequest.onupgradeneeded = e=>{
    const res = e.target.result;
    const dataStore = res.createObjectStore("game_data", {keyPath: 'key'});
    dataStore.put({key:"name", value: 'unnamed game'});
    dataStore.put({key:"author", value: 'anonymus'});
    dataStore.put({key:"version", value: 0.1});
  
    const codeStore = res.createObjectStore("code", {keyPath: 'id'});
    codeStore.put({id: 0, value: ''});

    res.createObjectStore("maps", {keyPath: 'id'});
    const atlasStore = res.createObjectStore("atlas", {keyPath: 'id'});
    atlasStore.put({id: 0, value: null})

    const fontStore = res.createObjectStore("fonts", {keyPath: 'id'});
  
    res.createObjectStore("sfx", {keyPath: 'id'});
    console.log('database created...');
  }
  dbRequest.onsuccess = e=>{
    idb = e.target.result;
    loadRomDB();
    res(true);
  }
  dbRequest.onerror = e=>{
    console.log('ERROR:', e.target.error);
    res(false);
  }
});
startDb



// <-- Data Update --> //

db.updateData = (k)=>{
  putData('game_data', {key: k, value: db.rom[k]});
}
db.updateRom = (list, id)=>{
  putData(list, {id, value: db.rom[list][id]});
}
db.deleteEntry = (list, id)=>{
  deleteData(list, id);
}
db.loadRom = async(r)=>{
  db.rom = r;
  db.updateData('author');
  db.updateData('name');
  db.updateData('version');
  await clearStore('code');
  for(let i = 0; i < db.rom.code.length; i++){
    db.updateRom('code', i);
  }
  await clearStore('atlas');
  for(let i = 0; i < db.rom.atlas.length; i++){
    db.updateRom('atlas', i);
  }
  location.reload();
}
