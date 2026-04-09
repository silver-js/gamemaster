import {branch} from '../uTree.js';

export const uMap = branch('section');
export const uMapData = [];

/*

const imgList = uImg.add(branch('ul', {
  classAdd: 'flex-list',
  scopedStyle: 'background: #222; img{width: 100%;}'
}));

// updating list
const refreshView = ()=>{
  imgList.clear();

  uImgData.forEach((n, i)=>{
    imgList.add(branch('li', {html: `${i}<img src="${n}"/>`}))
  });
  console.log(uImgData);
}
*/
// file to mapData
const fileToMapData = async (file)=>{
  try{
    const p = await new Promise(function(res,rej){
      if(!file || !file.type.includes('text')){
        rej('invalid file type!');
      }
      const reader = new FileReader();
      reader.onload = ()=>{
        res(reader.result);
      }
      reader.readAsText(file);
    });
    return p;
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

  // loading image
  //uImgData.push(x);
  //refreshView();
  console.log(x)

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