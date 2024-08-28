/** @type {HTMLCanvasElement} */

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
let numberOfEnemies = 100;
let enemySpeed = 1;
const enemiesArray = [];

const videoBackground = document.getElementById("video-background"); 

const storedPasswordHash =
  "8d3b145dc3ad292d0e9c90aafc92981080d1c3b36f7add0ee707ac0232cdf02d";

const clickSound = new Audio("./DanzaKuduro.mp3");

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  window.CANVAS_WIDTH = canvas.width;
  window.CANVAS_HEIGHT = canvas.height;
  console.log(`Canvas dimensions set to: ${canvas.width}x${canvas.height}`);
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

const enemyImage = new Image();
enemyImage.src = "./BOG.jpeg";

enemyImage.onload = () => {
  console.log("Enemy image loaded");
  document.getElementById("login-container").style.display = "block";
  document.getElementById("form-container").style.display = "none";
};

class Enemy {
  constructor() {
    this.x = random(0, canvas.width);
    this.y = random(0, canvas.height);
    this.width = random(100, 200);
    this.height = random(100, 200);
    this.speed = random(-enemySpeed, enemySpeed);
  }
  update() {
    this.x += this.speed;
    this.y += this.speed;

    if (this.x < 0 || this.x + this.width > canvas.width) this.speed *= -1;
    if (this.y < 0 || this.y + this.height > canvas.height) this.speed *= -1;
  }
  draw() {
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(enemyImage, this.x, this.y, this.width, this.height);
  }
  isClicked(x, y) {
    const isClicked =
      x >= this.x &&
      x <= this.x + this.width &&
      y >= this.y &&
      y <= this.y + this.height;
    console.log(`Checking if clicked: ${isClicked}`);
    return isClicked;
  }
}

function initGame() {
  console.log("Initializing game");
  enemiesArray.length = 0;
  for (let i = 0; i < numberOfEnemies; i++) {
    enemiesArray.push(new Enemy());
  }
  animate();
}

function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  enemiesArray.forEach((enemy) => {
    enemy.update();
    enemy.draw();
  });
  requestAnimationFrame(animate);
}

canvas.addEventListener("click", (event) => {
  console.log("Canvas clicked");
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  enemiesArray.forEach((enemy) => {
    if (enemy.isClicked(x, y)) {
      console.log("Enemy clicked");
      clickSound.play();
      videoBackground.style.display = "block"; // Afișează videoclipul
      videoBackground.play();
      canvas.style.backgroundColor = "#00000000";
      canvas.style.border= "none";
      canvas.style.opacity = 0.8;
      // window.open(
      //   "https://andreiaaaassssss.github.io/Danza-Kuduro/Danza%20Kuduro/"
      // );
    }
  });
});

document.getElementById("login-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const password = document.getElementById("password").value;
  const passwordHash = CryptoJS.SHA256(password).toString();

  if (passwordHash === storedPasswordHash) {
    document.getElementById("login-container").style.display = "none";
    document.getElementById("form-container").style.display = "block";
  } else {
    alert("Parola este incorectă!");
  }
});

document.getElementById("settings-form").addEventListener("submit", (event) => {
  event.preventDefault();

  numberOfEnemies = parseInt(document.getElementById("num-enemies").value, 10);
  enemySpeed = parseFloat(document.getElementById("enemy-speed").value);

  document.getElementById("form-container").style.display = "none";

  initGame();
});
