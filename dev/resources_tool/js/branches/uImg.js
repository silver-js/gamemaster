import {branch} from '../uTree.js';

export const uImg = branch('section');
export const uImgData = [];
export const setImgData = (m)=>{
  while(uImgData.length){
    uImgData.pop();
  }
  m.forEach(x=>{uImgData.push(x)});
  refreshView();
}

const imgList = uImg.add(branch('ul', {
  classAdd: 'flex-list',
  scopedStyle: 'background: #222; img{width: 100%;} button{padding: .2rem 0; width: 3rem;}'
}));

// updating list
const refreshView = ()=>{
  imgList.clear();

  uImgData.forEach((n, i)=>{
    const imgItem = imgList.add(branch('li'));
    const delBtn = imgItem.add(
      branch('p', {html: i})
    ).add(
      branch('button', {txt: 'Del'})
    );
    imgItem.add(branch('img',{src:`${n}`}));
    
    delBtn.dom.addEventListener('click', ()=>{
      removeImg(n);
    });
    
    const moveUpBtn = imgItem.add(branch('button', {txt:'<'})).dom;
    moveUpBtn.addEventListener('click', ()=>{imgMove(n, -1)});
    
    const moveDownBtn = imgItem.add(branch('button', {txt:'>'})).dom;
    moveDownBtn.addEventListener('click', ()=>{imgMove(n, 1)});
  });
}

// img remover
const removeImg = (img)=>{
  const iPos = uImgData.indexOf(img);
  if(iPos >= 0){
    uImgData.splice(iPos,1);
    refreshView();
  }
}

const imgMove = (map, x)=>{
  const iPos = uImgData.indexOf(map);
  if(iPos >= 0 && iPos + x >= 0 && iPos + x < uImgData.length){
    const a = uImgData[iPos];
    uImgData[iPos] = uImgData[iPos + x];
    uImgData[iPos + x] = a;
    refreshView();
  }
}

// file to imgData
const fileToImgData = async (file)=>{
  try{
    const p = await new Promise(function(res,rej){
      if(!file || !file.type.includes('image')){
        rej('invalid file type!');
      }
      const reader = new FileReader();
      reader.onload = ()=>{
        res(reader.result);
      }
      reader.readAsDataURL(file);
    });
    return p;
  }
  catch(err){
    console.log(err);
  }
}

// file picker
const filePicker = document.createElement('input');
filePicker.type = 'file';
filePicker.addEventListener('input', async(e)=>{
  const file = e.target.files[0];

  // checking file
  if(!file) return;
  const x = await fileToImgData(file);
  if(!x) return;

  // loading image
  uImgData.push(x);
  refreshView();

  e.target.value = null;
});


// file pick button
uImg.add(
  branch(
    'button',
    {
      txt: 'Add',
      classAdd: 'clickable',
      style: 'background: none; padding: .3rem;'
    }
  )
).dom.addEventListener('click', () => {
  filePicker.click()
});