//konfiguracja i zmiennne
const canvas = document.getElementById("bird-game");
const ctx = canvas.getContext("2d");

let frames = 0;
const DEGREE = Math.PI / 180;

//ŁADOWANIE GRAFIK
const bgImg = new Image();
bgImg.src = "assets/Flappy Bird/background-day.png";

const groundImg = new Image();
groundImg.src = "assets/Flappy Bird/base.png";

//rura
const pipeImg = new Image();
pipeImg.src = "assets/Flappy Bird/pipe-green.png";

//ptak
const birdImages = [new Image(), new Image(), new Image()];
birdImages[0].src = "assets/Flappy Bird/yellowbird-downflap.png";
birdImages[1].src = "assets/Flappy Bird/yellowbird-midflap.png";
birdImages[2].src = "assets/Flappy Bird/yellowbird-upflap.png";

//ui
const messageImg = new Image();
messageImg.src = "assets/UI/message.png";

const gameOverImg = new Image();
gameOverImg.src = "assets/UI/gameover.png";

//cyfry (0-9)
const scoreImages = [];
for (let i = 0; i < 10; i++) {
  scoreImages[i] = new Image();
  scoreImages[i].src = `assets/UI/Numbers/${i}.png`;
}

//DŹWIĘKI
const SCORE_S = new Audio("assets/Sound Efects/point.wav");
const FLAP_S = new Audio("assets/Sound Efects/wing.wav");
const HIT_S = new Audio("assets/Sound Efects/hit.wav");
const SWOOSH_S = new Audio("assets/Sound Efects/swoosh.wav");
const DIE_S = new Audio("assets/Sound Efects/die.wav");

//STANY GRY
const state = {
  current: 0,
  getReady: 0,
  game: 1,
  falling: 2,
  over: 3,
};

//STEROWANIE
function handleInput(evt) {
  const type = evt.type;
  const code = evt.code;

  if (type === "click" || (type === "keydown" && code === "Space")) {
    switch (state.current) {
      case state.getReady:
        state.current = state.game;
        SWOOSH_S.play();
        break;
      case state.game:
        bird.flap();
        FLAP_S.play();
        break;
      case state.over:
        //restart
        bird.speedReset();
        pipes.reset();
        score.reset();
        frames = 0;
        state.current = state.getReady;
        break;
    }
  }
}
document.addEventListener("keydown", handleInput);
canvas.addEventListener("click", handleInput);

//OBIEKTY GRY

//tablica wyników
const scoreBoard = {
  load: function () {
    const saved = localStorage.getItem("flappy_highscores");
    return saved ? JSON.parse(saved) : [];
  },
  save: function (newScore) {
    let scores = this.load();
    scores.push(newScore);
    scores.sort((a, b) => b - a); //malejąco
    scores = scores.slice(0, 5); //top 5
    localStorage.setItem("flappy_highscores", JSON.stringify(scores));
  },
  draw: function () {
    if (state.current === state.over) {
      const scores = this.load();
      ctx.fillStyle = "#FFF";
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 1;
      ctx.font = "20px Arial";
      ctx.textAlign = "center";

      ctx.fillText("Top 5 wyników:", canvas.width / 2, 235);

      scores.forEach((s, index) => {
        ctx.fillText(`${index + 1}. ${s}`, canvas.width / 2, 265 + index * 25);
      });
      ctx.textAlign = "start";
    }
  },
};

const bg = {
  draw: function () {
    ctx.drawImage(bgImg, 0, canvas.height - 512);
    ctx.drawImage(bgImg, 288, canvas.height - 512);
  },
};

const fg = {
  h: 112,
  x: 0,
  dx: 2,
  draw: function () {
    ctx.drawImage(groundImg, this.x, canvas.height - this.h);
    ctx.drawImage(groundImg, this.x + 336, canvas.height - this.h);
  },
  update: function () {
    //ziemia rusza się tylko gdy trwa gra
    if (state.current === state.getReady || state.current === state.game) {
      this.x = (this.x - this.dx) % 336;
    }
  },
};

