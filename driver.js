function checkLoaded() {
  return document.readyState === "complete";
}
function setupCanvas(){
	const canvas = document.getElementById('main');
	canvas.width  = window.innerWidth;
	canvas.height = window.innerHeight;
}

var myObstacles = [];
var myBackground;


setupCanvas()

function windowResize() {
  const canvas = document.getElementById('main');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
};

window.addEventListener('resize', windowResize);

var myGameArea = {
  canvas : document.getElementById("main"),
  start : function() {
    this.context = this.canvas.getContext("2d");
    this.frameNo = 0;       
    this.interval = setInterval(updateGameArea, 20);
    window.addEventListener('keydown', function (e) {
      myGameArea.keys = (myGameArea.keys || []);
      myGameArea.keys[e.keyCode] = true;
    })
    window.addEventListener('keyup', function (e) {
      myGameArea.keys[e.keyCode] = false;
    })
  },
  clear : function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }, stop : function() {
    clearInterval(this.interval);
  }
}
function everyinterval(n) {
  if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
  return false;
}

function startGame() {
  myGameArea.start();
  myGamePiece = new component(120, 164, "gamePieceMain.png", 50, 520, "image");
  myBackground = new component(window.innerWidth, window.innerHeight, "main_bg.png", 0, 0, "background");
  myScore = new component("30px", "Courier New", "black", 280, 40, "text");
  myObstacle = new component(50, 200, "green", 300, 520);
}


function component(width, height, color, x, y, type) {
  this.width = width;
  this.type = type
  if (type == "image" || type== "background") {
    this.image = new Image();
    this.image.src = color;
  }
   this.gravity = 0.05;
  this.gravitySpeed = 0;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
   this.bounce = 0.6;
  this.x = x;
  this.y = y;
  this.update = function(){
    ctx = myGameArea.context;
    if (type == "image" || type == "background") {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      if (type == "background") {
        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
      }
    } else if (this.type == "text") {
      ctx.font = this.width + " " + this.height;
      ctx.fillStyle = color;
      ctx.fillText(this.text, this.x, this.y);
  	} else {
	    ctx.fillStyle = color;
	    ctx.fillRect(this.x, this.y, this.width, this.height);
	}
  }
  this.newPos = function() {
  	this.gravitySpeed += this.gravity;
    this.x += this.speedX;
    this.y +=this.speedY + this.gravitySpeed ;
    if (this.type == "background") {
      if (this.x == -(this.width)) {
        this.x = 0;
      }
    }
    this.hitBottom();
  }
  this.hitBottom = function() {
    var rockbottom = myGameArea.canvas.height - this.height;
    if (this.y > rockbottom) {
      this.y = rockbottom;
      this.gravitySpeed = -(this.gravitySpeed * this.bounce);
    }
  }
  this.crashWith = function(otherobj) {
    var myleft = this.x;
    var myright = this.x + (this.width);
    var mytop = this.y;
    var mybottom = this.y + (this.height);
    var otherleft = otherobj.x;
    var otherright = otherobj.x + (otherobj.width);
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + (otherobj.height);
    var crash = true;
    if ((mybottom < othertop) ||
    (mytop > otherbottom) ||
    (myright < otherleft) ||
    (myleft > otherright)) {
      crash = false;
    }
    return crash;
  }
}
function updateGameArea() {
		var x, y;
	  for (i = 0; i < myObstacles.length; i += 1) {
	    if (myGamePiece.crashWith(myObstacles[i])) {
	      myGamePiece.image.src = "gamePieceTertiary.png";
	      myGameArea.stop();
	      return;
	    }
	  }
	  myGameArea.clear();
	  myBackground.speedX = -2;
	myBackground.newPos();
  	myBackground.update();

	  myGameArea.frameNo += 1;
	  if (myGameArea.frameNo == 1 || everyinterval(150)) {
	    x = myGameArea.canvas.width;
	    minHeight = 20;
	    maxHeight = 200;
	    minWidth = 50
	    maxWidth = 200
	    width = Math.floor(Math.random()*(maxWidth-minWidth+1)+minWidth);
	    height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
	    minGap = 250;
	    maxGap = 275;
	    gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
	    myObstacles.push(new component(width, height, "green", x, 0));
	    myObstacles.push(new component(width, x - height - gap, "green", x, height + gap));
	  }
	  for (i = 0; i < myObstacles.length; i += 1) {
	    myObstacles[i].x += -10;
	    myObstacles[i].update();
	  }
	  myScore.text = "SCORE: " + myGameArea.frameNo;
 	  myScore.update();
	  myGamePiece.speedX = 0;
	  myGamePiece.speedY = 0;
	  myGamePiece.image.src = "gamePieceMain.png";
	  if (myGameArea.keys && myGameArea.keys[37]) {myGamePiece.speedX = -5;  myGamePiece.image.src = "gamePieceSecondary.png";}
	  if (myGameArea.keys && myGameArea.keys[39]) {myGamePiece.speedX = 5; myGamePiece.image.src = "gamePieceSecondary.png";}
	  if (myGameArea.keys && myGameArea.keys[38]) {myGamePiece.speedY = -5; myGamePiece.image.src = "gamePieceSecondary.png"; accelerate(-0.01)}
	  if (myGameArea.keys && myGameArea.keys[40]) {myGamePiece.speedY = 5; myGamePiece.image.src = "gamePieceSecondary.png"; accelerate(0.01)}
	  myGamePiece.newPos();
	  myGamePiece.update();

}
function accelerate(n){
	myGamePiece.gravity = n;

}
function moveup() {
  myGamePiece.speedY -= 5;
}

function movedown() {
  myGamePiece.speedY += 5;
}

function moveleft() {
  myGamePiece.speedX -= 5;
}

function moveright() {
  myGamePiece.speedX += 5;
}
if(checkLoaded()){
  startGame()
}
