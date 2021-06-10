function Game(tr, td, mineNum){
	this.td=td;//单元格子
	this.tr=tr;//行
	this.mineNum = mineNum;//炸弹总数
	this.rMine = 0;//剩余雷数
	this.mineInfo = [];//雷信息
	this.cell = [];//单元格信息
	this.isPlay = false;//是否开始玩
	this.openClass = ["zero","one","two","three","four","five","six","seven","eight","nine"]
	this.gameBox = document.getElementById("gameBox");
	this.table = document.createElement("table");//生成table标签
	this.dataNum = document.getElementById("rMine");//剩余炸弹数量
}

Game.prototype.creatDom = function() {//创建游戏区域
	this.table.oncontextmenu = function(){return false};//清除右键事件
	for(var i=0;i<this.gameBox.children.length;i++){
		var childNod = this.gameBox.children[i];
		this.gameBox.removeChild(childNod);
	}

	for(var i=0;i<this.tr;i++){
		var tr = document.createElement("tr");
		this.cell[i] = [];//

		for(var j=0;j<this.td;j++){
			var td = document.createElement("td");
			tr.appendChild(td);//
			this.cell[i][j] = td;
			td.info = {
				type:"number",//格子类型
				x: i,//行
				y: j,//列
				value: 0,//
				isOpen: false,
				isFlag: false
			}
		}
		this.table.appendChild(tr);
	}
	this.gameBox.appendChild(this.table);
}

Game.prototype.creatMine = function(event,target){//生成炸弹
	var This = this;
	for(var i=0;true;i++){
		var randomX = Math.floor(Math.random()*this.tr),
			randomY = Math.floor(Math.random()*this.td);

		if(target.info.x != randomX || target.info.y != randomY){
			if(this.cell[randomX][randomY].info.type != "mine"){
				this.cell[randomX][randomY].info.type = "mine";//标雷
				this.rMine++;
				this.mineInfo.push(this.cell[randomX][randomY]);
			}
			if(this.rMine>=this.mineNum){
				break;
			}
		}
	}

	//炸弹周围的数字
	for(var i = 0; i< this.mineInfo.length;i++){
		var around = this.getAround(this.mineInfo[i],This);

		for(var j = 0; j<around.length;j++){
			around[j].info.value += 1;
		}
	}
}

Game.prototype.getAround = function(thisCell, This){//
	var x = thisCell.info.x,
		y = thisCell.info.y,
		result = [];

	for(var j = x - 1;j<=x+1;j++){
		for(var k=y-1;k<=y+1;k++){
			if(j<0||k<0||j>(This.tr-1)||k>(This.td-1)||
			This.cell[j][k].info.type == "mine"||(j==x&&k==y)){
				continue;
			}else{
				result.push(This.cell[j][k])
			}
		}
	}
	return result;
}

Game.prototype.leftMouse = function(event,target){
	var This = this;
	var noOpen = 0;
	if(target.info && !target.info.isFlag){
		if(target.info.type == "number"){

			function getAllZero(target,This){//递归函数
				if(target.info.isFlag){
					This.rMine += 1;
					target.info.isFlag = false;
				}
				if(target.info.value == 0){//周围没有雷
					target.className = This.openClass[target.info.value];
					target.info.isOpen = true;//被打开
					var thisAround = This.getAround(target,This);
					for(var i = 0;i < thisAround.length;i++){
						if(!thisAround[i].info.isOpen){
							getAllZero(thisAround[i],This)
						}
					}
				}else{//周围有雷
					target.innerHTML = target.info.value;
					target.className = This.openClass[target.info.value];
					target.info.isOpen = true;
					target.info.isFlag = false;
				}
			}

			getAllZero(target,This);

			for (var i = 0; i < this.tr; i++) {
				for (var j = 0; j < this.tr; j++) {
					if (this.cell[i][j].info.isOpen == false) {
						noOpen++;
					}
				}			
			}

			// alert(noOpen+","+this.mineNum)

			if (noOpen == this.mineNum) {
				this.gameWin();
			}
		}else{
			this.gameOver(target)
		}
	}
}

Game.prototype.rightMouse = function(target){
	if (!target.info.isOpen) {
		if (!target.info.isFlag) { //标记
			target.className = "targetFlag"; //显示旗帜
			target.info.isFlag = true; //表示该方格已经被标记
			this.rMine -= 1; //每标记一个方格，剩余炸弹数量-=1
		 // console.log(this.rMine)
		} else { //取消标记
			target.className = ""; //去掉旗帜
			target.info.isFlag = false;
			this.rMine += 1;
		 // console.log(this.rMine)
	 
		}
	 
		var isWin = true;
		if (this.rMine == 0) { //标记完所有flag时，遍历所有单元格
		 // console.log(this.mineInfo.length)
			for (var i = 0; i < this.mineInfo.length; i++) {
				console.log(this.mineInfo[i].info.isFlag)
				if (!this.mineInfo[i].info.isFlag) { //检查每个雷的isFlag属性是否被标记，只要有一个为false则输掉游戏
					isWin = false;
					this.gameOver(target, 1);
					break;
				}
			}
			isWin ? this.gameWin(1) : 0; //三目运算符号
		}
	}
}

