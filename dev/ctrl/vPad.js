'use strict'
import {dLog} from './dLog.js';


///////////////////////////////
// creating virtual gamepads //
///////////////////////////////

const vPadBuffer = new ArrayBuffer(48);
const vPadData = new Uint8ClampedArray(vPadBuffer);

function makePad(index){
    const btn = new Uint8ClampedArray(vPadBuffer,index*12,8);
    const axis = new Int8Array(vPadBuffer,index*12+8,4);
    this.btn = (id)=>{
        return Boolean(btn[id]);
    }
    this.axis = (id)=>{
        return axis[id];
    }
}


//////////////
// mappings //
//////////////

const defaultCfg = {
  gp:{},
  kb:{},
  tp:[
    {
      x:45, w:10,
      y:0, h:10,
      t:0, i:[7]
    }, {
      x:5, w:40,
      y:55, h:40,
      t:1, i:[1]
    }, {
      x:50, w:25,
      y:75, h:25,
      t:0, i:[3]
    }, {
      x:75, w:25,
      y:75, h:25,
      t:0, i:[2]
    }, {
      x:50, w:50,
      y:50, h:50,
      t:1, i:[8,9,11,12]
    },
    
  ]
}
let gpCfg, kbCfg, tpCfg;
const refreshConf = (x)=>{
    gpCfg = x.gp;
    kbCfg = x.kb;
    tpCfg = x.tp;
}
refreshConf(defaultCfg);


////////////////////////
// touch controls DOM //
////////////////////////


const tpScale = new Float32Array(3); // vw, vh, vmin
const scaleResize = ()=>{
    tpScale.set([window.innerWidth / 100, window.innerHeight / 100]);
    tpScale[2] = Math.min(tpScale[0],tpScale[1]);
}
scaleResize();
window.addEventListener('resize',scaleResize);

const makeDiv = (t)=>{
    const d = document.createElement("div");
    t.appendChild(d);
    return d;
}
const tpArea = makeDiv(document.body);
tpArea.style = `
    box-shadow:0 0 1px 1px red;
    position:fixed;
    inset:0;
    z-index:999;
`;
const tpPoint = [];
for(let i=0;i<5;i++){
    const tpp = makeDiv(tpArea);
    tpp.style=`
        position: fixed;
        display: none;
        border-radius:50%;
        width: ${tpScale[2]*10}px;
        height: ${tpScale[2]*10}px;
        background-color: #0002;
    `;
    tpPoint.push(tpp);
}

const tpZones = [];
const buildTpZones = () =>{
    tpCfg.forEach((n,i)=>{
        const newArea = makeDiv(tpArea);
        newArea.style = `
            position: fixed;
            border-radius:8px;
            background-color:#${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}05;
            width:${n.w}%;
            height:${n.h}%;
            top:${n.y}%;
            left:${n.x}%;
        `
        console.log(n.x,n.y);
    });
}
buildTpZones();





let tpActive = true;
const tpSwitch = (x)=>{
    tpActive = x;
    tpArea.style.pointerEvents = x?'auto':'none';
}
//tpSwitch(false);


////////////////////
// touch controls //
////////////////////


const touchData = new Uint16Array(30); //active, type, index*4
const touchOrigin = new Float32Array(10) // x, y

const setPoint = (id,x,y)=>{
    tpPoint[id].style.left = `${x-5*tpScale[2]}px`;
    tpPoint[id].style.top = `${y-5*tpScale[2]}px`;
    tpPoint[id].style.display = "block";
}

tpArea.addEventListener('touchstart',(e)=>{
    e.preventDefault();
    const t = e.changedTouches[0];
    touchOrigin[2*t.identifier] = t.clientX/tpScale[0];
    touchOrigin[2*t.identifier+1] = t.clientY/tpScale[1];
    setPoint(t.identifier,t.clientX,t.clientY);
    const match = tpCfg.find(n=>{
        if(n.x>touchOrigin[2*t.identifier]){
            return false
        }else if(n.x+n.w<touchOrigin[2*t.identifier]){
            return false
        }else if(n.y>touchOrigin[2*t.identifier+1]){
            return false
        }else if(n.y+n.h<touchOrigin[2*t.identifier+1]){
            return false
        }else{
            return true
        }
    });
    if(match){
        touchData.set([1,match.t,...match.i],6*t.identifier);
        if(match.t==0){
            vPadData[match.i]=255;
        }
        dLog(touchData);
    }
});

const tpStop = (e)=>{
    const t = e.changedTouches[0];
    tpPoint[e.changedTouches[0].identifier].style.display = "none";
    if(touchData[6*t.identifier+1]==0){
        vPadData[touchData[6*t.identifier+2]]=0;
    }
}
tpArea.addEventListener('touchend',tpStop);
tpArea.addEventListener('touchcancel',tpStop);
/*
    
    touchData[0] = 3 * e.changedTouches[0].identifier;
    touches.set([e.changedTouches.clientX, e.changedTouches.clientY],touchData[0]);
    
    // finding touch match
    touchData[1] = e.changedTouches[0].clientX * viewData[0];
    touchData[2] = e.changedTouches[0].clientY * viewData[1];
    const match = tpCfg.find(n=>{
        if(n.x > touchData[1]){return false}
        if(n.y > touchData[2]){return false}
        if(n.x + n.w < touchData[1]){return false}
        if(n.y + n.h < touchData[2]){return false}
        return true
    });
    if(match){
        
    }
    touches[touchData[0]+2] = match ? match.t : 0;
    
    
    dLog(touches[2]);
    if(menuActive){
        menuSwitch(false);
    }
    
});
*/
/*
padWindow.addEventListener('touchmove',(e)=>{
    e.preventDefault();
    /*
    touchData[0] = 3 * e.changedTouches[0].identifier;
    dLog(touches[touchData[0]+2]);
    
    //dLog([
    //    tpId,
    //    e.changedTouches[0].clientX - touches[tpId],
    //    e.changedTouches[0].clientY - touches[tpId + 1]
    //]);
});
*/
/*
enableTouch(padArr);
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
export const initTouch = (arr)=>{
    
}
//export default "lol";

*/
  
// testing
/* this randomly presses buttons on second gamepad */
setInterval(function(){
    vPadData[16+Math.floor(Math.random()*8)]=Math.floor(Math.random()*2);
    vPadData[24+Math.floor(Math.random()*8)]=Math.floor(Math.random()*127);
},500);


// exports

export const p1 = new makePad(0);
export const p2 = new makePad(1);
export const p3 = new makePad(2);
export const p4 = new makePad(3);