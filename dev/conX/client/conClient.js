const start = (url)=>{
	return new Promise((res)=>{
		let done = false;
		try{
			const ws = new WebSocket(`ws://${url ? url : location.host}`);
			
			ws.addEventListener('open', ()=>{
				done = true
				res(ws);
			});
		}
		catch(err){
			console.log(err);
			done = true;
			res(false);
		}
		setTimeout(()=>{
			if(!done) console.log('timed out');
			res(false)
		}, 5000);
	})
}

export const conClient = {
	start
}
