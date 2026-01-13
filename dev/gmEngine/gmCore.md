# GM Core

- this is the main module, handles the update and draw loops, and the controllers.  

## Usage:

### import:

```
import {_loop, _pad, _cfg} from './gmCore_min.js';
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


toDo : visualization of touches