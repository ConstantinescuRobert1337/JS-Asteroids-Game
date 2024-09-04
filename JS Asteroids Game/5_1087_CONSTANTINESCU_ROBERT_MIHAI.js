var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth - 6;
canvas.height = window.innerHeight - 6;
var ctx = canvas.getContext("2d");
const vitezaNava = 360;
const accelaratieNava = 3;
const incetinireNava = 0.6;
var gameStarted = false;

//nava spatiala
var ship = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  r: 20,
  a: (90 / 180) * Math.PI,
  rot: 0,
  thrusting: false,
  thrust: {
    x: 0,
    y: 0,
  },
};

function drawShip(x, y, a) {
  if (ship.thrusting) {
    ship.thrust.x += (accelaratieNava * Math.cos(ship.a)) / 100;
    ship.thrust.y -= (accelaratieNava * Math.sin(ship.a)) / 100;
  } else {
    ship.thrust.x -= (incetinireNava * ship.thrust.x) / 100;
    ship.thrust.y -= (incetinireNava * ship.thrust.y) / 100;
  }
  ctx.strokeStyle = "white";
  ctx.beginPath();
  ctx.moveTo(
    x + (4 / 3) * ship.r * Math.cos(a),
    y - (4 / 3) * ship.r * Math.sin(a)
  );
  ctx.lineTo(
    x - ship.r * ((2 / 3) * Math.cos(a) + Math.sin(a)),
    y + ship.r * ((2 / 3) * Math.sin(a) - Math.cos(a))
  );
  ctx.lineTo(
    x - ship.r * ((2 / 3) * Math.cos(a) - Math.sin(a)),
    y + ship.r * ((2 / 3) * Math.sin(a) + Math.cos(a))
  );
  ctx.closePath();
  ctx.stroke();
}

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

const vitezaDeplasare = 3;

function keyDown(/** @type {KeyboardEvent} */ ev) {
  switch (ev.keyCode) {
    case 37: // sageata stanga
      ship.thrust.x = -vitezaDeplasare;
      break;
    case 38: // sageata sus
      ship.thrust.y = -vitezaDeplasare;
      break;
    case 39: // sageata dreapta
      ship.thrust.x = vitezaDeplasare;
      break;
    case 40: // sageata jos
      ship.thrust.y = vitezaDeplasare;
      break;
    case 90: // tasta Z
      ship.rot = ((vitezaNava / 180) * Math.PI) / 180;
      break;
    case 67: // tasta C
      ship.rot = ((-vitezaNava / 180) * Math.PI) / 180;
      break;
  }
}

function keyUp(/** @type {KeyboardEvent} */ ev) {
  switch (ev.keyCode) {
    case 37: // sageata stanga
    case 39: // sageata dreapta
      ship.thrust.x = 0;
      break;
    case 38: // sageata sus
    case 40: // sageata jos
      ship.thrust.y = 0;
      break;
    case 90: // tasta Z
    case 67: // tasca C
      ship.rot = 0;
      break;
  }
}

// Repornește poziția navei la centrul canvasului
function resetShipPosition() {
  ship.x = canvas.width / 2;
  ship.y = canvas.height / 2;
  ship.thrust.x = 0;
  ship.thrust.y = 0;
}

function resetGame() {
  cancelAnimationFrame(animationId);
  document.getElementById("resetButton").style.display = "none";
  document.getElementById("startButton").style.display = "none";
  lives = 3;
  score = 0;
  totalScore = 0;
  asteroidArray = [];
  for (var i = 0; i < 15; i++) {
    var radius = 50;
    var x = Math.random() * (canvas.width - radius * 2) + radius;
    var dx = (Math.random() - 0.5) * 0.5;
    var y = Math.random() * (canvas.height - radius * 2) + radius;
    var dy = (Math.random() - 0.5) * 0.5;
    var hitsNeeded = Math.floor(Math.random() * 4) + 1; // Numărul de rachete necesare pentru distrugerea asteroidului
    asteroidArray.push(new Circle(x, y, dx, dy, hitsNeeded));
  }
  resetShipPosition();
  animationId = requestAnimationFrame(animate);
}

