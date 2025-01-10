//board
let board;
let boardWidth = 650;
let boardHeight = 850;
let context;

//bat
let batWidth = 84;
let batHeight = 54;
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
let pillarWidth = 84;
let pillarHeight = 512;
let pillarX = boardWidth;
let pillarY = 0;

let topPillarImg;
let bottomPillarImg;

//game physics
let velocityX = -1; //pipes moving left speed
let velocityY = 2; //bird jump speed
let gravity = 0.05; //downward gravity

let gameOver = false;
let score = 0;

//sounds
let pointSound = new Audio("./sounds/sfx_point.wav");
let deathSound = new Audio("./sounds/sfx_die.wav");
let wingSound = new Audio("./sounds/sfx_wing.wav");
let hitSound = new Audio("./sounds/sfx_hit.wav");
let bgm = new Audio("./sounds/bgm.mp3");
bgm.loop = true;

//game over popup
const gameOverPopup = document.querySelector(".gameover");
const gameOverButton = document.querySelector(".gameover button");

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
  for (let i = 0; i < 6; i++) {
    let batImg = new Image();
    batImg.src = `./images/frames/bat${i}.gif`;
    batImgs.push(batImg);
  }

  topPillarImg = new Image();
  topPillarImg.src = "./images/toppillar.png";

  bottomPillarImg = new Image();
  bottomPillarImg.src = "./images/bottompillar.png";

  requestAnimationFrame(update);
  setInterval(placePillars, 1500); //1.5 seconds
  setInterval(animateBat, 40); //1/10 seconds
  document.addEventListener("keydown", moveBat);
  bgm.play();
};
let lastTimestamp = undefined;

function update(timestamp) {
  const sixtyFPS = 1000 / 60;

  if (lastTimestamp === undefined) {
    lastTimestamp = timestamp;
  }

  const updateCanvasKeyframe = timestamp - sixtyFPS > lastTimestamp;

  console.log("update function running");
  console.log(timestamp);
  if (gameOver) {
    return; // don't run update anymore, ever.
  }

  if (updateCanvasKeyframe) {
    context.clearRect(0, 0, board.width, board.height);

    //bat
    velocityY += gravity;
    // bat.y += velocityY;
    bat.y = Math.max(bat.y + velocityY, 0); // apply gravity and limit height
    // context.drawImage(batImg, bat.x, bat.y, bat.width, bat.height);
    context.drawImage(
      batImgs[batImgsIndex],
      bat.x,
      bat.y,
      bat.width,
      bat.height
    );
    // batImgsIndex++; //to go next frame
    // batImgsIndex %= batImgs.length; //circle back frames max is 8 currently

    if (bat.y > board.height) {
      gameOver = true;
      deathSound.play();
      gameOverPopup.style.display = "block";
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
      if (!pillar.passed && bat.x > pillar.x + pillar.width) {
        score += 0.5; //each pillar is 2 pillars there-for .5 increments
        pillar.passed = true;
        pointSound.play();
      }
      if (detectCollision(bat, pillar)) {
        hitSound.play();
        gameOver = true;
        deathSound.play();
        gameOverPopup.style.display = "block";
      }
    }
  }

  //clear pillars passed
  while (pillarArray.length > 0 && pillarArray[0].x < -pillarWidth) {
    pillarArray.shift(); //removes first element in array
  }

  //score
  context.fillStyle = "white";
  context.font = "45px sans-serif";
  context.fillText(score, 5, 45);

  if (gameOver) {
    bgm.pause();
    bgm.currentTime = 3;
  }

  requestAnimationFrame(update);
}

function animateBat() {
  batImgsIndex++; //to go next frame
  batImgsIndex %= batImgs.length; //circle back frames max is 8 currently
}

function placePillars() {
  if (gameOver) {
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
    if (bgm.paused) {
      bgm.play();
    }
    wingSound.play();
    //jump
    velocityY = -3.5;

    //reset game
    // if (gameOver) {
    //     bat.y = batY;
    //     pillarArray = [];
    //     score = 0;
    //     gameOver = false;
    // }
  }
}

function detectCollision(bat, pillar) {
  // Define a margin to shrink the bat's collision box
  const marginX = 20; // Allow 20 pixels closer horizontally
  const marginY = 20; // Allow 20 pixels closer vertically

  // Adjust the bat's collision boundaries by reducing its effective size
  return (
    bat.x + marginX < pillar.x + pillar.width &&
    bat.x + bat.width - marginX > pillar.x &&
    bat.y + marginY < pillar.y + pillar.height &&
    bat.y + bat.height - marginY > pillar.y
  );
}

function resetGame() {
  gameOver = false; // turn the game back on
  //   might need to reset some things... pillars.
  bat.y = batY;
  pillarArray = [];
  score = 0;
  requestAnimationFrame(update);
  //
  gameOverPopup.style.display = "none";
}

gameOverButton.addEventListener("click", resetGame);
