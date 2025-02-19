# Ctrl Module

## usage:
```
import {_pad, _padUpdate, _padCfg} from './ctrl_min.js';


```

## how it works:
  * _pad is an array with virtual pads from 0 to 4.
  * each virtual pad is an object with 4 axis and 8 buttons.
  * _pad[0] is for touch/mouse controls.
  * touch controls work with different areas that you can define and toggle.
  * _pad[1] to _pad[4] is for standard controls, can be keyboard or gamepad.
  * Gamepads connect automatically to the first available pad, to switch between pads just press start + select.

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
      _padCfg.pointerTarget(canv);    // set the element that recieves pointer interactions.

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

  * kb methods:
    ```
      _padCfg.getKbMap();  // returns keyboard mappings.

      _padCfg.kbAdd(                        // adds new key mappings
        {key: 'KeyG', map: [2, 'btn', 2]},
        {key: 'KeyP', map: [2, 'btn', 1]}
      );

      _padCfg.kbRemove('Space', 'Tab');   // removes key mappings
    ```
