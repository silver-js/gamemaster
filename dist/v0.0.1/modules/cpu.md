# cpu.js | cpu_min.js

This module manages the game loops, there are only a few options and functions.

## Usage:

```
import cpu from './cpu_min.js';

cpu.setFps(60);     // sets how many draw calls per second, default is 30.
cpu.setClock(60);   // sets how many update calls per second, default is 30.

cpu.draw = ()=>{
  /*
    Here goes your draw call.
  */
}
cpu.update = ()=>{
  /*
    here goes your update call.
  */
}
```
