const score = document.querySelector(".score") as HTMLDivElement;
const startScreen = document.querySelector(".startScreen") as Element;
const gameArea = document.querySelector(".gameArea") as Element;
const pausePlay = document.querySelector(".pauseButton") as Element;

startScreen.addEventListener("click", handleButtonClick);
pausePlay.addEventListener("click",handleButtonClick);

interface AxisHtmlElement extends HTMLElement {
  x: number;
  y: number;
}

interface Player {
  speed: number,
  score: number,
  start?: boolean,
  x: number,
  y: number,
}

const player = { speed: 5, score: 0 } as Player;

let keyState = {}; 
let initial = true; // This boolean is here for the handleButtonClick event

document.addEventListener("keydown", function (e) {
  keyState[e.code] = true; 
  if (keyState["KeyX"]) {
    switch (player.speed) {
      case 5:
        player.speed = 10;
        break;
      case 10:
        player.speed = 15;
        break;
      default:
        break;  // removed if player.speed = 15 case, since it seemed like Z was supposed to set it to normal
    }
  }
});
document.addEventListener("keydown", function (e) {
  keyState[e.code] = true; 
  if (keyState["KeyZ"]) {
    player.speed = 5; 
  }
});

document.addEventListener("keyup", function (e) {
  keyState[e.code] = false; 
});

let keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
};

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

function keyDown(e) {
  e.preventDefault();
  keys[e.key] = true;
}

function keyUp(e) {
  e.preventDefault();
  keys[e.key] = false;
}

function isCollide(a, b) {
  const aRect = a.getBoundingClientRect();
  const bRect = b.getBoundingClientRect();

  return !(
    aRect.bottom < bRect.top ||
    aRect.top > bRect.bottom ||
    aRect.right < bRect.left ||
    aRect.left > bRect.right
  );
}

function handleButtonClick(event) {
  const target = event.target;

  if (target.classList.contains("playButton")) {
    if (isPaused) {
      playGame();
    } else if (initial) {
      initializeGame();
      initial = false;
    }
    // Doesn't do anything if either of these cases is false
  } else if (target.classList.contains("instructionsButton")) {
    showInstructions();
  } else if (target.classList.contains("pauseButton") && !isPaused) {
    pauseGame();
  }
}

function moveLines() {
  let lines = document.querySelectorAll(".lines");
  lines.forEach(function (item: any) {
    if (item.y >= 700) {
      item.y -= 750;
    }
    item.y += player.speed;
    item.style.top = item.y + "px";
  });
}


function endGame() {
  player.start = false;
  startScreen.classList.remove("hide");
  
  var restartButton = document.createElement("button");
  restartButton.className = "restartButton";
  restartButton.textContent = "RESTART";
  restartButton.style.marginTop = "20px";
  
  restartButton.addEventListener("click", initializeGame);
  
  var endGameContainer = document.createElement("div");
  endGameContainer.className = "endGameContainer";
  
  var scoreText = document.createElement("p");
  scoreText.classList.add("bold-text"); 
  scoreText.textContent = "Game over! Your final score is " + player.score;
  scoreText.style.color = "black";
  scoreText.style.fontFamily = "Arial, sans-serif";
  
  
  endGameContainer.appendChild(scoreText);
  endGameContainer.appendChild(restartButton);  
  startScreen.innerHTML = "";
  startScreen.appendChild(endGameContainer);
}


const carImages = [
"enemy1.png",
"enemy2.png",
"enemy3.png",
"enemy4.png",
"enemy5.png",
"OIP.png"
];

function moveEnemy(myCar) {
  let enemyCarList = [...document.querySelectorAll(".enemyCar")] as AxisHtmlElement[];

  enemyCarList.forEach(function (enemyCar) {
    if (isCollide(myCar, enemyCar)) {
      endGame();
    }

    if (enemyCar.y >= 750) {
      enemyCar.y = -300;
      enemyCar.style.left = Math.floor(Math.random() * 350) + "px";
    }

    enemyCar.y += player.speed;
    enemyCar.style.top = enemyCar.y + "px";
  });
}

