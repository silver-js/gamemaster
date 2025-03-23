# Module still in development / design, not yet usable.





# gfx.js | gfx_min.js

This module manages the game graphics.
Base Canvas size is 640x360, but you can set a multiplier to make it 720p, 1080p and so on.


## Concept:

With this module you can manage multiple image layers, you can also apply shaders to individual layers, then make a pipeline to draw them all on the main canvas.
2d image layers will be labeled iBuffer, and shaders will be labeled as sBuffer.



## Usage:

```
import gfx from './gfx_min.js';  

const myLayer1 = gfx.iBuffer();
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

