var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var A = (function () {
    function A(a, b) {
        this.member1 = a;
        this.member2 = b;
    }
    A.prototype.Dosomething = function () {
        console.log(this.member1);
        this.Doanotherthing();
    };
    A.prototype.Doanotherthing = function () {
        console.log(this.member2);
    };
    A.mmmmmmmmmmm = "static";
    return A;
})();
var B = (function (_super) {
    __extends(B, _super);
    function B(a, b, c) {
        _super.call(this, a, b);
        this.myMember1 = a;
        this.myMember2 = b;
    }
    B.prototype.dododo = function () {
        console.log(this.member2 + this.myMember1 + this.myMember2);
    };
    return B;
})(A);
var a = new A("aaa", 111);
a.Dosomething();
var b = new B("bbb", 222);
b.dododo();
