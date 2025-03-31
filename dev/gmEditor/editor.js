//// <-- Init --> ////
import './idbManager.js';
import './codeEditor.js';
import './atlasEditor.js';
import './fontsEditor.js';
import './romPlayer.js';


// rom
const domTitle = document.getElementById('game-title');

domTitle.addEventListener('click', ()=>{
  const author = prompt('Author Name: ', db.rom.author);
  if(author && author != db.rom.author){
    db.rom.author = author;
    db.updateData('author');
  }
  const name = prompt('Project Name: ', db.rom.name);
  if(name && name != db.rom.name){
    db.rom.name = name;
    db.updateData('name');
  }
  const version = prompt('Version: ', db.rom.version);
  if(version && version != db.rom.version){
    db.rom.version = version;
    db.updateData('version');
  }
  updateData();
});

const updateData = ()=>{
  domTitle.innerText = `${db.rom.name} v${db.rom.version}`;
}

db.loaderFunctions.push(updateData);


// project menu
document.getElementById('project-new-btn').addEventListener('click', e=>{
  const ok = confirm('Create new project?\n All unsaved data will be lost!')
  if(ok){
    window.indexedDB.deleteDatabase('rom');
    location.reload();
  }
});
document.getElementById('project-save-btn').addEventListener('click', e=>{
  const romJson = JSON.stringify(db.rom);
  
  const link = document.createElement('a');
  const file = new Blob([romJson], {type: 'text/plain'});
  link.href = URL.createObjectURL(file);
  link.download = `${db.rom.name} v${db.rom.version}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
});
document.getElementById('project-load-btn').addEventListener('click', e=>{
  const input = document.createElement('input');
  input.type = 'file';
  input.onchange = (e)=>{
    try{
      const file = e.target.files[0];

      const reader = new FileReader();
      reader.readAsText(file,'UTF-8');
      // here we tell the reader what to do when it's done reading...
      reader.onload = readerEvent => {
        try{
          var content = readerEvent.target.result; // this is the content!
          const loadedRom = JSON.parse(content);
          //console.log(loadedRom);
          if(Array.isArray(loadedRom.code) && typeof loadedRom.atlas == "object"){
            db.loadRom(loadedRom);
            return
          }
          alert('Invalid ROM data!');

        }
        catch(err2){
          alert('Invalid ROM File!');
          console.log(err2)
        }
      }
    }
    catch(err){
      console.log(err)
    }
  }
  input.click();
})
