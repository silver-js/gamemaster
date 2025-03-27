'notes and limitations:'
// max texture size is 4096 x 4096
// max attribs per vertex is 16
// max uniforms is 256(vertex shader) and 224(fragment shader)
// max 16 textures => up to 12 atlases and 4 fonts

attribs buffer:
  - pos vec2(x,y)
  - size vec2(sizeX, sizeY)
  - skew vec2(degX, degY)
  - squish vec2(squishX, squishY)
  - type float(0 primitive || 1 text || 2 texture)
  - fragData vec4(colorR || textureX, colorG || textureY, colorB || textureIndex, colorA)


actual gfx hard limitations:
- max 10 texture atlases
- max 6 fonts
- *test image bleed on texture size 4096...*


# gfx.js | gfx_min.js

This module manages the game graphics.
Base Canvas size is 640x360, but you can set a multiplier to make it 720p, 1080p and so on.


## Concept:

// With this module you can manage multiple graphicw layers.
// You can also apply shaders to individual layers, then make a pipeline to draw them all on the main canvas.
'The gfx module works mainly on webgl2, this means it needs a little more setup than a normal 2d canvas element, but it is much faster'
// Layer Types
//  - 2d sprite layers will be labeled spriteBuffer(), spriteBuffers can draw sprites, tiles, text, lines and figures.
//  - shaderBuffers() are for advanced users who want to mess arround with custom shaders, 3d rendering and extra effects.


'Usage'

// importing module
import _gfx from './gfx_min.js';  
_gfx.res(2);      // res scale multiplayer, (640 * m) x (360 * m), up to m = 6 (3840x2160)

'The spriteBuffer:'
/*
  when drawing on a spritebuffer, you are actually building a list of textured polygons, 
  and at the end of your draw loop you render them all at once with the draw() method.
  This drawing method takes account for depth and transparency.
*/

'Setting up a spriteBuffer layer'
const myLayer1 = _gfx.spriteBuffer(); // creates a spriteBuffer

// fonts
myLayer1.createFont(      // sets the default font to use when drawing text,
  <index>,                // you can keep up to 6 diferent fonts at a time.
  'verdana'               // it is recomended to load the fonts at initialization.
);


myLayer1.dropFonts();     // discards all loaded fonts.

// img atlas
myLayer1.createAtlas(     // syntax is similar to createFont
  <index>,                // you can have up to 10 diferent atlases at the same time
  <image-canvas-dataurl>,        
  <tile-size>             // you need to specify the tile size of the image in px
);

//



const myShader1 = gfx.sBuffer('./vertex_shader_code.txt', './fragment_shader_code.txt');

/////////////////////////////////////////////////

// here you draw some stuff on the layers


/////////////////////////////////////////////////

gfx.clear();
myShader1.draw();
myLayer1.draw();

```


## text and primitives:

```
myLayer1.color(x);
myLayer1.lineColor(x);
myLayer1.font("format size_in_px font_family");
myLayer1.textAlign("center" || "left" || "right");
myLayer1.text('some text', x, y);    // self explanatory.
myLayer1.lineText('some text', x, y);    // self explanatory.

myLayer1.rect(x,y,w,h);
myLayer1.lineRect(x,y,w,h);
myLayer1.arc(x,y,radius,start_angle,end_angle);
myLayer1.lineArc(x,y,radius,start_angle,end_angle);
myLayer1.figure(x0, y0, x1,y1, x2, y2...);    // makes a figure from diferent coordinates.
myLayer1.lines(x0, y0, x1, y1);   make lines between diferent coordinates.

```


## sprites:

```
const mySprites = gfx.loadAtlas(
  'sprites_file.png', tile_size_in_px, scale_factor,              // load all sprites from a png file and returns an image array.
  offsetX, offsetY, horizontal_gap, vertical_gap                  // this is an async function!
);

myLayer1.img(mySprites[id], x, y);                // draws an image.
myLayer1.img2(mySprites[id], x, y, w, h);         // draws an image with a specified width and height.
myLayer1.img3(mySprites[id], angle, x, y, w, h);  // same as img2 but rotated.
```


## shader layers

```



```

