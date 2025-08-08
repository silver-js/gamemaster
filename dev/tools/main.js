// module imports:
import cpu from './modules/cpu_min.js';

// img to data
const imgToDataInput = document.getElementById("img-to-data-input");
imgToDataInput.addEventListener('change', (e)=>{
	const reader = new FileReader();
	reader.addEventListener('load', ()=>{
		console.log(reader.result);
	}, false);
	reader.readAsDataURL(e.target.files[0]);
});











// game logic
cpu.update = ()=>{
  //console.log('eh');
}



cpu.draw = ()=>{
  //console.log('lol');
}