function startGame() {
  resetGame();
  animate();
  document.getElementById("startButton").style.display = "none";
  gameStarted = true;
}

function checkCollision() {
  for (var i = 0; i < asteroidArray.length; i++) {
    var dx = ship.x - asteroidArray[i].x;
    var dy = ship.y - asteroidArray[i].y;
    var distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < ship.r + asteroidArray[i].radius) {
      lives--;
      resetShipPosition();

      if (lives <= 0) {
        cancelAnimationFrame(animationId);
        ctx.font = "50px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
        ctx.font = "25px Arial";
        ctx.fillText(
          "Scorul tău: " + totalScore,
          canvas.width / 2,
          canvas.height / 2 + 50
        );
        document.getElementById("resetButton").style.display = "block";
        return;
      }
    }
  }
}

document.getElementById("resetButton").style.display = "none";
document.getElementById("resetButton").addEventListener("click", resetGame);
document.getElementById("startButton").style.display = "none";
document.getElementById("startButton").addEventListener("click", startGame);
window.onload = function () {
  document.getElementById("startButton").style.display = "block";
};
var animationId;

//rachete
function Rocket(x, y, angle) {
  this.x = x;
  this.y = y;
  this.angle = angle;
  this.vel = 5;

  this.update = function () {
    this.x += this.vel * Math.cos(this.angle);
    this.y -= this.vel * Math.sin(this.angle);
  };

  this.draw = function () {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2, false);
    ctx.fill();
  };
}
var rockets = [];

function shootRocket() {
  if (rockets.length < 3) {
    var rocketX = ship.x + (4 / 3) * ship.r * Math.cos(ship.a);
    var rocketY = ship.y - (4 / 3) * ship.r * Math.sin(ship.a);
    var rocket = new Rocket(rocketX, rocketY, ship.a);
    rockets.push(rocket);
  }
}

document.addEventListener("keydown", function (ev) {
  if (ev.keyCode === 88) {
    shootRocket();
  }
});

function checkRocketCollisions() {
  for (var i = rockets.length - 1; i >= 0; i--) {
    for (var j = asteroidArray.length - 1; j >= 0; j--) {
      var dx = rockets[i].x - asteroidArray[j].x;
      var dy = rockets[i].y - asteroidArray[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < asteroidArray[j].radius) {
        asteroidArray[j].hitsNeeded -= 1;
        addScore(asteroidArray[j].radius);
        asteroidArray[j].updateColorAndSize();

        if (asteroidArray[j].hitsNeeded <= 0) {
          asteroidArray.splice(j, 1);
        }

        rockets.splice(i, 1);
        break;
      }
    }
  }
}

var lives = 3;
var score = 0;
var totalScore = 0;

function addScore(radius) {
  var points = 0;
  if (radius === 40) {
    points = 100;
  } else if (radius === 30) {
    points = 250;
  } else if (radius === 20) {
    points = 500;
  } else if (radius === 10) {
    points = 1000;
  }
  score += points;
  totalScore += points;
  while (score >= 1000) {
    lives++;
    score -= 1000;
  }
}

