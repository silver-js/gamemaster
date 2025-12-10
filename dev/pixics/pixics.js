// setting up wgl2 context
const canv = document.createElement('canvas');
const gl = canv.getContext('webgl2');

const setRes = (mult)=>{
  const w = 2 ** mult;
  canv.width = w;
  canv.height = w;
	gl.viewport(0,0,gl.drawingBufferWidth,gl.drawingBufferHeight);
	gl.clearColor(1.0,0.0,1.0,1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
}

const vertArray = new Float32Array([
  -1, -1, -1, 1, 1, 1,
  -1, -1, 1, 1, 1, -1
]);

const vertArrayBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertArrayBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertArray, gl.STATIC_DRAW);

const texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);


const vShaderSource = [
  '#version 300 es',
  'layout(location=0) in vec2 aPosition;',
  'out vec2 txCoord;',
  'void main(){',
  '  txCoord = aPosition / 2.0 + .5;',
  '  gl_Position = vec4(aPosition, 0.0, 1.0);',
  '}'
].join('\n');

const newProgram = (fsTxt)=>{
  const program = gl.createProgram();

  // loading shaders
  const vShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vShader, vShaderSource);
  gl.compileShader(vShader);
  gl.attachShader(program, vShader);

  const fShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fShader, fsTxt);
  gl.compileShader(fShader);
  gl.attachShader(program, fShader);

  gl.linkProgram(program);
  if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
    console.log(gl.getShaderInfoLog(vShader));
    console.log(gl.getShaderInfoLog(fShader));
  }

  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);

  return {
    tick: (img)=>{
      gl.useProgram(program);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
  }
}

export default {
  canv,
  setRes,
  newProgram
};
