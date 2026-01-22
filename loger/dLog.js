export const dLog = (item)=>{
    if(typeof(item)=='object'){
        if(Array.isArray(item)){
            console.log('------array-------');
            console.log(item);
            console.log('------------------');
        }else{
            console.log('------object-------');
            for(let key in item){
                console.log(key,item[key]);
            }
            console.log('-------------------');
        }
    }else{
        console.log(item);
    }
}


