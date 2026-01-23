# gamemaster
Simple vanilla javascript game engine

## introduction:  
This project consists on a simple and modular javascript library, aimed to ease HTML5 game development.  

### how to use:  
* Refer to the [dev](https://github.com/silver-js/gamemaster/tree/main/dev) folder if you want to check or use modules independently.  
* Refer to the [dist](https://github.com/silver-js/gamemaster/tree/main/dist) folder for the standard and min versions.  
* Refer to the [template](https://github.com/silver-js/gamemaster/tree/main/template) folder for a reference empty project.  


### what does each module does?:
+ This library is made by diferent modules that you can use on any other web based application.  
+ Each module has its own readme file with very simplified examples.  
+ Each module also has some type of simple demo script.  

- [cpu](https://github.com/silver-js/gamemaster/tree/main/dev/cpu) is a simple game loop handler.  
- [ctrl](https://github.com/silver-js/gamemaster/tree/main/dev/ctrl) is a controller manager, generates virtual gamepads that map to touches, mouse, keyboard or gamepads.  

- [gmCore](https://github.com/silver-js/gamemaster/tree/main/dev/gmCore) is the main module, is unifies cpu and ctrl modules.  

- [gfx](https://github.com/silver-js/gamemaster/tree/main/dev/gfx) is a graphics library, focused on sprites, uses webgl2 to draw sprites, way way faster than 2d canvas.  


- [gmEditor](https://github.com/silver-js/gamemaster/tree/main/dev/gmEditor) is just a protoype of what a proper game engine using this library could look like, needs a TON of work(not recomended and buggy, work in progress).  


- Broken/Unusable modules:  
  + pixics(gpu physics, on planning stage)  
  + sfx(placeholder for the sound library, empty script)  
  + network(placeholder for a websocket service for multiplayer, work in progress, comming soon)  
