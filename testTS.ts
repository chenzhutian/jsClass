class A{
	private member1:string;
	public member2:number;
	static mmmmmmmmmmm:string = "static";
	
	constructor(a:string,b:number){
		this.member1 = a;
		this.member2 = b;
	}
	
	public Dosomething(){
		console.log(this.member1);
		this.Doanotherthing();
	}
	
	private Doanotherthing(){
		console.log(this.member2);
	}
}

class B extends A{
	private myMember1:string;
	public myMember2:number;
	
	constructor(a:string,b:number){
		super(a,b);
		this.myMember1 = a;
		this.myMember2 = b;
	}
	
	public dododo(){
		console.log(this.member2+this.myMember1+this.myMember2);
	}
}

var a:A = new A("aaa",111);
a.Dosomething();

var b:B = new B("bbb",222);
b.dododo();