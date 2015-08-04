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

Object.defineProperty(BaseClass.prototype,"className",{
	configurable:false,
	writable:true,
	value:"BaseClass",
	enumerable:true
});

Object.defineProperty(BaseClass,"isClass",{
	configurable:false,
	writable:false,
	enumerable:true,
	value:true
});

//Class(className,classContent)
//Class(className,superClass,classContent)
function Class() {
	var className = arguments[0];
	//var argsLength = arguments.length;
	var classContents = arguments[arguments.length - 1];
	var superClass = arguments[1].isClass ? arguments[1] : BaseClass;
	var ctor = classContents.hasOwnProperty("constructor") ? classContents["constructor"] : function(){};
	delete classContents["constructor"];
	
	
	var directAttributeMember = {};
	var directFunctionMember = {};
	function initclass() {
		for(var p in directAttributeMember){
			Object.defineProperty(this,p,{
				value:directAttributeMember[p],
				writable:true,
				configurable:false,
				enumerable:true
			});
		}
	}
	
	var newClassType = (function(){
		var private;
		var  newClass = (new Function("superClass","initclass","constructor","return function " + className + "(){superClass.apply(this,arguments); initclass.apply(this,arguments);constructor.apply(this,arguments); Object.seal(this);}"))(superClass,initclass,ctor);		
		
		Object.defineProperty(newClass,"isClass",{
			configurable:false,
			writable:false,
			enumerable:true,
			value:true
		});
		
		return newClass;
	})();
	
	//extends or not
	if(arguments[1] instanceof BaseClass){
		for(var property in superClass){
			if(superClass.hasOwnProperty(property)){
				newClassType[property] = superClass[property];
			}
		}
	}
	newClassType.prototype = Object.create(superClass.prototype);
	newClassType.prototype.constructor = newClassType;
	newClassType.prototype.className = className;
	
	for(var p in classContents){
		if(classContents[p] instanceof StaticMember){
			Object.defineProperty(newClassType,p,{
				value:classContents[p].value,
				enumerable:true,
				writable:false,
				configurable:false
			});
		}else{
			if(typeof classContents[p] === "function"){
				directFunctionMember[p] = classContents[p];
				Object.defineProperty(newClassType.prototype,p,{
					value:classContents[p].value,
					enumerable:true,
					writable:false,
					configurable:false
				});
			}else{
				directAttributeMember[p] = classContents[p];
				// Object.defineProperty(newClassType.prototype,p, {
				// 	//value:classContents[p],
				//     enumerable: true,
				// 	configurable:false,
				// 	get:function(){
				// 		return classContents[p];
				// 	},
				// 	set:function(value){
				// 		classContents[p] = value;
				// 	}
				// });
			}

		}
	}
	
	newClassType
	return Object.seal(newClassType);
}

var A = Class("A",{
			constructor:function(){
				this.ChildOfA = true;
				console.log("param is "+arguments[0]);
			},
			member:1,
			staticMember:Static(2),
			doSomething: function (){console.log(this.ClassName +" it is a function");}
		});
		
var B = Class("B",A,{
	constructor:function(b){
		this.childOfB = b;	
	},
	childMember:2,
	dododo:function(){console.log("Let's dodododo")}
});

var C = Class("C",B,{});

var a1 = new A("asdfsafdsadf");
//a1.doSomething();
delete a1.ClassName;
console.log(a1.ClassName);
var b = new B("bbbbbbbbb");
b.doSomething();
console.log(b.ClassName);
var a2 = new A("asdfsafd");
console.log(a2.ClassName);
a2.member = 3;
var c = new C("cccccccc");
c.dododo();
console.log(c.ClassName);

console.log(a1.ClassName === b.ClassName);
console.log(a1.doSomething === a2.doSomething);
console.log(a1['get ClassName']);
console.log("stop");