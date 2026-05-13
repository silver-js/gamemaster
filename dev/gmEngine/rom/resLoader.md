# Resource Loader!  
### A simple json resource loader module for js  

### How to use(example):  

#### JSON file structure

```  
{
  graphics:[
  	{
  		type: 'spr',
  		id: 'tiles',
  		width: 16,
  		height: 16,
  		margin: 0,
  		offset: 0,
  		data: '<base64imgData_a>'
  	},
  	{
  		type: 'img',
  		id: 'background',
  		data: '<base64imgData_b>'
  	}
  ],
  "map":[
    <mapData_a>,
    <mapData_b>,
    <mapData_c>,
    <mapData_d>
  ],
  "mp3":[
    <base64snd_a>,
    <base64snd_b>,
    <base64snd_c>
  ],
  "midi":[
    <midi_a>,
    <midi_b>,
    <midi_c>
  ],
  "misc":[
    <randomData_a>,
    <randomData_b>,
    <randomData_c>,
    <randomData_d>
  ]
}
```  

#### Returned data  

```
{
  img:[imgA, imgB, imgC],
  map:[mapA, mapB, mapC, mapD],
  mp3:[sndA, sndB, sndC],
  midi:[tuneA, tuneB, tuneC],
  misc:[dataA, dataB, dataC, dataD]
}
```
```
```

```

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

