define(function(require, exports, module) {
	var HP=require("./../wap/js/source/plugs/lib/hpUtils");
	
	var storage=HP.getStorage().getStorage("cookie");
	
	storage.setItem("test","test");
	
	var value=storage.getItem("test");
	//alert(storage.getItem("test"));
	
	var test=document.getElementById("test");
	if(test){
		test.style.background="red";
		test.innerHTML="测试成功 ，key=test ,value="+value;
	}
});