Game.prototype.gameOver = function(target, code){
    var mineInfoLen = this.mineInfo.length;
    for (var i = 0; i < mineInfoLen; i++) { //显示每个雷的位置
     	this.mineInfo[i].className = "mine";
    }
    this.table.onmousedown = false; //取消鼠标事件
	this.table.onmouseover = false; //取消鼠标事件
	this.table.onmouseout = false; //取消鼠标事件
  
    if (code) {
     	alert("旗帜用完了，没有排除所有雷，游戏结束")
    } else {
     	target.className = "targetMine"; //触发雷标红色
     	alert("你被炸弹炸死了，游戏结束")
    }
}

Game.prototype.gameWin = function(code){
	var mineInfoLen = this.mineInfo.length;
    for (var i = 0; i < mineInfoLen; i++) { //显示每个雷的位置
     	this.mineInfo[i].className = "mine";
    }

	// this.dataNum.innerHTML = 0;
	// alert(this.dataNum.innerHTML)

	if (code) {
		alert("你成功标记所有地雷，游戏通过")
	} else {
		alert("你找到了所有安全区域，游戏通过")
	}
	this.table.onmousedown = false;
	this.table.onmouseover = false; //取消鼠标事件
	this.table.onmouseout = false; //取消鼠标事件
	this.rMine = 0;
}

Game.prototype.play = function(){
	var This = this;
	this.table.onmouseover = function(event){//鼠标放在格子上时
		event = event || window.event; //兼容IE
     	target = event.target || event.srcElement //兼容IE

		if(target.info && !target.info.isFlag && !event.target.info.isOpen){
			target.className = "over"
		}
				
	}
	this.table.onmouseout = function(event){//鼠标移开时
		event = event || window.event; //兼容IE
		target = event.target || event.srcElement //兼容IE

		if(target.info && !event.target.info.isFlag && !event.target.info.isOpen){
			event.target.className = " "
		}
	}
	this.table.onmousedown = function(event){//鼠标点击格子时
		event = event || window.event; //兼容IE
     	target = event.target || event.srcElement //兼容IE

		if(!this.isPlay){
			this.isPlay = true;
			This.creatMine(event,target);
		}

		if(event.button == 0){//左键点击
			// alert("左键")
			This.leftMouse(event,target);			
		}else if(event.button == 2){
			// alert("右键")
			This.rightMouse(target);
		}
		This.dataNum.innerHTML = This.rMine;
	}
	
}

Game.prototype.tablePos = function(){
	var width = this.table.offsetWidth,
	height = this.table.offsetHeight;
	this.table.style.width = width + "px";
	this.table.style.height = height + "px"
}

function addEvent(elem, type, handle){//添加事件函数
	if (elem.addEventListener) { //w3c标准
		elem.addEventListener(type, handle, false);
	}else if (elem.attachEvent) { //IE9及以下
		elem.attachEvent("on" + type, function() {
		 	handle.call(elem);
		})
	}
	else{
		elem["on" + type] = handle;
	}	
}

Game.prototype.setDegree = function(){//调整难度
	var button = document.getElementsByTagName("button");
	var btn0 = button[0].innerText;
	var btn1 = button[1].innerText;
	var btn2 = button[2].innerText;
	var btn3 = button[3].innerText;
	var btn4 = button[4].innerText;
	var btn5 = button[5].innerText;
		

	addEvent(button[0],"click",function(){
		var game = new Game(btn0,btn0,btn0);
		game.creatDom();
     	game.play();
		rMine.innerHTML = btn0;
	});

	addEvent(button[1],"click",function(){
		var game = new Game(btn1,btn1,btn1);
		game.creatDom();
     	game.play();
		rMine.innerHTML = btn1;
	});

	addEvent(button[2],"click",function(){
		var game = new Game(btn2,btn2,btn2);
		game.creatDom();
     	game.play();
		rMine.innerHTML = btn2;
	});

	addEvent(button[3],"click",function(){
		var game = new Game(btn3,btn3,btn3);
		game.creatDom();
     	game.play();
		rMine.innerHTML = btn3;
	});

	addEvent(button[4],"click",function(){
		var game = new Game(btn4,btn4,btn4);
		game.creatDom();
     	game.play();
		rMine.innerHTML = 10;
	});

	addEvent(button[5],"click",function(){
		var game = new Game(btn5,btn5,btn5);
		game.creatDom();
     	game.play();
		rMine.innerHTML = btn5;
	});
}


//初始界面
var game = new Game(3, 3, 3);
game.creatDom();//创建界面
game.play();//开始游戏
game.setDegree()//设置难度
this.rMine.innerHTML = 3;