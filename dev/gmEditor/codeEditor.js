// init
let codePage = 0;
let codeLine = 0;
window.codeLineOffset = 8;

// dom
const domCodePages = document.getElementById('pages-list');
const domCodeText = document.querySelector('#code-area textarea');
const domCodeLines = document.querySelector('#code-lines');
const domCodePre = document.querySelector('#js-code');

domCodePages.addEventListener('mousewheel', e=>{
  domCodePages.scrollLeft += e.deltaY;
});
const codeScroll = ()=>{
  const code = document.querySelectorAll('#code-area code');
  code[0].scrollTop = domCodeText.scrollTop;
  code[1].scrollTop = domCodeText.scrollTop;
  code[1].scrollLeft = domCodeText.scrollLeft;
}

const renderCode = (e)=>{
  if( e && e.inputType == 'insertLineBreak'){
    const cPoint = e.target.selectionStart;
    const preStr = e.target.value.slice(0,cPoint);
    let padding = '';
    preStr.split('\n').splice(-2)[0].replace(/^[\t\s]+/g, (x)=>{
      padding = x;
    });
    e.target.value = preStr + padding + e.target.value.slice(cPoint);
    e.target.selectionStart = cPoint + padding.length;
    e.target.selectionEnd = cPoint + padding.length;
  }
    db.rom.code[codePage] = domCodeText.value;
    db.updateRom('code', codePage);
  let i = codeLine + 1;
  let lineText = i++ + '.\n';
  domCodeText.value.replace(/\n/g, ()=>{lineText += `${i++}.\n`});
  domCodePre.innerHTML = `<code class="language-javascript">${domCodeText.value}\n</code>`;
  domCodeLines.innerHTML = `<code class="languaje-javascript">${lineText}\n</code>`;
  hljs.highlightAll();
  codeScroll();
};
domCodeText.addEventListener('input', renderCode);
domCodeText.addEventListener('keydown', e=>{
  if(e.key == 'Tab'){
    e.preventDefault();
    const cPoint = e.target.selectionStart;
    e.target.value = e.target.value.slice(0,cPoint) + '\t' + e.target.value.slice(cPoint);
    e.target.selectionStart = cPoint + 1;
    e.target.selectionEnd = cPoint + 1;
    renderCode();
  }
});
domCodeText.addEventListener('scroll', codeScroll);

const switchPage = (val)=>{
  if(val >= 0){
    const lastPage = document.querySelector('#pages-list .selected');
    if(lastPage){
      lastPage.classList.remove('selected');
    }
    const nextPage = document.querySelector(`#pages-list li[value="${val}"]`);
    if(nextPage){
      nextPage.classList.add('selected');
    }
    codePage = val;
    codeLine = codePage ? db.rom.code.slice(0,codePage).join('\n').split('\n').length + codeLineOffset: codeLineOffset;
    domCodeText.value = db.rom.code[codePage];
    renderCode();
  }else if(val == -1){
    db.rom.code.push('');
    loadCode();
    switchPage(db.rom.code.length - 1)
  }
  domCodeText.focus();
}
domCodePages.addEventListener('click', e =>{
  switchPage(e.target.value);
});
domCodePages.addEventListener('contextmenu', e =>{
  e.preventDefault();
  const p = e.target.value;
  if(p >= 0 && db.rom.code.length > 1 && confirm(`Delete page ${p+1}?`)){
    db.rom.code.splice(p,1);
    for(let i = p; i < db.rom.code.length; i++){
      db.updateRom('code', i);
    }
    db.deleteEntry('code', db.rom.code.length);
    loadCode();
    switchPage(codePage < p ? codePage : codePage - 1);
  }
});

const loadCode = ()=>{
  domCodePages.innerHTML = '';
  db.rom.code.forEach((n, i)=>{
    domCodePages.innerHTML += `<li${i == 0 ? ' class = "selected"' : ''} value=${i}>${i+1}</li>`
  });
  domCodePages.innerHTML += '<li value=-1>+</li>';
}

db.loaderFunctions.push(loadCode, ()=>{switchPage(0)});
