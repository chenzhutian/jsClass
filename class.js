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

Object.defineProperty(BaseClass,"__constructor__",{
	configurable:false,
	writable:true,
	enumerable:true,
	value:function(){
		this.__objID__ = this.__GenID__();
	}
});

Object.defineProperty(BaseClass,"internalPrototype",{
	configurable:false,
	writable:false,
	enumerable:true,
	value:{}
});

(function(){
	var objID = -1;
	Object.defineProperty(BaseClass.internalPrototype,"__GenID__",{
		configurable:false,
		writable:false,
		value:function(){
			return ++objID;
		},
		enumerable:false
	});
})();

Object.defineProperty(BaseClass,"isClass",{
	configurable:false,
	writable:false,
	enumerable:true,
	value:true
});


//Class(className,classContent)
//Class(className,superClass,classContent)
function Class() {
	var mapToInternalReference = {};
	
	var className = arguments[0];
	var classContents = arguments[arguments.length - 1];
	
	var superClass = arguments[1].__isClass__ ? arguments[1] : BaseClass;
	var ctor = classContents.hasOwnProperty("constructor") ? classContents["constructor"] : function(){};
	delete classContents["constructor"];
		
	var newClassType = (new Function("GenClass","return function " + className + "(){return GenClass.apply(arguments.callee,arguments);}"))(GenClass);		

	newClassType.prototype = Object.create(superClass.prototype);
	newClassType.prototype.constructor = newClassType;
	newClassType.prototype.className = className;
		
	var directAttributeMember = {};
	var directFunctionMember = {};
	var flattenFunctionMember = {};
	var flattenAttributeMember = {};
	var internalPrototype = Object.create(superClass.internalPrototype);
	
	for(var p in superClass.flattenAttributeMember){
		flattenAttributeMember[p] = superClass.flattenAttributeMember[p];
	}
	for(var p in superClass.flattenFunctionMember){
		flattenFunctionMember[p] = superClass.flattenFunctionMember[p];
	}
	
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
				flattenFunctionMember[p] = classContents[p];
				Object.defineProperty(internalPrototype,p,{
					value:classContents[p].value,
					enumerable:true,
					writable:false,
					configurable:false
				});
			}else{
				directAttributeMember[p] = classContents[p];
				flattenAttributeMember[p] = classContents[p];
			}

		}
	}
	
	Object.defineProperty(newClassType,"directAttributeMember",{
		value:directAttributeMember,
		writable:false,
		enumerable:false,
		configurable:false
	});
	Object.defineProperty(newClassType,"directFunctionMember",{
		value:directFunctionMember,
		writable:false,
		enumerable:false,
		configurable:false
	});
	Object.defineProperty(newClassType,"flattenAttributeMember",{
		value:flattenAttributeMember,
		writable:false,
		enumerable:false,
		configurable:false
	});
	Object.defineProperty(newClassType,"flattenFunctionMember",{
		value:flattenFunctionMember,
		writable:false,
		enumerable:false,
		configurable:false
	});
	Object.defineProperty(newClassType,"internalPrototype",{
		value:internalPrototype,
		writable:false,
		enumerable:false,
		configurable:false
	});
	Object.defineProperty(newClassType,"__constructor__",{
		configurable:false,
		writable:true,
		enumerable:false,
		value:function(){
			superClass.__constructor__.apply(this,arguments);
			ctor.apply(this,arguments);
		}
	});
	Object.defineProperty(newClassType,"__isClass__",{
		configurable:false,
		writable:false,
		enumerable:false,
		value:true
	});
	

	for (var funcName in directFunctionMember) {
		CopyReferenceFunctionMemberOnPrototype(newClassType.prototype, funcName, directFunctionMember, false);
	}

	function CopyReferenceFunctionMemberOnPrototype(target, memberName, members, isInternalObj) {
		if (members[memberName] instanceof PublicMember) {
			Object.defineProperty(target, memberName, {
				writable: false,
				configurable: true,
				enumerable: true,
				value: function () {
					return members[memberName].value.apply(mapToInternalReference[this.__objID__], arguments);
				}
			});
		}
	}

	//this === newClassType
	function GenClass() {
		var externalObj = Object.create(this.prototype);
		var internalObj = Object.create(this.internalPrototype);
		var flattenAttributeMember = this.flattenAttributeMember;
		//var directFunctionMember = this.directFunctionMember;
		
		for(var p in flattenAttributeMember){
			Object.defineProperty(internalObj,p,{
				writable:true,
				configurable:false,
				enumerable:true,
				value:flattenAttributeMember[p].value
			});
			
			if(flattenAttributeMember[p] instanceof PublicMember){
				Object.defineProperty(externalObj,p,{
					writable:true,
					configurable:false,
					enumerable:true,
					value:flattenAttributeMember[p].value
				});
			}
		}
		
		this.__constructor__.apply(internalObj,arguments);
		//superClass.apply(internalObj,arguments);
		//ctor.apply(internalObj,arguments);
		
		Object.defineProperty(externalObj,"__objID__",{
			configurable:false,
			enumerable:false,
			get:function(){
				return internalObj.__objID__;
			}
		});
		
		externalObj.internalObj = internalObj;
		Object.seal(internalObj);
		Object.seal(externalObj);
		mapToInternalReference[externalObj.__objID__] = internalObj;
		return externalObj;
	}
	
	Object.seal(newClassType)
	return newClassType;
}

var A = Class("A",{
			constructor:function(privateName){
				this.ChildOfA = true;
				//this.privaMember = privateName;
			},
			member:1,
			privaMember:Private(0),
			staticMember:Static(2),
			doSomething: Public(function (){this.privDo();console.log(this.privaMember); }),
			privDo:Private(function(){console.log("it is Private"); this.privaMember = this.privaMember === 0 ? Math.random() * 10 : this.privaMember;})
		});
		
var B = Class("B",A,{
	constructor:function(b){
		this.childOfB = b;	
	},
	childMember:2,
	dododo:function(){this.privateDo();},
	privateDo:Private(function(){console.log("Let's dodododododo");})
});

var C = Class("C",B,{});

var a1 = new A("a1");
a1.doSomething();
//delete a1.ClassName;
//console.log(a1.ClassName);
var b = new B("bbbbbbbbb");
b.dododo();
//console.log(b.ClassName);
var a2 = new A("a2");
//console.log(a2.ClassName);
a2.member = 3;
a2.doSomething();
a1.doSomething();

console.log(a1.doSomething === a2.doSomething);
console.log(a1.doSomething === b.dododo);
// var c = new C("cccccccc");
// c.dododo();
// console.log(c.ClassName);

//console.log(a1.ClassName === b.ClassName);
console.log("stop");