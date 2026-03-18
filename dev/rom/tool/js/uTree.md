# uTree  

_You don't need to reinvent the wheel._  
- silver before proceding to reinvent the wheel.  

```
                        BRANCH(h1)
                          /    
												/       BRANCH(nav)  
									BRANCH(header) /  
	BRANCH(main)	T /  
							\	R	 BRANCH(footer)  
								U /  
								N  
								K  
							(body)
```

## How to:

```
import {trunk, branch} from './uTree.js';

const header = branch(`header`);
header.add(branch('h1', {txt: 'Hello World'}));
trunk.add(header);

```

## creating a branch  

```
const myBranch = branch('div', {txt: 'hello world'});
```  
'branch()' returns a new branch element, with an element of the designated type.  
second parameter is optional, you can set all branch parameters on one call.
the options uses the same properties as the branch methods.

## Branch methods  

```
myBranch.style(`color:red;`);
```  
style lets you set the style for the branch, acts similar to an inline style but can take meia queries.  

next ones are very self-explanatory
```
myBranch.scopedStyle(`
	p{
		background: grey;
	}
`);

myBranch.txt('this is some text');

myBranch.html(`
	<h3>something important</h3>
	<p>i forgot...</p>`
);

myBranch.classAdd('green-bg font-b');

myBranch.classRemove('font-b');

myBranch.add(anotherBranch);

myBranch.remove(anotherBranch);

myBranch.clear();
```  

## Router  

```
const myRoutes = router({
	route1: ()=> branchA,
	route2: ()=> branchB,
});
myBranch.add(myRoutes);
```  