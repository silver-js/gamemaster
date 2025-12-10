import pixics from './pixics.js';

// setting and testing visualization canvas
const canv = document.createElement('canvas');
canv.width = 512;
canv.height = 512;
const ctx = canv.getContext('2d');
document.body.appendChild(canv);
for(let i = 0; i < canv.width / 2; i++){
  ctx.fillStyle = `rgb(${Math.random()*256}, ${Math.random()*256}, ${Math.random()*256})`;
  
  ctx.fillRect(2 * i, 0, 2, 512)

}
ctx.fillStyle = '#000';
ctx.fillRect(100,100,100,100);



// water particle:
// speedX, speedY, level, type


const fShaderSource = [
  '#version 300 es',
  'precision mediump float;',
  `float pxSize = 1.0/${canv.width}.0;`,
  'vec4 luColor;',
  'vec4 uColor;',
  'vec4 ruColor;',
  'vec4 lColor;',
  'vec4 cColor;',
  'vec4 rColor;',
  'vec4 ldColor;',
  'vec4 dColor;',
  'vec4 rdColor;',
  
  'in vec2 txCoord;',
  'uniform sampler2D uSampler;',

  'out vec4 fragColor;',

  'void main(){',
  '  luColor = texture(uSampler, txCoord + vec2(- pxSize, pxSize));',
  '  uColor = texture(uSampler, txCoord + vec2(0.0, pxSize));',
  '  ruColor = texture(uSampler, txCoord + pxSize);',

  '  lColor = texture(uSampler, txCoord + vec2(- pxSize, 0.0));',
  '  cColor = texture(uSampler, txCoord);',
  '  rColor = texture(uSampler, txCoord + vec2(pxSize, 0.0));',
  
  '  ldColor = texture(uSampler, txCoord - pxSize);',
  '  dColor = texture(uSampler, txCoord + vec2(0.0, -pxSize));',
  '  rdColor = texture(uSampler, txCoord + vec2(pxSize, -pxSize));',

  '  cColor.x = cColor.x + (rColor.z - cColor.z)/2.0;',
  '  cColor.y = cColor.y + (dColor.z - cColor.z)/2.0;',
  '  cColor.z = cColor.z + cColor.x - lColor.x + cColor.y - uColor.y;',


  '  fragColor = cColor;',
  '}'
].join('\n');

pixics.setRes(9);
const myProgram = pixics.newProgram(fShaderSource);

const loop = setInterval(()=>{
  myProgram.tick(canv);
  ctx.drawImage(pixics.canv, 0, 0);
}, 15);




console.log(myProgram);
