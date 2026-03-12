const fetcher = async (obj, url)=>{
	try{
		const res = await fetch(url);
		
		// content size
		let clWarn = false;
		let cl = res.headers.get('Content-Length');
		if(!cl) clWarn = 'Content-Length header missing';
		if(cl && cl.includes(',')){
			clWarn = 'Content-Length header has duplicate content';
			cl = cl.split(',')[0];
		}
		if(clWarn) console.warn(`Warning:\n${clWarn}...\nConsider checking your file serving configuration.`);
		const fileSize = cl ? Number(cl) : false;
		
		if(!fileSize){
			obj.progress = -1;
			const data = await res.json();
			romLoader.onLoad(data);
			obj.data = true;
		}else{
			const reader = res.body.getReader();
			const arrBuffer = new Uint8Array(fileSize);
			let readBytes = 0;
			while(true){
				const {done, value} = await reader.read();
				if(done){
					break;
				}else{
					arrBuffer.set(value, readBytes);
					readBytes += value.length; 
					obj.progress = readBytes / fileSize * 100
				}
			}
			const decoder = new TextDecoder('utf-8');
			const text = decoder.decode(arrBuffer);
			romLoader.onLoad(JSON.parse(text));
			obj.data = true;
		}
	}
	catch(err){
		console.error(err);
		obj.error = true;
	}
}

const load = (url)=>{
	const romObj = {
		progress: 0,
		data: false
	}
	fetcher(romObj, url);
	return romObj;
}
const romLoader = {
	load,
	onLoad: ()=>{}
}
export default romLoader;