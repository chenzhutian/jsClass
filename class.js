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

function Member(value) {
	this.value = value;
}

function StaticMember(value) {
	Member.call(this,value);
}
StaticMember.prototype = Object.create(Member.prototype);
StaticMember.prototype.constroctor = StaticMember;

function Static(value) {
	var obj = new StaticMember(value);
	return obj;
}

//BaseClass(className)
function BaseClass() {
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
	var superClass = argsLength === 3 ? arguments[1] : BaseClass;

	var newClass;
	if(classContents.hasOwnProperty("constructor")){
		newClass = (new Function("superClass","constructor","return function " + className + "(){superClass.apply(this,arguments); constructor.apply(this,arguments);}")(superClass,classContents["constructor"]));
		delete classContents["constructor"];
	} else {
		newClass = (new Function("superClass","return function " + className + "(){superClass.apply(this,arguments);}")(superClass));
	}
	
	//extends or not
	if(argsLength === 3){
		for(var property in superClass){
			if(superClass.hasOwnProperty(property)){
				newClass[property] = superClass[property];
			}
		}
	}
	newClass.prototype = Object.create(superClass.prototype);
	newClass.prototype.constructor = newClass;
	newClass.prototype.className = className;
	
	for(var p in classContents){
		if(classContents[p] instanceof StaticMember){
			Object.defineProperty(newClass,p,{
				value:classContents[p].value,
				enumerable:true
			});
		}else{
			Object.defineProperty(newClass.prototype,p, {
				value:classContents[p],
			    enumerable: true
			});
		}
	}
	
	return newClass;
}

var A = Class("A",{
			constructor:function(){
				this.ChildOfA = true;
				console.log("param is "+arguments[0]);
			},
			member:1,
			staticMember:Static(2),
			doSomething: function (){console.log(this.GetClassName()+" it is a function");}
		});
		
var B = Class("B",A,{
	constructor:function(){
		this.childOfB = true;	
	},
	childMember:2,
	dododo:function(){console.log("Let's dodododo")}
});

var C = Class("C",B,{});

var a1 = new A("asdfsafdsadf");
a1.doSomething();
console.log(a1.GetClassName());
var b = new B("bbbbbbbbb");
b.doSomething();
console.log(b.GetClassName());
var a2 = new A("asdfsafd");
console.log(a2.GetClassName());
var c = new C("cccccccc");
c.dododo();
console.log(c.GetClassName());

console.log(a1.GetClassName === b.GetClassName);
console.log(a1.doSomething === a2.doSomething);

console.log("stop");