// Asteroizi
function Circle(x, y, dx, dy, hitsNeeded) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.hitsNeeded = hitsNeeded;
  this.radius = hitsNeeded * 10; // Radius este 10 pentru fiecare hit necesar

  // Alege culoarea în funcție de radius
  switch (this.radius) {
    case 40:
      this.strokeColor = "white";
      break;
    case 30:
      this.strokeColor = "blue";
      break;
    case 20:
      this.strokeColor = "yellow";
      break;
    case 10:
      this.strokeColor = "red";
      break;
    default:
      this.strokeColor = "white";
  }

  this.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.strokeStyle = this.strokeColor;
    ctx.stroke();
    ctx.font = "16px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.hitsNeeded, this.x, this.y); // Afișează numărul de rachete necesare
  };

  this.update = function () {
    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }
    this.x += this.dx;
    if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }
    this.y += this.dy;
    this.draw();
  };

  this.updateColorAndSize = function () {
    this.radius = this.hitsNeeded * 10; // Actualizează radius
    // Actualizează culoarea în funcție de hitsNeeded
    switch (this.hitsNeeded) {
      case 4:
        this.strokeColor = "white";
        break;
      case 3:
        this.strokeColor = "blue";
        break;
      case 2:
        this.strokeColor = "yellow";
        break;
      case 1:
        this.strokeColor = "red";
        break;
      default:
        this.strokeColor = "white";
    }
  };
  this.updateColorAndSize();
}

function detectCollision(circle1, circle2) {
  var dx = circle1.x - circle2.x;
  var dy = circle1.y - circle2.y;
  var distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < circle1.radius + circle2.radius) {
    var angle = Math.atan2(dy, dx);
    var force = 0.05;
    var forceX = Math.cos(angle) * force;
    var forceY = Math.sin(angle) * force;

    // Actualizează vitezele cercurilor după coliziune
    circle1.dx += forceX;
    circle1.dy += forceY;
    circle2.dx -= forceX;
    circle2.dy -= forceY;
  }
}

var asteroidArray = [];
for (var i = 0; i < 40; i++) {
  var hitsNeeded = Math.floor(Math.random() * 4) + 1;
  var x = Math.random() * (canvas.width - hitsNeeded * 20) + hitsNeeded * 10;
  var dx = (Math.random() - 0.5) * 0.5;
  var y = Math.random() * (canvas.height - hitsNeeded * 20) + hitsNeeded * 10;
  var dy = (Math.random() - 0.5) * 0.5;

  asteroidArray.push(new Circle(x, y, dx, dy, hitsNeeded));
}

function animate() {
  if (!gameStarted) {
    return;
  }
  if (lives <= 0) {
    cancelAnimationFrame(animationId);
    ctx.font = "50px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
    ctx.font = "25px Arial";
    ctx.fillText(
      "Scorul tău: " + totalScore,
      canvas.width / 2,
      canvas.height / 2 + 50
    );
    resetGame();
    return;
  }

  if (asteroidArray.length === 0) {
    cancelAnimationFrame(animationId);
    ctx.font = "50px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("You won!", canvas.width / 2, canvas.height / 2);
    ctx.font = "25px Arial";
    ctx.fillText(
      "Scorul tău: " + totalScore,
      canvas.width / 2,
      canvas.height / 2 + 50
    );
    document.getElementById("resetButton").style.display = "block";
    return;
  }

  animationId = requestAnimationFrame(animate);
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  for (var i = 0; i < asteroidArray.length; i++) {
    asteroidArray[i].update();
  }
  for (var i = 0; i < asteroidArray.length; i++) {
    for (var j = i + 1; j < asteroidArray.length; j++) {
      detectCollision(asteroidArray[i], asteroidArray[j]);
    }
  }
  drawShip(ship.x, ship.y, ship.a);
  for (var i = rockets.length - 1; i >= 0; i--) {
    rockets[i].update();
    rockets[i].draw();

    if (
      rockets[i].x < 0 ||
      rockets[i].x > canvas.width ||
      rockets[i].y < 0 ||
      rockets[i].y > canvas.height
    ) {
      rockets.splice(i, 1);
    }
  }
  ship.a += ship.rot;
  ship.x += ship.thrust.x;
  ship.y += ship.thrust.y;
  if (ship.x > canvas.width) {
    ship.x = 0;
  }
  if (ship.x < 0) {
    ship.x = canvas.width;
  }
  if (ship.y > canvas.height) {
    ship.y = 0;
  }
  if (ship.y < 0) {
    ship.y = canvas.height;
  }
  checkCollision();
  checkRocketCollisions();
}

animate();
