window.onload = () => {
  const mario = document.querySelector('.mario');
  const pipe = document.querySelector('.pipe');
  const gameOver = document.querySelector('.game-over');
  const score = document.querySelector('.score');
  const highScore = document.querySelector('#high-score');

  const musicaFundo = document.getElementById('musicaFundo');
  const somPulo = document.getElementById('somPulo');
  const somGameOver = document.getElementById('somGameOver');
  const powerUp = document.getElementById('powerUp');

  // Funções para salvar e carregar cookie
  const setCookie = (name, value, days) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${date.toUTCString()};SameSite=Lax;path=/`;
  };

  const getCookie = (name) => {
    const decoded = decodeURIComponent(document.cookie);
    const cookies = decoded.split(';');
    const search = name + "=";

    for (let c of cookies) {
      while (c.charAt(0) === ' ') c = c.substring(1);
      if (c.indexOf(search) === 0) {
        return c.substring(search.length, c.length);
      }
    }
    return "";
  };

  // Variáveis do jogo
  let scoreValue = 0;
  let highScoreValue = parseInt(getCookie('high-score') || 0);
  let currentForm = 'starter';
  let loop = null;

  highScore.textContent = highScoreValue;

  // Função de pulo
  const jump = () => {
    if (!mario || !somPulo) return;

    somPulo.currentTime = 0;
    somPulo.play();

    if (gameOver.style.display === 'block' || mario.classList.contains('jump')) {
      return;
    }

    mario.classList.add('jump');
    scoreValue += 1;
    score.textContent = scoreValue;

    let newForm = '';

    if (scoreValue <= 5) {
      newForm = 'starter';
      mario.src = './images/mario-starter.gif';
    } else if (scoreValue <= 10) {
      newForm = 'beginner';
      mario.src = './images/mario-beginner.gif';
    } else {
      newForm = 'pro';
      mario.src = './images/mario-flying.gif';
    }

    if (newForm !== currentForm) {
      powerUp.currentTime = 0;
      powerUp.play();
      currentForm = newForm;
    }

    if (highScoreValue < scoreValue) {
      setCookie('high-score', scoreValue, 365);
      highScoreValue = scoreValue;
      highScore.textContent = highScoreValue;
    }

    setTimeout(() => {
      mario.classList.remove('jump');
      if (scoreValue > 10) mario.src = './images/mario-pro.gif';
    }, 500);
  };

  // Função que detecta falha
  const waitingFailure = () => {
    if (!pipe || !mario) return;

    const pipePosition = pipe.offsetLeft;
    const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

    if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 112) {
      mario.style.animationPlayState = 'paused';
      mario.style.bottom = `${marioPosition}px`;

      pipe.style.animation = 'none';
      pipe.style.left = `${pipePosition}px`;

      mario.src = './images/game-over.png';
      mario.style.width = '75px';
      mario.style.marginLeft = '50px';

      somGameOver.play();
      musicaFundo.pause();

      gameOver.style.display = 'block';

      clearInterval(loop);
      document.removeEventListener('keydown', jump);
      document.removeEventListener('touchstart', jump);
    }
  };

  // Inicia o loop de colisão
  loop = setInterval(waitingFailure, 10);

  // Reinicia o jogo
  const restartGame = () => {
    musicaFundo.currentTime = 0;
    musicaFundo.play();

    gameOver.style.display = 'none';
    mario.style.animationPlayState = 'running';
    mario.src = './images/mario-starter.gif';
    mario.style.width = '150px';
    mario.style.marginLeft = '0';
    mario.style.bottom = '0';

    pipe.style.left = 'auto';
    pipe.style.animation = 'pipe-animation 1s infinite linear';

    scoreValue = 0;
    score.textContent = scoreValue;

    document.addEventListener('keydown', jump);
    document.addEventListener('touchstart', jump);

    clearInterval(loop);
    loop = setInterval(waitingFailure, 10);
  };

  // Eventos
  document.querySelector('.retry').addEventListener('click', restartGame);
  document.addEventListener('keydown', jump);
  document.addEventListener('touchstart', jump);

  document.addEventListener('keydown', () => {
    if (musicaFundo.paused) musicaFundo.play();
  });
  document.addEventListener('touchstart', () => {
    if (musicaFundo.paused) musicaFundo.play();
  });
};
