//board
let board;
let boardWidth = 650;
let boardHeight = 850;
let context;

//bat
let batWidth = 54;
let batHeight = 44;
let batX = boardWidth / 8;
let batY = boardHeight / 2;
let batImgs = [];
let batImgsIndex = 0;

let bat = {
  x: batX,
  y: batY,
  width: batWidth,
  height: batHeight,
};

//cave pillars
let pillarArray = [];
let pillarWidth = 64;
let pillarHeight = 512;
let pillarX = boardWidth;
let pillarY = 0;

let topPillarImg;
let bottomPillarImg;

//game physics
let velocityX = -1; //moving left speed
let velocityY = 0; //bird jump speed
let gravity = 0.2; //downward gravity

let gameOver = false;
let score = 0

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d");

  //draw flappy bat
  // context.fillStyle = "green"
  context.fillRect(bat.x, bat.y, bat.width, bat.height);

  //load img
  // batImg = new Image();
  // batImg.src = "./images/bat.gif";
  // batImg.onload = function () {
  //   context.drawImage(batImg, bat.x, bat.y, bat.width, bat.height);
  // };
  for (let i = 0; i < 8; i++) {
    let batImg = new Image();
    batImg.src = `./images/frames/bat${i}.gif`;
    batImgs.push(batImg);
  }

  topPillarImg = new Image();
  topPillarImg.src = "./images/toppipe.png";

  bottomPillarImg = new Image();
  bottomPillarImg.src = "./images/bottompipe.png";

  requestAnimationFrame(update);
  setInterval(placePillars, 1500); //1.5 seconds
  setInterval(animateBat, 100); //1/10 seconds
  document.addEventListener("keydown", moveBat);
};

function update() {
    if (gameOver) {
        return;
    }
  context.clearRect(0, 0, board.width, board.height);

  //bat
  velocityY += gravity;
  // bat.y += velocityY;
  bat.y = Math.max(bat.y + velocityY, 0); // apply gravity and limit height
  // context.drawImage(batImg, bat.x, bat.y, bat.width, bat.height);
  context.drawImage(batImgs[batImgsIndex], bat.x, bat.y, bat.width, bat.height);
  // batImgsIndex++; //to go next frame
  // batImgsIndex %= batImgs.length; //circle back frames max is 8 currently


  if (bat.y > board.height) {
    gameOver = true;
  }

  //pillars
  for (let i = 0; i < pillarArray.length; i++) {
    let pillar = pillarArray[i];
    pillar.x += velocityX;
    context.drawImage(
      pillar.img,
      pillar.x,
      pillar.y,
      pillar.width,
      pillar.height
    );
    if (!pillar.passed && bat.x> pillar.x + pillar.width) {
        score += 0.5; //each pillar is 2 pillars there-for .5 increments 
        pillar.passed = true;
    }
    if (detectCollision(bat, pillar)) {
        gameOver = true;
    }
  }

  //clear pillars passed
  while (pillarArray.length > 0&& pillarArray[0].x < -pillarWidth) {
    pillarArray.shift(); //removes first element in array
  }

  //score
  context.fillStyle = "white"
  context.font = "45px sans-serif"
  context.fillText(score, 5, 45);

  if (gameOver) {
    context.fillText("GAME OVER", 5, 90);
  }

  requestAnimationFrame(update);
}

function animateBat() {
  batImgsIndex++; //to go next frame
  batImgsIndex %= batImgs.length; //circle back frames max is 8 currently
}

function placePillars() {
    if(gameOver) {
        return;
    }
  let randomPillarY =
    pillarY - pillarHeight / 4 - Math.random() * (pillarHeight / 2);
  let openingSpace = board.height / 4;

  let topPillar = {
    img: topPillarImg,
    x: pillarX,
    y: randomPillarY,
    width: pillarWidth,
    height: pillarHeight,
    passed: false,
  };

  pillarArray.push(topPillar);

  let bottomPillar = {
    img: bottomPillarImg,
    x: pillarX,
    y: randomPillarY + pillarHeight + openingSpace,
    width: pillarWidth,
    height: pillarHeight,
    passed: false,
  };
  pillarArray.push(bottomPillar);
}

function moveBat(e) {
  if (e.code == "Space" || e.code == "ArrowUp") {
    //jump
    velocityY = -6;

    //reset game
    if (gameOver) {
        bat.y = batY;
        pillarArray = [];
        score = 0;
        gameOver = false;
    }
  }
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
