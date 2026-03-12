// new approach: just make a unique array with keyFace and type
let lastLayout;
let mayus;
const rawLayout = [
	'Back,3,,3,<-,2,->,2',
	'1,1,2,1,3,1,4,1,5,1,6,1,7,1,8,1,9,1,0,1',
	'.,1,+,1,-,1,*,1,/,1,=,1,.,1,(,1,),1,%,1',
	"@,1,?,1,!,1,:,1,;,1,',1,$,1,Del,3",
	'&,1,#,1, ,6,OK,2',
	'123,3,qwerty,3,<-,2,->,2',
	'a,1,b,1,c,1,d,1,e,1,f,1,g,1,h,1,i,1,j,1',
	'k,1,l,1,m,1,n,1,o,1,p,1,q,1,r,1,s,1,_,1',
	't,1,u,1,v,1,w,1,x,1,y,1,z,1,Del,3',
	' ⬆ ,2, ,6,OK,2',
	'123,3,abc,3,<-,2,->,2',
	'q,1,w,1,e,1,r,1,t,1,y,1,u,1,i,1,o,1,p,1',
	'a,1,s,1,d,1,f,1,g,1,h,1,j,1,k,1,l,1,_,1',
	'z,1,x,1,c,1,v,1,b,1,n,1,m,1,Del,3',
	' ⬆ ,2, ,6,OK,2',
];

const layout = rawLayout.map(row=>{
	const keyRow = row.split(',');
	const mapRow = [];
	for(let i = 0; i < keyRow.length; i+=2){
		for(let r = 0; r < keyRow[i + 1]; r++){
			mapRow.push(keyRow[i]);
		}
	}
	return [keyRow, mapRow];
});

let mode = 10;

const setLayout = (x)=>{
	mode = x * 5;
}

const getKey = (x,y)=>{
	if(y < 0 || y > 5) return;
	const row = layout[mode + y];
	const key = row[1][x];
	if(!key) return;
	console.log(key)
	if(key.length == 1) return mayus ? key.toUpperCase() : key;
	switch(key){
		case '123':
			lastLayout = mode / 5;
			setLayout(0);
			break;
		case 'Back':
			setLayout(lastLayout);
			break;
		case 'abc':
			setLayout(1);
			break;
		case 'qwerty':
			setLayout(2);
			break;
		case ' ⬆ ':
			mayus = !mayus;
			break;
		default:
			return key;
		break;
		return;
	}
	
	/*
		if(!layout[y][x]) return;
		const match = layout[y][x].split(',');
		console.log(match)
		switch(match[1]){
			case 'mojljde':
				setLayout(match[0])
				return ''
				break;
			default:
				return match[0];
				break;
		}
		*/
		return ''
}

const osk = {
	setLayout,
	getKey,
	draw: (fun)=>{
		for(let y = 0; y < 5; y++){
			let offsetX = 0;
			const row = layout[mode + y][0];
			for(let x = 0; x < row.length; x+=2){
				const k = mayus ? row[x].toUpperCase() : row[x];
				const w = Number(row[x + 1]);
				fun(k, offsetX, y, w);
				offsetX += w;
			}
		}
	}
};
export default osk;


// 