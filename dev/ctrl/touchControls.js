'use strict'
const touchWrapper = document.createElement("div");
touchWrapper.style = `
  position: fixed;
  top:0;
  left:0;
  width:100%;
  height:100vh;
  background-color:#f002;pointer-events:none;
`;
document.body.appendChild(touchWrapper);
const handleStart = (e)=>{
  e.preventDefault();
}
const handleEnd = (e)=>{
  e.preventDefault();
}
touchWrapper.addEventListener("touchstart", handleStart);
touchWrapper.addEventListener("touchend", handleEnd);
touchWrapper.addEventListener("touchcancel", handleEnd);

const menuButton = document.createElement("div");
menuButton.style=`
  position:fixed;
  top:4px;
  right:4px;
  width:32px;
  height:32px;
  background-color:green;
`;
document.body.appendChild(menuButton);
menuButton.addEventListener('click',()=>{
  menuButton.style.backgroundColor='pink'
})

export const enableTouch = ()=>{
  console.log('enabling touch controls');
}
//export default "lol";
/*

const menuBtn = makeDiv(document.body);
menuBtn.style=`
    z-index:1000;
    position:fixed;
    font-size:3vmin;
    text-align:center;
    white-space:nowrap;
    top:4px;
    right:4px;
    padding:1vmin 0 0;
    border-radius:1vmin;
    box-shadow:1px 1px 1px 1px #bbb;
    color:#fff;
    background:#000;
    transition:.1s;
`;
let padState = "off";
const padSwitch = (x)=>{
    padState = x;
    padWindow.style.pointerEvents = "on"?'auto':'none';
}
padSwitch("on");
const menuSwitch = (x)=>{
    menuActive = x;
    menuBtn.style.width = x?'80vmin':'11vmin';
    menuBtn.style.height = x?'80vmin':'5vmin';
    menuBtn.innerHTML = x?`w8`:'&#10012; <sub>&#9900;&#9900;</sub> &#10070;'
}
menuSwitch(false);
menuBtn.addEventListener('click',()=>{
    if(!menuActive){
        menuSwitch(true);
    }
});






*/