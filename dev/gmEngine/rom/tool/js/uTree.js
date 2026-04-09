function Branch(element){
	this.dom = element;
	let styleBranch = null;
	let scopeStyleBranch = null;
	let id = null;
	
	this.txt = (t)=>{
		this.dom.innerText = t;
	}
	this.html = (h)=>{
		this.dom.innerHTML = h;
	}
	this.style = (s)=>{
		if(!id){
			id = 'uT-' + String(Math.random()).slice(2);
			this.classAdd(id);
		}
		if(!styleBranch){
			styleBranch = branch('style');
			this.add(styleBranch);
		}
		styleBranch.html(`.${id}{${s}}`);
	}
	this.scopedStyle = (s)=>{
		if(!id){
			id = 'uT-' + String(Math.random()).slice(2);
			this.classAdd(id);
		}
		if(!scopeStyleBranch){
			scopeStyleBranch = branch('style');
			this.add(scopeStyleBranch);
		}
		scopeStyleBranch.html(`@scope (.${id}){${s}}`);
	}
	this.classAdd = (c)=>{
		const arr = c.split(' ');
		arr.forEach(a=>{this.dom.classList.add(a)});
	}
	this.classRemove = (c)=>{
		const arr = c.split(' ');
		arr.forEach(a=>{this.dom.classList.remove(a)});
	}
	this.add = (x)=>{
		this.dom.appendChild(x.dom);
		return x;
	}
  this.remove = (x)=>{
		this.dom.removeChild(x.dom);
		return x;
  }
	this.clear = ()=>{
		this.dom.innerHTML = '';
		if(styleBranch) this.add(styleBranch);
		if(scopeStyleBranch) this.add(scopeStyleBranch);
	}
}

export const branch = (name, options)=>{
	const myBranch = new Branch(
		document.createElement(name)
	);
	for(let key in options){
		if(myBranch[key]){
			myBranch[key](options[key]);
		}else{
			myBranch.dom[key] = options[key];
		}
	}
	return myBranch;
}

export const router = (routes)=>{
	const currentPath = location.pathname;
	for(let path in routes){
		const  rx = new RegExp(`^${path.replace('*', '.*')}\/?$`, 'i')
		if(currentPath.search(rx) >= 0) return routes[path]();
	}
	return branch('div');
};

export const trunk = new Branch(document.body);
