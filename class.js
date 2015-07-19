/*
class(stirng name,{
	constructor:function(),
	member:object,
	method:function		
})
*/
//public | protected | private
//static
//extend

function BaseClass(className) {
	this.className = className;
}

BaseClass.prototype.GetClassName = function(){
	return this.className;
}

//Class(className,classContent)
//Class(className,superClass,classContent)
function Class() {
	var className = arguments[0];
	var argsLength = arguments.length;
	var classContents = arguments[argsLength - 1];
	var superClass;

	var newClass =  function aNewClass() {
		BaseClass.call(this,className);

	}
	
	if(argsLength === 3){
		superClass = arguments[1];
		for(var property in superClass){
			if(superClass.hasOwnProperty(property)){
				newClass[property] = superClass[property];
			}
		}
		newClass.prototype = Object.create(superClass.prototype);
	}else{
		newClass.prototype = Object.create(BaseClass.prototype);
	}
	newClass.prototype.constructor = newClass;
	
	for(var p in classContents){
		Object.defineProperty(newClass.prototype,p, {
			value:classContents[p],
		    enumerable: true
		});
	}
	
	return newClass;
}

var A = Class("A",{
			member:1,
			doSomething: function (){console.log(this.GetClassName()+" it is a function");}
		});
var a1 = new A();
a1.doSomething();
console.log(a1.GetClassName());

var B = Class("B",A,{});
var b = new B();
b.doSomething();
console.log(b.GetClassName());

var a2 = new A();
console.log(a2.GetClassName());

console.log(a1.GetClassName === b.GetClassName);
console.log(a1.doSomething === a2.doSomething);
console.log("stop");