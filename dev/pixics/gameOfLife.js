'use strict'

function gameOfLife(){
	
	//<-- Creating a main canvas -->//

	const mCanvas = document.createElement("canvas");
	mCanvas.id="mCanvas";
	const mCtx = mCanvas.getContext("2d");
	let winBitX=window.innerWidth.toString(2);
	let winBitY=window.innerHeight.toString(2);
	mCanvas.width=Math.pow(2,winBitX.length-1);
	mCanvas.height=Math.pow(2,winBitY.length-1);

	document.body.appendChild(mCanvas);


	//< ui >/////////////////////////////////////////////////
	const uiCanv=document.createElement("canvas");
	uiCanv.id="uiCanvas";
	const uiCtx=uiCanv.getContext("2d");
	document.body.appendChild(uiCanv);
	let uiFrameCount=0;
	function uiFps(){
		uiCtx.clearRect(0,0,200,100);
		uiCtx.fillStyle="#ffff00";
		uiCtx.font="30px Arial";
		uiCtx.fillText(`${uiFrameCount}fps`,5,35);
		uiCtx.fillText(`${mCanvas.width}x${mCanvas.height}`,5,70);
		uiFrameCount=0;
	}
	setInterval(uiFps,1000);
	///////////////////////////////////////////////////////















	//<-- Drawing first frame -->//

	for(let i=0;i<mCanvas.width;i++){
		for(let j=0;j<mCanvas.height;j++){
			let actColor=Math.floor(Math.random()*2);
			mCtx.fillStyle=`RGB(${255*actColor},${255*actColor},${255*actColor})`;
			mCtx.fillRect(i,j,1,1);
		}
	}


	//<-- Setting up webGL canvas -->//

	const glCanvas=document.createElement("canvas");
	glCanvas.width=mCanvas.width;
	glCanvas.height=mCanvas.height;
	const gl=glCanvas.getContext("webgl");
	gl.viewport(0,0,gl.drawingBufferWidth,gl.drawingBufferHeight);
	gl.clearColor(1.0,0.0,1.0,1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);


	//<-- Setting up shader code -->//

	const vertShaderSource=`
		attribute vec2 position;
		varying vec2 texCoords;
		int lifeNumber=0;
		void main(){
			texCoords = (position+1.0)/2.0;
			texCoords.y = 1.0-texCoords.y;
			gl_Position = vec4(position,0,1.0);
		}
	`;

	const fragShaderSource=`
		precision highp float;
		varying vec2 texCoords;
		uniform sampler2D textureSampler;
				
		float xSize = 1.0/${mCanvas.width}.0;
		float ySize = 1.0/${mCanvas.height}.0;
		
		void main(){
			vec4 color = texture2D(textureSampler,texCoords);
			vec4 aColor = texture2D(textureSampler,texCoords+vec2(-xSize,ySize));
			vec4 bColor = texture2D(textureSampler,texCoords+vec2(0.0,ySize));
			vec4 cColor = texture2D(textureSampler,texCoords+vec2(xSize,ySize));
			vec4 dColor = texture2D(textureSampler,texCoords+vec2(-xSize,0.0));
			vec4 eColor = texture2D(textureSampler,texCoords+vec2(xSize,0.0));
			vec4 fColor = texture2D(textureSampler,texCoords+vec2(-xSize,-ySize));
			vec4 gColor = texture2D(textureSampler,texCoords+vec2(0.0,-ySize));
			vec4 hColor = texture2D(textureSampler,texCoords+vec2(xSize,-ySize));
			
			//check neighbors
			
			float neighbors = aColor.r + bColor.r + cColor.r + dColor.r + eColor.r + fColor.r + gColor.r + hColor.r;
			
			if(color.r>0.5){
				//alive rules	
				if(neighbors<2.0 || neighbors>3.0){
					color=vec4(0.0,0.0,0.0,1.0);
				}
			}else{
				//dead rules
				if(neighbors==3.0){
					color=vec4(1.0,1.0,1.0,1.0);	
				}
			}
			/////////////////////////////
		
			gl_FragColor = color;
		}
	`;


	//<-- Creating the shaders -->//

	const vertShader = gl.createShader(gl.VERTEX_SHADER);
	const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
	
	gl.shaderSource(vertShader,vertShaderSource);
	gl.shaderSource(fragShader,fragShaderSource);
	
	gl.compileShader(vertShader);
	gl.compileShader(fragShader);
	
	
	//<-- Creating program -->//
	
	const program = gl.createProgram();
	gl.attachShader(program,vertShader);
	gl.attachShader(program,fragShader);
	gl.linkProgram(program);
	
	gl.useProgram(program);
	
	
	//<-- Creating vertices -->//
	
	const vertices = new Float32Array([
		-1,-1,-1,1,1,1,
		-1,-1,1,1,1,-1
	]);


	//< Buffering data -->//

	const vertexBuffer = gl.createBuffer();

	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

	const positionLocation = gl.getAttribLocation(program, "position");

	gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(positionLocation);

	const texture = gl.createTexture();
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	
	function nextFrame(){

		//<-- Creating texture -->//
	
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mCanvas);
	
		gl.drawArrays(gl.TRIANGLES, 0, 6);
	
		///////////////////////////////////////////////////////////////////////////////////////
	
		mCtx.drawImage(glCanvas,0,0);
	}
	
	
	function gLoop() {
		nextFrame();
		uiFrameCount++;
		setTimeout(gLoop,0);
	}

	gLoop();
}
const gol=new gameOfLife;