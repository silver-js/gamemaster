import {branch} from '../uTree.js';

export const uMap = branch('section');
export const uMapData = [];
export const setMapData = (m)=>{
  while(uMapData.length){
    uMapData.pop();
  }
  m.forEach(x=>{uMapData.push(x)});
  refreshView();
}


const mapList = uMap.add(branch('ul', {
  classAdd: 'flex-list',
  scopedStyle: 'background: #222; canvas{width: 100%;} button{width: 3rem; padding: .2rem 0;}'
}));

// updating list
const refreshView = ()=>{
  mapList.clear();

  uMapData.forEach((n, i)=>{
    // creating canvas and filling it
    const liBranch = mapList.add(branch('li'));
    const pBranch = liBranch.add(branch('p', {html: `map_${i}(${n.name})`}));
    
    const canv = liBranch.add(branch('canvas')).dom;
    canv.width = n.width * 5;
    canv.height = n.height * 5;
    const ctx = canv.getContext('2d');

    n.layers.forEach(layer => {
      layer.data.forEach((row, y) => {
        row.forEach((tile, x) => {
          if(tile != 0){
            ctx.fillStyle = `hsl(${180 + 4 * tile}, 100%, 50%)`;
            ctx.fillRect(x*5, y*5, 4, 4);
          }
        });
      });      
    });
    const delBtn = pBranch.add(branch('button', {txt:'Del'})).dom;
    delBtn.addEventListener('click', ()=>{removeMap(n)});
    
    const moveUpBtn = liBranch.add(branch('button', {txt:'<'})).dom;
    moveUpBtn.addEventListener('click', ()=>{mapMove(n, -1)});
    
    const moveDownBtn = liBranch.add(branch('button', {txt:'>'})).dom;
    moveDownBtn.addEventListener('click', ()=>{mapMove(n, 1)});
  });
}

// map remover
const removeMap = (map)=>{
  const iPos = uMapData.indexOf(map);
  if(iPos >= 0){
    uMapData.splice(iPos,1);
    refreshView();
  }
}

const mapMove = (map, x)=>{
  const iPos = uMapData.indexOf(map);
  if(iPos >= 0 && iPos + x >= 0 && iPos + x < uMapData.length){
    const a = uMapData[iPos];
    uMapData[iPos] = uMapData[iPos + x];
    uMapData[iPos + x] = a;
    refreshView();
  }
}

// file to mapData
const fileToMapData = async (file)=>{
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
    const mData = JSON.parse(p);

    const mapData = {
      name: file.name.split('.')[0],
      width: mData.width,
      height: mData.height,
      layers: mData.layers.filter(l => l.type == 'tilelayer').map(l => {
        const d = [];
        while(l.data.length){
          d.push(l.data.splice(0, l.width));
        }
        return {
          data: d,
          x: l.x,
          y: l.y
        }
      }),
      objects: mData.layers.filter(l => l.type == 'objectgroup').map(l =>{
        return l.objects.map(o => {
          const sName = o.name.split('_');

          const gameObj = {
            type: sName[0],
            id: sName[1] || '0',
            x: o.x / mData.tilewidth,
            y: o.y / mData.tileheight
          }
          return gameObj;
        });
      })
    }
    
    return mapData;
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
  const x = await fileToMapData(file);
  if(!x) return;

  // loading map data
  uMapData.push(x);
  refreshView();

  e.target.value = null;
});

uMap.add(
  branch(
    'button', {
      txt: 'Add',
      classAdd: 'clickable',
      style: 'background: none; padding: .3rem;'
    }
  )
).dom.addEventListener('click', ()=>{filePicker.click();});