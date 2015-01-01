define(function(require, exports, module) {

	function prefixStyle (style) {
	if ( vendor === '' ) return style;

	style = style.charAt(0).toUpperCase() + style.substr(1);
	return vendor + style;
}

var doc=document;
var m = Math,dummyStyle = doc.createElement('div').style,
	vendor = (function () {
		var vendors = 't,webkitT,MozT,msT,OT'.split(','),
			t,
			i = 0,
			l = vendors.length;

		for ( ; i < l; i++ ) {
			t = vendors[i] + 'ransform';
			if ( t in dummyStyle ) {
				return vendors[i].substr(0, vendors[i].length - 1);
			}
		}

		return false;
	})(),// Style properties
	cssVendor = vendor ? '-' + vendor.toLowerCase() + '-' : '',
	transform = prefixStyle('transform'),
	transitionProperty = prefixStyle('transitionProperty'),
	transitionDuration = prefixStyle('transitionDuration'),
	transformOrigin = prefixStyle('transformOrigin'),
	transitionTimingFunction = prefixStyle('transitionTimingFunction'),
	transitionDelay = prefixStyle('transitionDelay'),isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
			hasTouch = 'ontouchstart' in window && !isTouchPad,
			hasTransform = vendor !== false,
			hasTransitionEnd = prefixStyle('transition') in dummyStyle,

			RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize',
			START_EV = hasTouch ? 'touchstart' : 'mousedown',
			MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
			END_EV = hasTouch ? 'touchend' : 'mouseup',
			CANCEL_EV = hasTouch ? 'touchcancel' : 'touchcancel';
			TRNEND_EV = (function () {
				if ( vendor === false ){
					return false;
				}

				var transitionEnd = {
						''			: 'transitionend',
						'webkit'	: 'webkitTransitionEnd',
						'Moz'		: 'transitionend',
						'O'			: 'otransitionend',
						'ms'		: 'MSTransitionEnd'
					};

				return transitionEnd[vendor];
			})();
	var Calender=function(options){
		this.options={
			id:"calender",
			weekName:"",//星期前缀
			style:"default",//默认皮肤 现在就一套 1，2，3，4，5
			monthCount:3,//显示的月份数量
			height:50,//时间每行行高
			appType:"air",  //适用的应用类型
			oneByOne:true,//是否需要 一月一月的滚动  true为需要  false为不需要
			container:"window",  //外层容器   默认为整个窗口   其它则填写对应的ID
			max:20,//可以向后查看多少年
			maxYear:null,//可以向后查看到哪年  有值则忽略max
			min:20,//可以向前查看多少年
			minYear:null,//可以向前查看到哪年  有值则忽略min
			vScroll:true,//竖向
			btnName:"完成",//完成按钮名称
			headerName:"选择时间",//头部选择时间名称
			animateTime:500,//动画时间
			selectDay:function(index){ //选择日期
				console.log("选择日期成功！");
			},
			nextDay:function(){
				console.log("选择下一天成功！");
			},
			currentDay:function(){
				console.log("选择当天成功！");
			},
			prevDay:function(){
				console.log("选择上一天成功！");
			},
			format:"yyyy-MM-dd",
			showStyle:"yMdhms",
			position:"center",//默认为中间 top  center bottom
			unitArr:["年","月","日","时","分","秒"],//显示单位
			weekArr:["日","一","二","三","四","五","六"],//星期名称
			year:"",
			month:"",
			day:"",
			hour:"",
			minitus:"",
			seconds:""
		};		
		for(var i in options ){
			this.options[i]=options[i];
		}
	
		this.init();
	}
	
	var Pos=function (){
		this.x=0;
		this.y=0;
	};
	var startPos=new Pos();
	var movePos=new Pos();
	var endPos=new Pos();
	
	function getViewSizeWithoutScrollbar(){//不包含滚动条 
		return { 
		width : document.body.offsetWidth, 
		height: document.documentElement.clientHeight
		};
	} 
	function getViewSizeWithScrollbar(){//包含滚动条 
		if(window.innerWidth){ 
			return { 
				width : window.innerWidth, 
				height: window.innerHeight 
			};
		}else if(document.documentElement.offsetWidth == document.documentElement.clientWidth){ 
			return { 
			width : document.documentElement.offsetWidth, 
			height: document.documentElement.offsetHeight 
			};
		}else{ 
			return { 
				width : document.documentElement.clientWidth + getScrollWith(), 
				height: document.documentElement.clientHeight + getScrollWith() 
			};
		} 
	}
	
	Calender.prototype={
		$:function(id){
			return typeof(id)==="object"?id:document.getElementById(id);
		},
		init:function(){
			var that=this;
			var calender=that.calender=that.$(that.options.id);
			var calenderBg=that.calenderBg=that.$("cal_bg");
			var style=that.options.style;
			//加载皮肤样式
			seajs.use("./"+style+".css");
			style="";
			var btnName=this.options.btnName;
			if(!calender){
				var calenderHtml='';
				calender=that.calender=document.createElement("div");
				calender.setAttribute("id","calender");
				calender.setAttribute("class","calender"+style);
				calender.innerHTML='<div class="cal_btn">'+that.options.headerName+'<button class="cal_btn_finish'+style+'" id="cal_btn_finish">'+btnName+'</button></div><div class="calender_container'+style+'"><div class="cal_container'+style+'" id="cal_container"></div></div>';
				document.body.appendChild(calender);
			}
			if(!calenderBg){
				var calenderHtml='';
				calenderBg=that.calenderBg=document.createElement("div");
				calenderBg.setAttribute("id","cal_bg");
				calenderBg.setAttribute("class","cal_bg"+style);
				document.body.appendChild(calenderBg);
			}
			var unit=that.unit="width";
			var moveBy=that.moveBy="marginLeft";
			var moveStyleBy=that.moveStyleBy="margin-left";			
			if(that.options.vScroll){//竖向滚动
				unit=that.unit="heightt";
				moveBy=that.moveBy="marginTop";
				moveStyleBy=that.moveStyleBy="margin-top";
			}
			//var wh={width:0,height:0};
			/*if(that.options.container==="window"){
				wh=getViewSizeWithoutScrollbar();
			}else{
				var container=that.$(that.options.container);
				if(container){
					wh={width:container.offsetWidth,height:container.offsetHeight};
				}
			}
			if(that.options.hScroll&&!that.options.vScroll){//横向滚动 true 并且竖向滚动为false
				browserWidth=that.browserWidth=that.options.containerWidth;
				if(!browserWidth){
					browserWidth=that.browserWidth=wh.width;			
				}
			}else if(!that.options.hScroll&&that.options.vScroll){//横向滚动 false 并且竖向滚动为 true
				browserWidth=that.browserWidth=that.options.containerHeight;
				if(!browserWidth){
					browserWidth=that.browserWidth=wh.height;		
				}
			}else{
				console.error("对不起，滚动方向请重新设置！");
				slider.style.display="none";
				return false;
			}*/
			that.sliderType={"ease":"cubic-bezier(0.25, 0.1, 0.25, 1.0)","linear":"cubic-bezier(0.0, 0.0, 1.0, 1.0)","ease-in":"cubic-bezier(0.42, 0, 1.0, 1.0)","ease-out":"cubic-bezier(0, 0, 0.58, 1.0)",  "ease-in-out":"cubic-bezier(0.42, 0, 0.58, 1.0)"};
			that.sliderFunc=that.sliderType[that.options.scrollType];
			
			var calenderArr=[];			
			var showStyle=that.options.showStyle;
			var showStyles=showStyle.split("");
			for(var i=0,len=showStyles.length;i<len;i++){
				switch(showStyles[i]){
					case "y":
						calenderArr.push('<ul class="cal_year'+style+'" id="cal_year"></ul>');
						break;
					case "M":
						calenderArr.push('<ul class="cal_month'+style+'" id="cal_month"></ul>');
						break;
					case "d":
						calenderArr.push('<ul class="cal_day'+style+'" id="cal_day"></ul>');
						break;
					case "h":
						calenderArr.push('<ul class="cal_hour'+style+'" id="cal_hour"></ul>');
						break;
					case "m":
						calenderArr.push('<ul class="cal_minitus'+style+'" id="cal_minitus"></ul>');
						break;
					case "s":
						calenderArr.push('<ul class="cal_second'+style+'" id="cal_second"></ul>');
						break;
					default:
						break;				
				}
			}
			
			var cal_container=that.$("cal_container");
			cal_container.innerHTML=calenderArr.join("");

			that.reloadCalender(calender);
			that.bindCalenderEvent(calender);
		},show:function(){
			var that=this;
			that.calender.style.display="block";
			that.calenderBg.style.display="block";
			//that.reloadCalender(calender);
			//that.bindCalenderEvent(calender);
		},hide:function(){
			var that=this;
			that.calender.style.display="none";
			that.calenderBg.style.display="none";
		},dateFormat:function(format,date){ 
			var that=this;		
			var o = { 
				"M+" : date.getMonth()+1, //month 
				"d+" : date.getDate(), //day 
				"h+" : date.getHours(), //hour 
				"m+" : date.getMinutes(), //minute 
				"s+" : date.getSeconds(), //second 
				"q+" : Math.floor((date.getMonth()+3)/3), //quarter 
				"w+" : that.options.weekName+that.options.weekArr[date.getDay()], //quarter 
				"S" : date.getMilliseconds() //millisecond 
			};
			if(/(y+)/.test(format)){ 
				format = format.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length)); 
			} 
			for(var k in o) { 
				if(new RegExp("("+ k +")").test(format)) { 
					format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
				} 
			} 
			return format; 
		},
		reloadCalender:function(calender,year,month){//calender 日历对象  year 年份   month 月份  monthCount 显示的月份数量
			var that=this;		
			//calender.children[0].innerHTML="";
			var unit=that.unit;
			var unitArr=that.options.unitArr;
			var moveBy=that.moveBy;
			var date=new Date();
			if(that.year){
				date.setFullYear(that.year);
			}else{				
				if(that.options.year){
					date.setFullYear(that.options.year);
				}
			}
			if(that.month){
				date.setMonth(that.month-1);
			}else{	
				if(that.options.month){
					date.setMonth(that.options.month-1);
				}
			}
			if(that.day){
				date.setDate(that.day);
			}else{	
				if(that.options.day){
					date.setDate(that.options.day);
				}
			}
			if(that.hour){
				date.setHours(that.hour);
			}else{	
				if(that.options.hour){
					date.setHours(that.options.hour);
				}
			}
			if(that.minitus){
				date.setMinutes(that.minitus);
			}else{	
				if(that.options.minitus){
					date.setMinutes(that.options.minitus);
				}
			}
			if(that.seconds){
				date.setSeconds(that.seconds);
			}else{	
				if(that.options.seconds){
					date.setSeconds(that.options.seconds);
				}
			}
			var year=that.year=date.getFullYear();//年份
			var month=that.month=date.getMonth()+1;//月份
			var day=that.day=date.getDate();//日期
			var hour=that.hour=date.getHours(); //小时
			var minitus=that.minitus=date.getMinutes();//分钟
			var seconds=that.seconds=date.getSeconds(); //秒
			
			var oUls=that.oUls=calender.getElementsByTagName("ul");//获取对应的年月日 时分秒 容器
			/*var oYear=that.$("cal_year");
			var oMonth=that.$("cal_month");
			var oDay=that.$("cal_day");
			var oHour=that.$("cal_hour");
			var oMinitus=that.$("cal_minitus");
			var oSeconds=that.$("cal_second");
			*/
			var height=that.options.height;
			for(var i=0,len=oUls.length;i<len;i++){				
				if(oUls[i].className.indexOf("cal_year")!=-1){
					var yearArr=[];
					var index=0;
					var max=that.options.max;
					var min=that.options.min;
					var j=year-parseInt(min,10);
					var length=year+parseInt(max,10);
					var maxYear=that.options.maxYear;
					if(maxYear){
						length=parseInt(maxYear,10);
						if(maxYear<year){
							length=year;
						}						
					}
					var minYear=that.options.minYear;
					if(minYear){
						j=parseInt(minYear,10);
						if(minYear>year){
							j=year;
						}
					}
					for(;j<length+1;j++){
						if(j<year){
							index++;							
						}
						yearArr.push("<li data-value='"+j+"'>"+j+unitArr[i]+"</li>");
					}
					oUls[i].innerHTML=yearArr.join("");
					/*var height=oUls[i].children[0].offsetHeight;
					if(!height){
						height=parseInt(oUls[i].children[0].style.height,10);
					}*/
					oUls[i].style[transitionDuration] ="0";
					oUls[i].style[moveBy]=-(index-1)*height+"px";	
					oUls[i].children[index-1].className="active";				
				}else if(oUls[i].className.indexOf("cal_month")!=-1){
					var monthArr=[];
					var index=0;
					for(var j=1;j<13;j++){
						if(j<month){
							index++;							
						}
						monthArr.push("<li data-value='"+j+"'>"+j+unitArr[i]+"</li>");
					}
					oUls[i].innerHTML=monthArr.join("");
					/*var height=oUls[i].children[0].offsetHeight;
					if(!height){
						height=parseInt(oUls[i].children[0].style.height,10);
					}*/
					oUls[i].style[transitionDuration] ="0";
					oUls[i].style[moveBy]=-index*height+"px";
					oUls[i].children[index].className="active";				
				}else if(oUls[i].className.indexOf("cal_day")!=-1){
					var countDays=that.getCountDays(year,month);
					var dayArr=[];
					var index=0;
					for(var j=1;j<=countDays;j++){
						if(j<day){
							index++;							
						}
						dayArr.push("<li data-value='"+j+"'>"+j+unitArr[i]+"</li>");
					}
					oUls[i].innerHTML=dayArr.join("");
					/*var height=oUls[i].children[0].offsetHeight;
					if(!height){
						height=parseInt(oUls[i].children[0].style.height,10);
					}*/
					oUls[i].style[transitionDuration] ="0";
					oUls[i].style[moveBy]=-index*height+"px";
					oUls[i].children[index].className="active";
				}else if(oUls[i].className.indexOf("cal_hour")!=-1){
					var hourArr=[];
					var index=0;
					for(var j=0;j<24;j++){
						if(j<hour){
							index++;							
						}
						hourArr.push("<li data-value='"+j+"'>"+j+unitArr[i]+"</li>");
					}
					oUls[i].innerHTML=hourArr.join("");
					/*var height=oUls[i].children[0].offsetHeight;
					if(!height){
						height=parseInt(oUls[i].children[0].style.height,10);
					}*/
					oUls[i].style[transitionDuration] ="0";
					oUls[i].style[moveBy]=-index*height+"px";
					oUls[i].children[index].className="active";
				}else if(oUls[i].className.indexOf("cal_minitus")!=-1){
					var minitusArr=[];
					var index=0;
					for(var j=0;j<60;j++){
						if(j<minitus){
							index++;							
						}
						minitusArr.push("<li data-value='"+j+"'>"+j+unitArr[i]+"</li>");
					}
					oUls[i].innerHTML=minitusArr.join("");
					var height=oUls[i].children[0].offsetHeight;
					if(!height){
						height=parseInt(oUls[i].children[0].style.height,10);
					}
					oUls[i].style[transitionDuration] ="0";
					oUls[i].style[moveBy]=-index*height+"px";
					oUls[i].children[index].className="active";
				}else if(oUls[i].className.indexOf("cal_second")!=-1){
					var secondArr=[];
					var index=0;					
					for(var j=0;j<60;j++){
						if(j<seconds){
							index++;							
						}
						secondArr.push("<li data-value='"+j+"'>"+j+unitArr[i]+"</li>");
					}
					oUls[i].innerHTML=secondArr.join("");
					/*var height=oUls[i].children[0].offsetHeight;
					if(!height){
						height=parseInt(oUls[i].children[0].style.height,10);
					}*/
					oUls[i].style[transitionDuration] ="0";
					oUls[i].style[moveBy]=-index*height+"px";
					oUls[i].children[index].className="active";
				}
				oUls[i].innerHTML+=oUls[i].innerHTML;
			}
			
			//设置显示位置
			var position=that.options.position;
			switch(position){
				case "top":
					calender.style.top="0";
					break;
				case "bottom":
					calender.style.bottom="0";
					calender.style.top="auto";
					break;
				case "center":
				default:
					var top=0;
					var wh=getViewSizeWithoutScrollbar();
					top=wh.height/2-calender.offsetHeight/2;
					calender.style.top=top+"px";					
					break;
				
			}
			
		},		
		bindCalenderEvent:function(calender){
			var that=this;
			var oUls=that.oUls;//获取对应的年月日 时分秒 容器
			var moveStyleBy=that.moveStyleBy;
			var moveBy=that.moveBy;
			for(var i=0,len=oUls.length;i<len;i++){			
				oUls[i].style[transitionProperty] = that.options.useTransform ? cssVendor + 'transform' : moveStyleBy;
				oUls[i].style[transitionDuration] =that.options.animateTime/1000+"s";
				oUls[i].style[transformOrigin] = '0 0';
				//if(i==len-1){
				//	oUls[i].style["width"]=(100/len-6)+"%";
				//}else{
					oUls[i].style["width"]=100/len+"%";					
				//}
				if (that.options.useTransition){
					oUls[i].style[transitionTimingFunction] =that.sliderFunc;		
				}
				(function(i){
					that._bind(START_EV,oUls[i],function(e){that._start(e,oUls[i])});//绑定鼠标按下或触摸开始事件
					that._bind(MOVE_EV,oUls[i],function(e){that._move(e,oUls[i])});//绑定鼠标移动或触摸移动事件
					that._bind(END_EV,oUls[i],function(e){that._end(e,oUls[i])});//绑定鼠标弹上或触摸停止事件
				})(i);
			}
			//var sliderList=that.sliderList=calender.getElementsByTagName("table");
			//var length=that.length=sliderList.length;
			//calender.parentNode.style[unit]=browserWidth+"px";
			//var weekName=that.options.weekName;
			//var weekArray=that.options.weekArr;
			//var monthArray=["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"];
			//var monthArray=that.monthArray=["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
			//slider.width=""
			/*for(var i=0;i<length;i++){				
				sliderList[i].style[unit]=browserWidth+"px";				
			}*/			
			//calender.style[unit]=browserWidth*length+"px";
			//for (var i =0,len= calenders.length; i<len; i++) {	
			//点击完成要做的事情
			var cal_btn_finish=that.$("cal_btn_finish");
			if(cal_btn_finish){
				cal_btn_finish.onclick=function(){
					that.hide();
					if(that.options.currentDay){
						var date=new Date();
						if(that.year){
							date.setFullYear(that.year);
						}
						if(that.month){
							date.setMonth(that.month-1);
						}
						if(that.day){
							date.setDate(that.day);
						}
						if(that.hour){
							date.setHours(that.hour);
						}
						if(that.minitus){
							date.setMinutes(that.minitus);
						}
						if(that.seconds){
							date.setSeconds(that.seconds);
						}
						var dateFormat=that.dateFormat(that.options.format,date);
						that.options.currentDay.call(that,dateFormat);
					}
				}
			}
		},
		getCountDays:function(year,month) {
	        var curDate = new Date();
	        /* 获取当前月份 */
	        //var curMonth = curDate.getMonth();
	       /*  生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
	       if(year&&year!=0){
	       		curDate.setYear(year);//设置年份
	       }
	       if(month&&month!=0){
	       		curDate.setMonth(month);//设置月份  
	       }
	       /* 将日期设置为0, 这里为什么要这样设置, 我不知道原因, 这是从网上学来的 */
	       curDate.setDate(0);
	       /* 返回当月的天数 */
	       return curDate.getDate();
		},
		handlerEvent:function(e,that,obj){
		    // var that=this;
			switch(e.type) {
				case START_EV:
					if (!hasTouch && e.button !== 0) return;
					that._start(e,obj);
					break;
				case MOVE_EV: that._move(e,obj); break;
				case END_EV:
				case CANCEL_EV: that._end(e,obj); break;
			 //  case RESIZE_EV: that._resize(); break;
			   // case 'DOMMouseScroll': case 'mousewheel': that._wheel(e); break;
			   // case TRNEND_EV: that._transitionEnd(e); break;
			}
		},
		_start:function(e,obj){  //开始事件
			var that=this;
			//clearInterval(that.intervalId);
			//e.preventDefault();
			//that.isMoved=false;
			obj.setAttribute("data-move","false");
			obj.setAttribute("data-mousedown","true");
			if(e.changedTouches){
				e=e.changedTouches[e.changedTouches.length-1];
			}
			var eX=startPos.x=e.clientX || e.pageX;
			var eY=startPos.y=e.clientY || e.pageY;			
			//if (that.options.onSliderStart){that.options.onSliderStart.call(that,e)};
		},
		_move:function(e,obj){//
			var that=this;			
			e.preventDefault();
			//var calender=that.calender;
			var moveBy=that.moveBy;
			var isMouseDown=obj.getAttribute("data-mousedown");
			if(isMouseDown=="true"){
				if(e.changedTouches){
					e=e.changedTouches[e.changedTouches.length-1];
				}
				var eX=movePos.x=e.clientX || e.pageX;
				var eY=movePos.y=e.clientY || e.pageY;
				var left=parseFloat(obj.style[moveBy]);
				if(isNaN(left)){
					left=0;
				}
				
				//if(that.options.hScroll){
				//	left=left+(eX-startPos.x);
				//	startPos.x=eX;
				//}else{
					left=left+(eY-startPos.y);
					startPos.y=eY;
				//}
				//var obj=document.getElementById(obj.id);
				var oHeight=obj.offsetHeight;
				console.log("当前天的高度为"+oHeight+"----"+obj.children.length*obj.children);
				if(left>=0){
					left=-oHeight/2;
				}else if(left<=-oHeight/2){
					//that.slider.style[transitionDuration] = "0";
					left=0;
				}
				if(Math.abs(left)>10){
					//that.isMoved=true;
					obj.setAttribute("data-move","true");
				}else{					
					//that.isMoved=false;
					obj.setAttribute("data-move","false");
				}
				obj.style[transitionDuration] = "0";
				obj.style[moveBy]=left+"px";
				//console.log("---------"+that.calender.scrollTop+"----"+(eY-startPos.y));
				//if (that.options.onSliderMove){that.options.onSliderMove.call(that,e)};
			}
		},
		refresh:function(){
			
		},
		_end: function (e,obj) {
			var that=this;
			var isMoved=obj.getAttribute("data-move");
			if(isMoved=="true"){
				e.preventDefault();
			
				//var minYear=that.minYear;
			//	var maxYear=that.maxYear;
				//var minMonth=that.minMonth;
				//var maxMonth=that.maxMonth;
				//var todayYear=that.todayYear
				//that.isMouseDown=false;
				
				//var calender=that.calender;
				var moveBy=that.moveBy;
				//var browserWidth=that.browserWidth;
				//that.isNext=false;//月份是否加大
				//that.isPrev=false;//月份是否减少
				//that.isLoaded=false;//是否有加载数据
				//if(that.options.hScroll){
				//	oHeight=obj.offsetWidth;
				//}else{
				//var obj=document.getElementById(obj.id);
				var oHeight=obj.offsetHeight;
			//	}
				var heightUnit=obj.children[0].offsetHeight;
				if(e.changedTouches){
					e=e.changedTouches[e.changedTouches.length-1];
				}
				var eX=movePos.x=e.clientX || e.pageX;
				var eY=movePos.y=e.clientY || e.pageY;
				var left=parseFloat(obj.style[moveBy]);
				if(isNaN(left)){
					left=0;
				}
				//if(that.options.hScroll){
				//	left=left+(eX-startPos.x);					
				//}else{
					left=left+(eY-startPos.y);					
				//}
				if(left>=0){
					left=-oHeight/2;
					obj.style[transitionDuration] = "0";
				}else if(left<=-oHeight/2){
					left=0;
					obj.style[transitionDuration] = "0";
				}else{
					obj.style[transitionDuration] = that.options.animateTime/1000+"s";
				}
				//if(that.options.oneByOne&&that.options.hScroll){
					if(Math.abs(left%heightUnit/parseFloat(heightUnit))>=0.5){
						left=Math.floor(left/heightUnit)*heightUnit;
						if(that.options.debug){
							console.log("大于");
						}
					}else{
						left=Math.ceil(left/heightUnit)*heightUnit;
						if(that.options.debug){
							console.log("小于");
						}
					}
				//}				
				obj.style[transitionDuration] = that.options.animateTime/1000+"s";
				obj.style[moveBy]=left+"px";
				//var unit=that.unit;
				var data_current=obj.getAttribute("data-current");
				var className=obj.className;
				switch(className){
					case "cal_year":
						var index=that.getIndex(obj);
						var tempObj=obj.children[index];
						var tempObjs=obj.children;
						for (var i = 0,len=tempObjs.length; i < len; i++) {
							tempObjs[i].className="";
						};
						tempObj.className="active";
						var year=tempObj.getAttribute("data-value");
						that.year=year;
						that.setCalenderDay(year,that.month);
						break;
					case "cal_month":
						var index=that.getIndex(obj);
						var tempObj=obj.children[index];
						var tempObjs=obj.children;
						for (var i = 0,len=tempObjs.length; i < len; i++) {
							tempObjs[i].className="";
						};
						tempObj.className="active";
						var month=tempObj.getAttribute("data-value");
						that.month=month;
						that.setCalenderDay(that.year,month);
						break;
					case "cal_day":
						var index=that.getIndex(obj);
						var tempObj=obj.children[index];
						var tempObjs=obj.children;
						for (var i = 0,len=tempObjs.length; i < len; i++) {
							tempObjs[i].className="";
						};
						tempObj.className="active";
						var day=tempObj.getAttribute("data-value");
						that.day=day;
						break;
					case "cal_minitus":
						var index=that.getIndex(obj);
						var tempObj=obj.children[index];
						var tempObjs=obj.children;
						for (var i = 0,len=tempObjs.length; i < len; i++) {
							tempObjs[i].className="";
						};
						tempObj.className="active";
						var minitus=tempObj.getAttribute("data-value");
						that.minitus=minitus;
						break;
					case "cal_hour":
						var index=that.getIndex(obj);
						var tempObj=obj.children[index];
						var tempObjs=obj.children;
						for (var i = 0,len=tempObjs.length; i < len; i++) {
							tempObjs[i].className="";
						};
						tempObj.className="active";
						var hour=tempObj.getAttribute("data-value");
						that.hour=hour;
						break;
					case "cal_second":
						var index=that.getIndex(obj);
						var tempObj=obj.children[index];
						var tempObjs=obj.children;
						for (var i = 0,len=tempObjs.length; i < len; i++) {
							tempObjs[i].className="";
						};
						tempObj.className="active";
						var seconds=tempObj.getAttribute("data-value");
						that.seconds=seconds;
						break;
					default:
						break;				
				}
				//obj.setAttribute("data-current","");
				
			}			
			obj.setAttribute("data-mousedown","false");
			obj.setAttribute("data-move","false");
		},setCalenderDay:function(year,month){
			var that=this;
			var moveBy=that.moveBy;
			var unitArr=that.options.unitArr;
			var oDay=document.getElementById("cal_day");
			if(oDay){
				var countDays=that.getCountDays(year,month);
					var dayArr=[];
					var index=0;
					var day=that.day;
					for(var j=1;j<=countDays;j++){
						if(j<day&&day<=countDays){
							index++;							
						}
						dayArr.push("<li data-value='"+j+"'>"+j+unitArr[2]+"</li>");
					}
					oDay.innerHTML=dayArr.join("");
					var height=oDay.children[0].offsetHeight;
					oDay.style[transitionDuration] ="0";
					oDay.style[moveBy]=-index*height+"px";
					oDay.children[index].className="active";
					if(index==0){
						that.day=1;
					}
					oDay.innerHTML+=oDay.innerHTML;
			}
		},_bind: function (type,el,fn,bubble) {
			(el || this.calender).addEventListener(type, fn, !!bubble);
		},_unbind: function (type, el,fn, bubble) {
			(el || this.calender).removeEventListener(type, fn, !!bubble);
		},getIndex:function(obj){
			var that=this;
			var unit=that.unit;
			var moveBy=that.moveBy;
			var moveStyleBy=that.moveStyleBy;
			//var slider=that.slider;
			var browserWidth=obj.children[0].offsetHeight;
			var left=parseFloat(obj.style[moveBy]);
			if(isNaN(left)){
				left=0;
			}
			var index=that.index=Math.abs(Math.round(left/browserWidth));
			return index;
		}
	}
	
	module.exports  = Calender;
});