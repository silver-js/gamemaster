# loop.js | loop_min.js

This module manages the game loops, there are only a few options and functions.

## Usage:

```
import {_loop} from './loop_min.js';

_loop.setFps(60);     // sets how many draw calls per second, default is 30.
_loop.setClock(60);   // sets how many update calls per second, default is 30.

_loop.draw = ()=>{
  /*
    Here goes your draw call.
  */
}
_loop.update = ()=>{
  /*
    here goes your update call.
  */
}
```
