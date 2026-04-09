import resLoader from './resLoader.js';
const info = document.getElementById('info');

resLoader.onLoad = (data)=>{
	info.innerText = JSON.stringify(data);
}
const resLoaderData = resLoader.load('./res.json?a=100');
const int = setInterval(()=>{
	if(!resLoaderData.data){
	console.log(resLoaderData.progress)
	}
})