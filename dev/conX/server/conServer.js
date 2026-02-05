import express from 'express';
import {WebSocketServer} from 'ws';
import http from 'http';

// helpers
const clients = new Map();
const newUUID = ()=>{
	let uuid;
	do{
		uuid = Math.random().toString().slice(2);
	}while(clients.get(uuid))
	return uuid;
}

// WebSocket
const wsConnection = (socket, req)=>{
	const uuid = newUUID();
	clients.set(uuid, {socket});
	conServer.onEnter(uuid);
	
	socket.on('close', ()=>{
		conServer.onExit(uuid);
		clients.delete(uuid);
	});
	socket.on('message', (data)=>{
		conServer.onMsg(uuid, data);
	});
}
const wsServer = new WebSocketServer({
	noServer: true
});
wsServer.on('connection', wsConnection);

// public files
const app = express();
app.use(express.static('public'));
app.get('/*nomatch', (req,res)=>{
  res.redirect('/');
});

export const conServer = {
	getClients: ()=> clients,
	onEnter: ()=>{},
	onExit: ()=>{},
	onMsg: ()=>{},
	start: (port)=>{
		app.set('port', port);
		const server = http.createServer(app);
		server.on('listening', ()=>{
			console.log(`Server listening on port ${port}...`);
		});
		server.on('upgrade', (req, socket, head)=>{
			wsServer.handleUpgrade(req, socket, head, (webSocket)=>{
				wsServer.emit("connection", webSocket, req)
			});
		});
		server.listen(port);
	}
}