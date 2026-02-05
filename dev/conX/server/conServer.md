how to use:

```
import {connection} from './modules/conServer.js';


const port = 3000;


const clients = conServer.getClients();


conServer.onEnter = (uuid)=>{
	console.log(uuid, 'joined!');
}

conServer.onExit = (uuid)=>{
	console.log(uuid, 'left uwu!');
}

conServer.onMsg = (uuid, msg)=>{
	console.log(`${uuid}: ${msg}`);
}

conServer.start(port);

```

And thats it, thats all functionality you need.

You can serve static files on 'public' folder.

When a client connects, it gets added to clients then it triggers the onEnter function

When a client disconnects, first it triggers the onExit function, then gets removed from clients automatically.
