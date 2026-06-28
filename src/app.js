const startButton = document.getElementById("start");
const togglePauseButton = document.getElementById("toggle-pause");
const canvas = document.getElementById("game-area");
const ctx = canvas.getContext("2d");
// getContext() method會回傳一個canvas的drawing context (CanvasRenderingContext2D object),
// drawing context可以用來在canvas內畫圖
const unit = 20;
const row = canvas.height / unit; // 320 / 20 = 16
const column = canvas.width / unit; // 320 / 20 = 16

const gameSettings = {
  startingX: 60,
  startingY: 0,
  startingLength: 4,
  fps: loadedSettings.snakeSpeed, // Allow different snake speed (50, 100, 150)
  allowHitWalls: loadedSettings.allowHitWalls == "true", // change the game mode
  snakeColor: {
    head: "lightgreen",
    body: "lightblue",
    stroke: "white",
  },
};

let snake = []; // array中的每個元素, 都是一個物件 // 物件的工作是,儲存身體的x,y座標
let direction = "Right"; // Right, Left, Up, Down
let pause = true;

class Score {
  static updateCurrentScoreLabel(newScore) {
    document.getElementById("current-score").innerHTML =
      "遊戲分數: " + newScore;
  }

  static updateHighestScoreLabel(newScore) {
    document.getElementById("highest-score").innerHTML =
      "最高分數: " + newScore;
  }

  constructor() {
    this.score = 0;
    this.highestScore = parseInt(localStorage.getItem("highestScore")) || 0;

    Score.updateCurrentScoreLabel(this.score);
    Score.updateHighestScoreLabel(this.highestScore);
  }

  updateScore() {
    this.score += 1;

    if (this.score > this.highestScore) {
      this.highestScore = this.score;
      localStorage.setItem("highestScore", this.highestScore);
      Score.updateHighestScoreLabel(this.highestScore);
    }

    Score.updateCurrentScoreLabel(this.score);
  }
}

class Fruit {
  static randX() {
    return Math.floor(Math.random() * (column - 2) + 1) * unit;
  }

  static randY() {
    return Math.floor(Math.random() * (row - 2) + 1) * unit;
  }
  constructor() {
    this.x = Fruit.randX();
    this.y = Fruit.randY();
    this.color = "yellow";
  }

  draw() {
    // console.log(this.x, this.y);
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, unit, unit);
  }

  newPosition() {
    let overlapping = false;
    let newX;
    let newY;

    function checkOverlap(x, y) {
      for (let i = 0; i < snake.length; i++) {
        if (x == snake[i].x && y == snake[i].y) {
          overlapping = true;
          return;
        } else {
          overlapping = false;
        }
      }
    }

    do {
      newX = Fruit.randX();
      newY = Fruit.randY();
      checkOverlap(newX, newY);
    } while (overlapping);

    this.x = newX;
    this.y = newY;
  }
}

function initSnakeBody() {
  // Creating initial snake body
  for (let i = 0; i < gameSettings.startingLength; i++) {
    snake.push({
      x: gameSettings.startingX,
      y: gameSettings.startingY,
    });
    gameSettings.startingX -= unit;
  }
}

function resetGame() {
  snake = [];
  direction = "Right";
  snakeColor = {
    head: "lightgreen",
    body: "lightblue",
    stroke: "white",
  };
  initSnakeBody;
}

function startGame() {
  pause = false;
  togglePauseButton.classList.remove("hidden");
  startButton.innerText = "開始新遊戲";
  startButton.style.animation = "none";
  startButton.removeEventListener("click", startGame);
  startButton.addEventListener("click", () => {
    window.location.reload();
  });
  window.addEventListener("keydown", togglePause);
}

function changeDirection(event) {
  // console.log(event.key + " Pressed");
  switch (event.key) {
    case "ArrowUp":
      //   console.log("ArrowUp");
      if (direction != "Down") {
        direction = "Up";
      }
      break;
    case "ArrowDown":
      //   console.log("ArrowDown");
      if (direction != "Up") {
        direction = "Down";
      }
      break;
    case "ArrowLeft":
      //   console.log("ArrowLeft");
      if (direction != "Right") {
        direction = "Left";
      }
      break;
    case "ArrowRight":
      //   console.log("ArrowRight");
      if (direction != "Left") {
        direction = "Right";
      }
      break;
  }

  // 每次按下上下左右鍵之後，在下一幀被畫出來之前，
  // 不接受任何keydown事件
  // 這樣可以防止連續按鍵導致蛇在邏輯上自殺
  window.removeEventListener("keydown", changeDirection);
}

function togglePause(event) {
  if (event.key === "p" || event.currentTarget.id === "toggle-pause") {
    if (pause) {
      togglePauseButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause-fill" viewBox="0 0 16 16">
  <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5m5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5"/>
</svg>`;
    } else {
      togglePauseButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">
  <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/>
</svg>`;
    }
    pause = !pause;
  }
}

startButton.addEventListener("click", startGame);
togglePauseButton.addEventListener("click", togglePause);
window.addEventListener("keydown", changeDirection);

let fruit = new Fruit();
let score = new Score();
initSnakeBody();

function draw() {
  if (pause) {
    return;
  }

  if (
    !gameSettings.allowHitWalls &&
    (snake[0].x >= canvas.width ||
      snake[0].x < 0 ||
      snake[0].y >= canvas.height ||
      snake[0].y < 0)
  ) {
    console.log("Hit wall!");
    clearInterval(game);
    alert("遊戲結束");
    return;
  }

  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      clearInterval(game);
      window.removeEventListener("keydown", togglePause);
      togglePauseButton.removeEventListener("click", togglePause);
      alert("遊戲結束");
      return;
    }
  }

  // 背景全設定為黑色
  // ctx.fillStyle = "black";
  // ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.reset();
  // console.log(snake[0].x, snake[0].y);

  fruit.draw();

  for (let i = 0; i < snake.length; i++) {
    if (i == 0) {
      ctx.fillStyle = gameSettings.snakeColor.head;
    } else {
      ctx.fillStyle = gameSettings.snakeColor.body;
    }
    ctx.strokeStyle = gameSettings.snakeColor.stroke;

    if (gameSettings.allowHitWalls) {
      if (snake[i].x >= canvas.width) {
        snake[i].x = 0;
      }

      if (snake[i].x < 0) {
        snake[i].x = canvas.width - unit;
      }

      if (snake[i].y >= canvas.height) {
        snake[i].y = 0;
      }
      if (snake[i].y < 0) {
        snake[i].y = canvas.height - unit;
      }
    }

    // x, y, width, height
    ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
  }

  // 以目前的direction變數方向,來決定蛇的下一幀要放在哪個座標
  let snakeX = snake[0].x; // snake[0]是一個物件，但snake[0].x 是個number (copy by value)
  let snakeY = snake[0].y;

  //   console.log(direction, snakeX, snakeY);
  switch (direction) {
    case "Left":
      snakeX -= unit;
      break;
    case "Up":
      snakeY -= unit;
      break;
    case "Right":
      snakeX += unit;
      break;
    case "Down":
      snakeY += unit;
      break;
  }

  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  // 確認蛇是否有吃到果實
  if (snake[0].x == fruit.x && snake[0].y == fruit.y) {
    console.log("吃到果實了");
    fruit.newPosition(); // 重新選定一個新的隨機位置
    fruit.draw(); // 畫出新果實
    score.updateScore(); // 更新分數
  } else {
    snake.pop();
  }
  snake.unshift(newHead); // append the snake head

  window.addEventListener("keydown", changeDirection);
}

let game = setInterval(draw, gameSettings.fps);
