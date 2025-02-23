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


const refreshUI = ()=>{
  domTitle.innerText = rom.name;
}


//// <-- Load/Save session --> ////
const loadLocalStorage = ()=>{
  const x = localStorage.getItem('rom');
  if(x){
    try {
      console.log('Previous session detected', x);
    } catch (e) {
      console.log('Error loading session', e);
    }
  }else{
    console.log('Previous session not detected, starting new session', rom);
  }
  refreshUI();
}
loadLocalStorage();

const saveLocalStorage = ()=>{
  // save session code goes here
}





















console.log('testing');
