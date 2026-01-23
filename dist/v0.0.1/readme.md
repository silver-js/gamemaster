# GM Engine

- this is the full game engine in one file, it handles the update and draw loops, the controllers, and the graphics.  

## Usage:

### import:

```
import {_loop, _pad, _cfg, _gfx} from './gmEngine.js';
```


### _loop:

- The loop object contains two empty functions, 'update' is for handling the game logic, it runs a fixed amount of times per second, and 'draw' is for handling graphics, it can skip frames if needed to mantain a stable pace.  
- The update and draw functions refresh rate can be configured with the '_cfg' element.  

```
_loop.update = ()=>{
  // here goes the game logic


  ////////////////////////////
}

_loop.draw = ()=>{
  // here you draw the game


  /////////////////////////
}

_cfg.setClock(60);    // sets the game logic to 60 updates per second.

_cfg.setFps(60);      // sets the draw function to a max 60fps.
```


### _pad:

- _pad is a simplistick virtual gamepad array.  
- _pad[0] is for mouse and touch controls.  
- _pad[1 to 4] are for keyboard and joystick controls.  
- each _pad element consists of 4 axis and 8 buttons, each axis goes from -1 to 1, and each button is either 0 or 255;  
- gamepads can switch to the next unused _pad by pressing start+select(buttons 6 and 7).  
- mouse and touch support is enabled by adding the target area element from the _cfg element:  
```
_cfg.pointerTarget(<DOM element>);
```
- touch buttons and gestures can be also added from the _cfg element, examples:  
```
_cfg.tpAdd(-1,-.5,.8,.5,'btn',4);   // (x_position, y_position, width, height, area_type, mapping, extra_action)

_cfg.tpRemove(-1,-.5);

_cfg.tpAdd(-1,0,1,1,'stick',[0,1],4);

_cfg.tpAdd(0,0,1,1,'swipe',[0,1,2,-1],5);

```

- area types:  
  * button areas are simple, touch them and you press a button.  
  * stick areas are for axis controls, you just give an array with h_axis and v_axis like on the example, the extra action is for tap, you can add an extra button action when taping on this area.  
  * swipe actions can activate buttons on every direction swipe, also an extra action for tap if you want.  

- area remove, if needed you can also remove areas with their x,y coordinates like in the example.

- another feature is pointerLock, if pointerLock is active, you can handle games that require a locked mouse pointer, and also works with touch controls:
```
_cfg.pointerLock(<boolean>);

```

- keyboard configuration is also handled with the _cfg element:

```
_cfg.kbAdd({key: 'KeyY', map: [2, 'btn', 3]});
_cfg.kbRemove('KeyW','KeyJ');
console.log(_cfg.getKbMap());
```


### _gfx:  

This object manages the game graphics.
Base Canvas size is 640x360, but you can set a multiplier to make it 720p, 1080p and so on.
This module renders sprites and fonts directly from the gpu for better performance

- _gfx works mainly on webgl2, this means it needs a little more setup than a normal 2d canvas element, but it is much much faster  


- importing module:
```
import _gfx from './gfx_min.js';
```

- setup:
```
_gfx.res(2);        // res scale multiplayer, (640 * m) x (360 * m), up to m = 6 (3840x2160)
_gfx.motionBlur(x); // sets the motion blur value from 1 to 0, where 1 is "no motion blur".

```

- fonts:
  + _gfx comes with 3 preloaded fonts ("sans-serif" 0, "times-new-roman" 1, "couerier-new" 2)  
  + if you want to use another font, you need to load it on the html,  
    when it's loaded call the localFont function and select an id for your font.  
  + you can have up to 4 fonts, from 0 to 3.


```
_gfx.localFont(1, "myFont");

```

- atlas:  
  + similar to fonts, you can load texture atlases with the function loadAtlas.
  + loadAtlas accepts url, preferably datauri.  
  + you can have up to 4 atlases, from 0 to 3.  

```
_gfx.loadAtlas(0, my_atlas_url, tile_size_in_px);
```


- rendering  
  + when drawing, you are actually building a list of textured polygons, 
  + and at the end of your draw loop you render them all at once with the draw() method.


```
_gfx.color(r,g,b,a);    // sets colors, values from 0 to 255;
_gfx.lineWidth(x);      // sets the line width;
_gfx.font(id);          // sets the active font;
```


- drawing functions:

```
_gfx.lines(x1,y1, x2,y2, x3, y3....);   // lets you draw a line with as many points as you want
_gfx.rect(
  x, y, w, h,
  sX, sY,         // optional, rotation angles
  scaleX, scaleY  // optional, vertical and horizontal stretching
);
_gfx.text(
  txt, x, y,
  w, h, sX, sY, scaleX  // optional
);
_gfx.spr(
  aId, iId,               // atlasId, spriteId
  x, y,
  w, h,                   // optional, default 32x
  sX, sY, scaleX, scaleY  // optional
);

draw();                   // renders all sprites, try to call it once per frame.
```
```
