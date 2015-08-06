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

function PrivateMember(value) {
	Member.call(this,value);
}
PrivateMember.prototype = Object.create(Member.prototype);
PrivateMember.prototype.constructor = PrivateMember;

function ProtectedMember(value) {
	Member.call(this,value);
}
ProtectedMember.prototype = Object.create(Member.prototype);
ProtectedMember.prototype.constructor = ProtectedMember;

function PublicMember(value) {
	Member.call(this,value);
}
PublicMember.prototype = Object.create(Member.prototype);
PublicMember.prototype.constructor = PublicMember;

function StaticMember(value) {
	Member.call(this,value);
}
StaticMember.prototype = Object.create(Member.prototype);
StaticMember.prototype.constroctor = StaticMember;

function Private(value) {
	var obj = new PrivateMember(value);
	return obj;
}

function Public(value) {
	var obj = new PublicMember(value);
	return obj;
}

function Protected(value) {
	var obj = new ProtectedMember(value);
	return obj;
}

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
	var classContents = arguments[arguments.length - 1];
	
	var superClass = arguments[1].isClass ? arguments[1] : BaseClass;
	var ctor = classContents.hasOwnProperty("constructor") ? classContents["constructor"] : function(){};
	delete classContents["constructor"];
		
	var newClassType = (new Function("GenClass","return function " + className + "(){return GenClass.apply(arguments.callee);}"))(GenClass);		

	// newClassType.prototype = Object.create(superClass.prototype);
	// newClassType.prototype.constructor = newClassType;
	newClassType.prototype.className = className;
	
	var directAttributeMember = {};
	var directFunctionMember = {};
	var internalPrototype = {};
	for(var p in classContents){
		if(!(classContents[p] instanceof Member)) classContents[p] = Public(classContents[p]);
		if(classContents[p] instanceof StaticMember){
			Object.defineProperty(newClassType,p,{
				value:classContents[p].value,
				enumerable:true,
				writable:false,
				configurable:false
			});
		}else{
			if(typeof classContents[p].value === "function"){
				directFunctionMember[p] = classContents[p];
				Object.defineProperty(internalPrototype,p,{
					value:classContents[p].value,
					enumerable:true,
					writable:false,
					configurable:false
				});
			}else{
				directAttributeMember[p] = classContents[p];
			}

		}
	}
	Object.defineProperty(newClassType,"directAttributeMember",{
		value:directAttributeMember,
		writable:false,
		enumerable:true,
		configurable:false
	});
	Object.defineProperty(newClassType,"directFunctionMember",{
		value:directFunctionMember,
		writable:false,
		enumerable:true,
		configurable:false
	});
	Object.defineProperty(newClassType,"internalPrototype",{
		value:internalPrototype,
		writable:false,
		enumerable:true,
		configurable:false
	});
	
	
	(function(directFunctionMember){
		for(var funcName in directFunctionMember){
			CopyReferenceMember(newClassType.prototype,internalPrototype,funcName,directFunctionMember,false);
		}
	})(directFunctionMember);



	function CopyReferenceMember(target,source,memberName,members,isInternalObj) {
		if(members[memberName] instanceof PublicMember){
			Object.defineProperty(target,memberName,{
				writable:false,
				configurable:true,
				enumerable:true,
				value:function(){
					return members[memberName].value.apply(source,arguments);
				}
			});
		}
	}

	//this === newClassType
	function GenClass() {
		var externalObj = Object.create(this.prototype);
		var internalObj = Object.create(this.internalPrototype);
		var directAttributeMember = this.directAttributeMember;
		var directFunctionMember = this.directFunctionMember;
		
		for(var p in directAttributeMember){
			Object.defineProperty(internalObj,p,{
				writable:true,
				configurable:false,
				enumerable:true,
				value:directAttributeMember[p].value
			});
			
			if(directAttributeMember[p] instanceof PublicMember){
				Object.defineProperty(externalObj,p,{
					writable:true,
					configurable:false,
					enumerable:true,
					value:directAttributeMember[p].value
				});
			}
		}
		
		externalObj.internalObj = internalObj;
		
		Object.seal(externalObj);
		return externalObj;
	}
	
	Object.seal(newClassType)
	return newClassType;
}

var A = Class("A",{
			constructor:function(){
				this.ChildOfA = true;
				console.log("param is "+arguments[0]);
			},
			member:1,
			privaMember:Private(2),
			staticMember:Static(2),
			doSomething: Public(function (){console.log(this.privaMember);this.privDo();}),
			privDo:Private(function(){console.log("it is Private");})
		});
		
var B = Class("B",{
	constructor:function(b){
		this.childOfB = b;	
	},
	childMember:2,
	dododo:function(){this.privateDo();},
	privateDo:Private(function(){console.log("Let's dodododododo");})
});

var C = Class("C",B,{});

var a1 = new A("asdfsafdsadf");
a1.doSomething();
//delete a1.ClassName;
console.log(a1.ClassName);
var b = new B("bbbbbbbbb");
b.dododo();
console.log(b.ClassName);
var a2 = new A("asdfsafd");
console.log(a2.ClassName);
a2.member = 3;
// var c = new C("cccccccc");
// c.dododo();
// console.log(c.ClassName);

console.log(a1.ClassName === b.ClassName);
console.log(a1.doSomething === a2.doSomething);
console.log("stop");