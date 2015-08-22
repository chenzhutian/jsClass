function UnitTest() {
	function Assert(code) {
		if (!code) throw new Error("A Error!");
	}
	
	var __passedCase = 0;
	var __failedCase = 0;
	var __emptyCase = 0;
	
	function TestCase(caseName, code) {
		console.log("Running test case "+caseName);
		try{
			code();
			__passedCase++;
			
		}catch (ex){
			if(ex.message == "__Empty Case__"){
				__emptyCase++;
			}else{
				__failedCase++;
				code();
			}
		}finally{
			
		}
	}
	
	function EmptyCase(){
		throw new Error("__Empty Case__");
	}
	
	function Summary(){
		
	}
	
	return {
		Assert:Assert,
		TestCase:TestCase,
		EmptyCase:EmptyCase,
		Summary:Summary
	}
}
