const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const controls = document.getElementById('controls');
const leftBtn = document.getElementById('leftBtn');
const upBtn = document.getElementById('upBtn');
const downBtn = document.getElementById('downBtn');
const rightBtn = document.getElementById('rightBtn');

const box = 20;
const canvasSize = canvas.width / box;

let snake, direction, food, score, game;

startButton.addEventListener('click', startGame);
leftBtn.addEventListener('click', () => changeDirection('LEFT'));
upBtn.addEventListener('click', () => changeDirection('UP'));
downBtn.addEventListener('click', () => changeDirection('DOWN'));
rightBtn.addEventListener('click', () => changeDirection('RIGHT'));

function startGame() {
  snake = [{ x: 10, y: 10 }];
  direction = 'RIGHT';
  food = generateFood();
  score = 0;

  startButton.style.display = 'none';
  canvas.style.display = 'block';
  controls.style.display = 'flex';

  if (game) clearInterval(game);
  game = setInterval(draw, 100);
}

function changeDirection(newDirection) {
  if (newDirection === 'LEFT' && direction !== 'RIGHT') direction = 'LEFT';
  else if (newDirection === 'UP' && direction !== 'DOWN') direction = 'UP';
  else if (newDirection === 'RIGHT' && direction !== 'LEFT') direction = 'RIGHT';
  else if (newDirection === 'DOWN' && direction !== 'UP') direction = 'DOWN';
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw walls
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, box); // Top wall
  ctx.fillRect(0, 0, box, canvas.height); // Left wall
  ctx.fillRect(canvas.width - box, 0, box, canvas.height); // Right wall
  ctx.fillRect(0, canvas.height - box, canvas.width, box); // Bottom wall

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = (i === 0) ? 'green' : 'white';
    ctx.fillRect(snake[i].x * box, snake[i].y * box, box, box);
    ctx.strokeStyle = 'red';
    ctx.strokeRect(snake[i].x * box, snake[i].y * box, box, box);
  }

  ctx.fillStyle = 'red';
  ctx.fillRect(food.x * box, food.y * box, box, box);

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === 'LEFT') snakeX--;
  if (direction === 'UP') snakeY--;
  if (direction === 'RIGHT') snakeX++;
  if (direction === 'DOWN') snakeY++;

  if (snakeX === food.x && snakeY === food.y) {
    food = generateFood();
    score++;
  } else {
    snake.pop();
  }

  let newHead = { x: snakeX, y: snakeY };

  if (snakeX < 1 || snakeY < 1 || snakeX >= canvasSize - 1 || snakeY >= canvasSize - 1 || collision(newHead, snake)) {
    clearInterval(game);
    alert('Game Over');
    startButton.style.display = 'block';
    canvas.style.display = 'none';
    controls.style.display = 'none';
    return;
  }

  snake.unshift(newHead);
}

function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) {
      return true;
    }
  }
  return false;
}

function generateFood() {
  let foodX, foodY;
  do {
    foodX = Math.floor(Math.random() * (canvasSize - 2)) + 1;
    foodY = Math.floor(Math.random() * (canvasSize - 2)) + 1;
  } while (collision({ x: foodX, y: foodY }, snake));
  return { x: foodX, y: foodY };
}

