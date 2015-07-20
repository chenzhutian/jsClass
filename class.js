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
	var superClass = BaseClass;

	var newClass =  new Function("superClass","className","return function " + className + "(){superClass.call(this,className);}")(superClass,className);
	
	//extends or not
	if(argsLength === 3){
		superClass = arguments[1];
		for(var property in superClass){
			if(superClass.hasOwnProperty(property)){
				newClass[property] = superClass[property];
			}
		}
	}
	newClass.prototype = Object.create(superClass.prototype);
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
			constructor:function(){},
			member:1,
			doSomething: function (){console.log(this.GetClassName()+" it is a function");}
		});

var B = Class("B",A,{
	childMember:2,
	dododo:function(){console.log("Let's dodododo")}
});

var C = Class("C",B,{});

var a1 = new A();
a1.doSomething();
console.log(a1.GetClassName());
var b = new B();
b.doSomething();
console.log(b.GetClassName());
var a2 = new A();
console.log(a2.GetClassName());
var c = new C();
c.dododo();

console.log(a1.GetClassName === b.GetClassName);
console.log(a1.doSomething === a2.doSomething);

console.log("stop");