# Resource Loader!  
### A simple json resource loader module for js  

### How to use(example):  

```
import resLoader from './resLoader.js';

const gameData = resLoader.load('./res.json', data =>{
	// this function will trigger after data is fully loaded
});
```

- resLoader.load() will return an object with some properties:  
	- .progress		// will store the load progress value, from 1 to 100.  
	- .data:			// will be null, then will be filled with the parsed json.  
	- .sprite