let isPaused = false;
const playButton = document.querySelector(".playButton") as Element; 
const pauseButton = document.querySelector(".pauseButton") as Element; 

playButton.addEventListener("click", playGame);
pauseButton.addEventListener("click", pauseGame);
const buttonShowDelay=1000;
function playGame() {
  isPaused = false;
  initializeGame();
  const pausePlay = document.querySelector('.pausePlay') as Element
  pausePlay.classList.add('hide');
  setTimeout(
    () => pausePlay.classList.remove('hide'),
    buttonShowDelay);
}

function pauseGame() {
  isPaused = true;
}


function runGame() {
  let car = document.querySelector(".myCar") as HTMLDivElement;
  let road = gameArea.getBoundingClientRect();

  if (player.start && !isPaused) {
    moveLines();
    moveEnemy(car);

    if (keys.ArrowUp && player.y > road.top + 150) {
      player.y -= player.speed;   
    }
    if (keys.ArrowDown && player.y < road.bottom - 85) {
      player.y += player.speed;
    }
    if (keys.ArrowLeft && player.x > 0) {
      player.x -= player.speed;
    }
    if (keys.ArrowRight && player.x < road.width - 50) {
      player.x += player.speed;
    }

    car.style.top = player.y + "px";
    car.style.left = player.x + "px";

    window.requestAnimationFrame(runGame);

    player.score++;
    score.innerText = "Score: " + player.score + "\nSpeed: " + player.speed;
  }
}


function initializeGame() {
  startScreen.classList.add("hide");
  gameArea.innerHTML = "";

  player.start = true;
  player.score = 0;
  window.requestAnimationFrame(runGame)
  for (let x = 0; x < 5; x++) {
    let roadLine = document.createElement("div") as unknown as AxisHtmlElement;
    roadLine.setAttribute("class", "lines");
    roadLine.y = x * 150;
    roadLine.style.top = roadLine.y + "px";
    gameArea.appendChild(roadLine);
  }

  let car = document.createElement("div");
  car.setAttribute("class", "myCar");
  car.style.backgroundImage = "url('car2.png')";
  gameArea.appendChild(car);

  player.x = car.offsetLeft;
  player.y = car.offsetTop;

  for (let x = 0; x < 3; x++) {
    let enemyCar = document.createElement("div") as unknown as AxisHtmlElement;
    enemyCar.setAttribute("class", "enemyCar");
    enemyCar.y = (x + 1) * 350 * -1;
    enemyCar.style.top = enemyCar.y + "px";
    enemyCar.style.left = Math.floor(Math.random() * 350) + "px";
    let randomIndex = Math.floor(Math.random() * carImages.length);
    enemyCar.style.backgroundImage = `url('${carImages[randomIndex]}')`;
    gameArea.appendChild(enemyCar);
  }

  moveEnemy(car);
}

let chk=0;
function showInstructions() {
  if(chk==0) {  
    const instructionsContainer = document.createElement("div");
    instructionsContainer.classList.add("instructionsContainer");

    const instruction1 = document.createElement("p");
    instruction1.innerText = "Press here to start";
    instructionsContainer.appendChild(instruction1);

    const instruction2 = document.createElement("p");
    instruction2.innerText = "Arrow keys to move";
    instructionsContainer.appendChild(instruction2);

    const instruction3 = document.createElement("p");
    instruction3.innerText = "If you hit another car, you will lose";
    instructionsContainer.appendChild(instruction3);

    const instruction4 = document.createElement("p");
    instruction4.innerText = "Press 'X' to increase the speed and press 'Z' to set it back to normal";
    instructionsContainer.appendChild(instruction4);

    startScreen.appendChild(instructionsContainer);
    chk=1;
  }
}
