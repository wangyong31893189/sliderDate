define(function(require, exports, module) {
	var Calender=require("./calender");
	var cal=new Calender({"id":"calender","format":"yyyy-MM-dd hh:mm:ss q S 星期w","showStyle":"yMd","position":"top","currentDay":function(data,obj){
		var date=document.getElementById("date");
		if(date)
		{
			date.innerHTML=data;
		}
		//alert(obj.innerHTML);
	},"nextDay":function(data,obj){
		var date=document.getElementById("next");
		if(date)
		{
			date.innerHTML=data;
		}
		//alert(obj.innerHTML);
	},"prevDay":function(data,obj){
		var date=document.getElementById("prev");
		if(date)
		{
			date.innerHTML=data;
		}
		//alert(obj.innerHTML);
	}});
	
	var date=document.getElementById("date");
	if(date){
		date.onclick=function(){
			resetParams();
			cal.init();		
			cal.show();
		};
	}
	
	function $(id){
		
		return document.getElementById(id)?document.getElementById(id).value:"";
	}
	
	function resetParams(){
		var weekName=$("weekName");
		if(weekName){
			cal.options.weekName=weekName;
		}
		var style=$("style");
		if(style){
			cal.options.style=style;
		}
		var max=$("max");
		if(max){
			cal.options.max=max;
		}
		var maxYear=$("maxYear");
		if(maxYear){
			cal.options.maxYear=maxYear;
		}
		var minYear=$("minYear");
		if(minYear){
			cal.options.minYear=minYear;
		}
		var min=$("min");
		if(min){
			cal.options.min=min;
		}		
		var btnName=$("btnName");
		if(btnName){
			cal.options.btnName=btnName;
		}
		var format=$("format");
		if(format){
			cal.options.format=format;
		}
		var showStyle=$("showStyle");
		if(showStyle){
			cal.options.showStyle=showStyle;
		}
		var animateTime=$("animateTime");
		if(animateTime){
			cal.options.animateTime=animateTime;
		}
		var position=$("position");
		if(position){
			cal.options.position=position;
		}
		var unitArr=$("unitArr");
		if(unitArr){
			unitArr=unitArr.split(",");
			cal.options.unitArr=unitArr;		
		}
		var weekArr=$("weekArr");
		if(weekArr){
			weekArr=weekArr.split(",");
			cal.options.weekArr=weekArr;
		}
		var year=$("year");
		if(year){
			cal.options.year=year;
		}
		var month=$("month");
		if(month){
			cal.options.month=month;
		}
		var day=$("day");
		if(day){
			cal.options.day=day;
		}
		var hour=$("hour");
		if(hour){
			cal.options.hour=hour;
		}
		var minitus=$("minitus");
		if(minitus){
			cal.options.minitus=minitus;
		}
		var seconds=$("seconds");
		if(seconds){
			cal.options.seconds=seconds;
		}
	}
	window.cal=cal;
});