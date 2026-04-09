# Ctrl Module  

## usage:  
```
import {_pad, _kb, _padUpdate, _padCfg} from './ctrl_min.js';

// instde the game loop:
_padUpdate();					snapshots the gamepad states, you need to call it once per game update
if(_pad[1].btn[2]){
	player.jump();
}
```

## how it works:  
  * _pad is an array with 5 virtual gamepads from 0 to 4.  
  * Each virtual gamepad is an object with 4 axis and 8 buttons.  
  
  ### _pad[0]
  * _pad[0] is for touch/mouse controls.
  * Touch controls work with different areas that you can define and toggle.

  ### Gamepads  
  * Gamepads connect automatically to the first available _pad[], from 1 to 4.  
  * To switch to next available _pad[], just press [start + select].  

  ### Keyboard  
  * Keyboard can switch modes dynamically to take user text inputs, or to work as game input:
  ```
  _kb.typeMode(true);                     // on typeMode you store key values to do config or take input

  const pressedKey =_kb.input();          // returns array with char and keycode ie ['e', 'KeyE']

  const currentCfg = _padCfg.getKbMap();  // returns keyboard mappings.
  
  _padCfg.setKbMap(<strinifiedMaps>)      // sets a full new mapping.

  _padCfg.kbAdd(                          // adds new key mappings
    {key: 'KeyG', map: [2, 'btn', 2]},
    {key: 'KeyP', map: [2, 'btn', 1]}
  );
  
  _padCfg.kbRemove('Space', 'Tab');       // removes key mappings, you can send an array of keys to do a cleanup
  ```

## general controls:  

usage:
-> pad[0]
  * mouse:
    ```
      _pad[0].btn[0]    // left-click
      _pad[0].btn[1]    // right-click
      _pad[0].btn[2]    // middle-click
    ```

  * touch:
    ```
      _pad[0].btn[3]    // touchstart to touchend
    ```

  * shared methods:
    ```
      _padCfg.pointerTarget(canv);    // set the DOM element that recieves pointer interactions.

      _padCfg.pointerLock(true);      // enables/disables pointerLock.
      
    ```
  * touch methods:
    ```
      _padCfg.tpAdd(  // adds a specific touch area to interact as a button or axis on _pad[0].
        -1, -1, 1, 1, // x, y, w, h, from -1, -1(top left) to 1, 1(bottom right).
        'btn',        // type, can be "swipe", "btn" or "stick".
        0,            // mapping, specify which button/axis interacts with this area.
        -1            // you can add a secondary button pulse for tapping action on any area.
      );
      
      _padCfg.tpRemove(-1,-1);        // removes a touch area, just needs x,y coordinates.

    ```

  * touch/mouse shared:
    ```
        _pad[0].axis[2] && _pad[0].axis[3]
        // if pointerLock, tracks movement, refreshes with _padUpdate().
        // if !pointerLock, tracks position.
    ```