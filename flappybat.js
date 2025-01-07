//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bat
let batWidth =54;
let batHeight = 44;
let batX = boardWidth/8;
let batY = boardHeight/2;
let batImg

let bat = {
    x : batX,
    y : batY,
    width : batWidth,
    height : batHeight
}

//cave pillars
let pillarArray = [];
let pillarWidth = 64;
let pillarHeight = 512;
let pillarX = boardWidth;
let pillarY = 0;

let topPillarImg;
let bottomPillarImg;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    //draw flappy bat
    // context.fillStyle = "green"
    context.fillRect(bat.x, bat.y, bat.width, bat.height);

    //load img
    batImg = new Image();
    batImg.src = "./images/bat.gif";
    batImg.onload = function() {
        context.drawImage(batImg, bat.x, bat.y, bat.width, bat.height);
    }

    topPillarImg = new Image();
    topPillarImg.src = "./images/toppipe.png"

    bottomPillarImg = new Image();
    bottomPillarImg.src = "./images/bottompipe.png"

    requestAnimationFrame(update);
    setInterval(placePillars, 1500);
}

function update() {
    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);

    //bat
    context.drawImage(batImg, bat.x, bat.y, bat.width, bat.height)

    //pillars
    for (let i = 0; i < pillarArray.length; i++) {
        let pillar = pillarArray[i];
        context.drawImage(pillar.img, pillar.x, pillar.y, pillar.width, pillar,height);
    }
}

function placePillars() {

    let topPillar = {
        img : topPillarImg,
        x : pillarX,
        y : pillarY,
        width : pillarWidth,
        height : pillarHeight,
        passed : false
        }

        pillarArray.push(topPillar);
}