const bird = {
  x: 50,
  y: 150,
  w: 34,
  h: 24,
  radius: 12,
  frame: 0,
  gravity: 0.25,
  jump: 4.6,
  speed: 0,
  rotation: 0,

  draw: function () {
    let currentImg = birdImages[this.frame];

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.drawImage(currentImg, -this.w / 2, -this.h / 2, this.w, this.h);
    ctx.restore();
  },

  flap: function () {
    this.speed = -this.jump;
  },

  update: function () {
    //szybkość machania szkrzydeł
    const period = state.current === state.getReady ? 10 : 5;
    this.frame += frames % period === 0 ? 1 : 0;
    this.frame = this.frame % birdImages.length;

    if (state.current === state.getReady) {
      this.y = 150;
      this.rotation = 0;
    } else {
      //fizyka
      this.speed += this.gravity;
      this.y += this.speed;

      //kolizja z ziemią
      if (this.y + this.h / 2 >= canvas.height - fg.h) {
        this.y = canvas.height - fg.h - this.h / 2;

        if (state.current === state.game || state.current === state.falling) {
          if (state.current === state.game) DIE_S.play();

          state.current = state.over;
          scoreBoard.save(score.value);
        }
      }

      //rotacja
      if (this.speed >= this.jump) {
        this.rotation = 90 * DEGREE;
        this.frame = 1;
      } else {
        this.rotation = -25 * DEGREE;
      }
    }
  },
  speedReset: function () {
    this.speed = 0;
    this.rotation = 0;
  },
};

const pipes = {
  position: [],
  w: 52,
  h: 320,
  gap: 100,
  dx: 2,

  draw: function () {
    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i];
      let topY = p.y;
      let bottomY = p.y + this.h + this.gap;

      //górna rura (odbita)
      ctx.save();
      ctx.translate(p.x, topY + this.h);
      ctx.scale(1, -1);
      ctx.drawImage(pipeImg, 0, 0, this.w, this.h);
      ctx.restore();

      //dolna rura
      ctx.drawImage(pipeImg, p.x, bottomY, this.w, this.h);
    }
  },

  update: function () {
    if (state.current !== state.game) return;

    //rura co 100 klatek
    if (frames % 100 === 0) {
      this.position.push({
        x: canvas.width,
        y: -260 + Math.random() * 160,
      });
    }

    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i];
      let bottomPipeY = p.y + this.h + this.gap;

      //kolizja z ptakiem
      if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w) {
        if (
          bird.y - bird.radius < p.y + this.h ||
          bird.y + bird.radius > bottomPipeY
        ) {
          state.current = state.falling;
          HIT_S.play();
        }
      }

      p.x -= this.dx;

      //usuwanie rury
      if (p.x + this.w <= 0) {
        this.position.shift();
        score.value++;
        SCORE_S.play();
        score.best = Math.max(score.value, score.best);
      }
    }
  },
  reset: function () {
    this.position = [];
  },
};

const score = {
  best: localStorage.getItem("flappy_best_single") || 0,
  value: 0,

  draw: function () {
    //wyświetlanie wyniku za pomocą numbers w assets
    if (state.current === state.game || state.current === state.falling) {
      let scoreStr = this.value.toString();

      //prawy górny wynik
      let digitWidth = 24;
      let totalWidth = scoreStr.length * digitWidth;
      let startX = canvas.width - totalWidth - 15;
      let y = 50;

      for (let i = 0; i < scoreStr.length; i++) {
        let num = parseInt(scoreStr[i]);
        ctx.drawImage(scoreImages[num], startX + i * digitWidth, y);
      }
    } else if (state.current === state.over) {
      //wynik tekstowy na ekranie końcowym
      ctx.fillStyle = "#FFF";
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 1;
      ctx.font = "25px Arial";
      ctx.fillText("Wynik: " + this.value, 85, 185);
      ctx.strokeText("Wynik: " + this.value, 85, 185);

      scoreBoard.draw();
    }
  },
  reset: function () {
    this.value = 0;
  },
};

const getReady = {
  draw: function () {
    if (state.current === state.getReady) {
      ctx.drawImage(messageImg, canvas.width / 2 - 184 / 2, 100);
    }
  },
};

const gameOver = {
  draw: function () {
    if (state.current === state.over) {
      ctx.drawImage(gameOverImg, canvas.width / 2 - 192 / 2, 80);

      //instrukcje restartu
      ctx.fillStyle = "#000";
      ctx.font = "20px Arial";
      ctx.textAlign = "center";
      ctx.fillText("SPACJA = Restart", canvas.width / 2, 400);
      ctx.textAlign = "start";
    }
  },
};

//GŁÓWNA PĘTLA GRY
function draw() {
  ctx.fillStyle = "#70c5ce";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  bg.draw();
  pipes.draw();
  fg.draw();
  bird.draw();
  getReady.draw();
  gameOver.draw();
  score.draw();
}

function update() {
  bird.update();
  fg.update();
  pipes.update();
}

function loop() {
  update();
  draw();
  frames++;
  requestAnimationFrame(loop);
}

loop();

function stopGame() {
  console.log("Czyszczenie gry...");

  document.removeEventListener("keydown", handleInput);
  canvas.removeEventListener("click", handleInput);

  alert("Gra zatrzymana. Listenery usunięte. Odśwież stronę, aby zagrać.");
}

//listener na esc
document.addEventListener("keydown", function (evt) {
  if (evt.code === "Escape") {
    stopGame();
  }
});
