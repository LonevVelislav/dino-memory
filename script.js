'use strict';
const gameBody = document.querySelector('.container');
const gameScreen = document.querySelector('.game-grid');
const newGameBtn = document.querySelector('.new-game-btn');
const timeElement = document.querySelector('.clock');
const gameOverScreen = document.querySelector('.game-over-screen');
const gameOverText = document.querySelector('.game-over-text');
const muteBtn = document.querySelector('.mute');
let dinos = [
  'dinos/img_1.png',
  'dinos/img_2.png',
  'dinos/img_3.png',
  'dinos/img_4.png',
  'dinos/img_5.png',
  'dinos/img_6.png',
  'dinos/img_7.png',
  'dinos/img_8.png',
  'dinos/img_9.png',
  'dinos/img_10.png',
  'dinos/img_11.png',
  'dinos/img_12.png',
  'dinos/img_1.png',
  'dinos/img_2.png',
  'dinos/img_3.png',
  'dinos/img_4.png',
  'dinos/img_5.png',
  'dinos/img_6.png',
  'dinos/img_7.png',
  'dinos/img_8.png',
  'dinos/img_9.png',
  'dinos/img_10.png',
  'dinos/img_11.png',
  'dinos/img_12.png',
];
let matches = 0;
let time = 0;
let soundOn = true;
//Mute / unmute sounds
muteBtn.addEventListener('click', function () {
  if (soundOn) {
    document.querySelector('.speaker-icon-off').classList.remove('display');
    document.querySelector('.speaker-icon-on').classList.add('display');
    soundOn = false;
  } else {
    soundOn = true;
    document.querySelector('.speaker-icon-off').classList.add('display');
    document.querySelector('.speaker-icon-on').classList.remove('display');
  }
});

//Start a new game
newGameBtn.addEventListener('click', function () {
  gameScreen.innerHTML = '';
  gameOverScreen.classList.remove('visible');
  matches = 0;
  game();
});

//Timer function
function timerStart() {
  function tick() {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    timeElement.textContent = `${min}:${sec}`;
    gameBody.dataset.time = time;
    time++;
  }
  time = 0;
  tick();
  let timer = setInterval(tick, 1000);
  //Reseting timer when pressing new game button
  newGameBtn.addEventListener('click', function () {
    clearInterval(timer);
    time = 0;
    timer = setInterval(tick, 1000);
  });

  return timer;
}

//Core game function
function game() {
  let match = false;
  const audioMatch = new Audio('./sounds/cuckoo.wav');
  const audioTap = new Audio('./sounds/draw.wav');

  //Shuffling and rendering all array pieces
  dinos = dinos
    .map(el => ({ el, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(el => el.el);
  dinos.forEach(dino => {
    const html = `<div class="card">
    <div class="card-side--front">
    
    </div>
    <div class="card-side--back">
    <img  class='dino' src="${dino}" alt="dino" />
    </div>
  </div>`;
    gameScreen.insertAdjacentHTML('afterbegin', html);
  });

  // Click and comparing logic
  gameScreen.addEventListener('click', function (e) {
    const click = e.target;
    const card = click.parentElement;
    if (card.classList.value !== 'card') return false;
    if (soundOn) {
      audioTap.play();
    }

    card.classList.add('target');
    const targets = [...document.querySelectorAll('.target')];
    if (targets.length >= 2 && match === false) {
      gameBody.style.pointerEvents = 'none';
      targets.forEach(el => {
        function removeTargets() {
          el.classList.remove('target');
          gameBody.style.pointerEvents = 'auto';
        }
        setTimeout(removeTargets, 1000);
      });
    }

    if (
      targets[0].querySelector('.dino').src ===
      targets[1]?.querySelector('.dino').src
    ) {
      match = true;
      matches++;
      console.log(matches);
      // Matching all the cards logic
      if (matches == 12) {
        const time = timeElement.textContent;
        gameOverText.textContent =
          Number(gameBody.dataset.time) >= 120
            ? `Time: ${time}, Try going below 2 minutes.`
            : `Time: ${time}, Great job time is below 2 minutes.`;

        setTimeout(() => {
          if (Number(gameBody.dataset.time) >= 120) {
            gameOverScreen.classList.add('visible');
          } else {
            gameOverScreen.classList.add('visible');
            gameOverScreen.classList.add('background-img');
            gameOverScreen.style.color = '#fff';
          }
        }, 2000);
        matches = 0;
      }
      function removeMatches() {
        targets.forEach(el => {
          el.classList.add('found');
          if (soundOn) {
            audioMatch.play();
          }
          match = false;
        });
      }
      setTimeout(removeMatches, 900);
    }
  });
}
timerStart();
game();
