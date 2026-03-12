import osk from './osk.js';
const canv = document.querySelector("#kb");
const textArea = document.querySelector("#debug");

const ctx = canv.getContext("2d");

const kbSize = 26;
const kbOffsetX = 6
const kbOffsetY = 6
ctx.font = `bold ${kbSize - 6}px verdana`;
ctx.textAlign = 'center';
ctx.textBaseline = 'top';
const drawKb = ()=>{
osk.draw((k, x, y, w)=>{
	ctx.fillStyle = '#000';
	ctx.fillRect(kbOffsetX + 2 + x * kbSize, kbOffsetY + 2 + y * kbSize, kbSize * w - 4, kbSize - 4);
	ctx.fillStyle = '#246';
	ctx.fillRect(kbOffsetX + x * kbSize, kbOffsetY + y * kbSize, kbSize * w - 4, kbSize - 4);
	//ctx.strokeRect(4 + x * kbSize, 4 + y * kbSize, kbSize * k.length - 2, kbSize - 2);
	ctx.fillStyle = '#000';
	ctx.fillText(k, 4 + (x + w/2) * kbSize, 8 + y * kbSize);
	ctx.fillStyle = '#ccc';
	ctx.fillText(k, 2 + (x + w/2) * kbSize, 6 + y * kbSize);
});
}
drawKb();

/////////////////////////////////////
canv.addEventListener("click", (e)=>{
	const cRect = canv.getBoundingClientRect();
	const pxScale = 300 / cRect.width
	const cX = (e.pageX - cRect.left) * pxScale;
	const cY = (e.pageY - cRect.top) * pxScale;
	
	const kbX = Math.floor((cX - kbOffsetX) / kbSize);
	const kbY = Math.floor((cY - kbOffsetY) / kbSize);
	
	const key = osk.getKey(kbX, kbY);
	drawKb();
	
	textArea.value = kbX + ', ' + kbY + '\n';
	textArea.value += key || '';
})

//ctx.fillRect(0,0,200,200);