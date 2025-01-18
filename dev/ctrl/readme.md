# Module under development / design, not yet usable

## general controls:  

* each jX is a 4axis 8buttons

* j0 is for touch, mouse controls and fixed buttons that are expected to work, like "esc" to exit, and "enter" for start
* j1 to j4 is for standard controls, can be keyboard or gamepad

touch controls work with diferent areas that you can define and toggle.
usage:
-> j0
  * mouse:
      j0.btn(1) => left-click
      j0.btn(2) => right-click
      j0.btn(3) => middle-click

  * touch:
      j0.btn(4) => touchstart to touchend

  * touch methods:
      j0.setArea(
        x, y, radius, type, [mappings]
      );
      j0.removeArea(x,y);

  * touch/mouse shared:
      j0.btn(0) => click event;
      j0.axis(0-1) =>
        event position/movement
      j0.axis(3) =>  wheel/zoom-gesture

  * touch/mouse methods:
      j0.mode(0-1) =>
          0 track position
          1 track movement(mouse lock)

  * kb:
      j0.btn(5) => Tab
      j0.btn(6) => Enter
  
      - Esc to exit mouse lock

-> j1-j4
      jx.btn(0-7) => returns boolean
      jx.axis(0-3) => returns int8