const playButton = document.querySelector('#play-button');
const status = document.querySelector('#sound-status');
const texture = document.querySelector('#texture');
const frequency = document.querySelector('#frequency');
const frequencyOutput = document.querySelector('#frequency-output');
const consolePanel = document.querySelector('.sound-console');
let audioContext;
let oscillator;
let gain;

function setSoundState(playing) {
  playButton.setAttribute('aria-pressed', String(playing));
  playButton.querySelector('.play-icon').textContent = playing ? 'Ⅱ' : '▶';
  playButton.querySelector('.play-label').textContent = playing ? 'Pausar' : 'Escuchar';
  status.textContent = playing ? 'SONANDO' : 'EN PAUSA';
  consolePanel.classList.toggle('is-playing', playing);
}

function startSound() {
  audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
  oscillator = audioContext.createOscillator();
  gain = audioContext.createGain();
  oscillator.type = texture.value;
  oscillator.frequency.value = frequency.value;
  gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.065, audioContext.currentTime + 0.35);
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start();
  setSoundState(true);
}

function stopSound() {
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.2);
  oscillator.stop(audioContext.currentTime + 0.23);
  oscillator = null;
  setSoundState(false);
}

playButton.addEventListener('click', () => oscillator ? stopSound() : startSound());
texture.addEventListener('change', () => { if (oscillator) oscillator.type = texture.value; });
frequency.addEventListener('input', () => {
  frequencyOutput.value = `${frequency.value} Hz`;
  frequencyOutput.textContent = `${frequency.value} Hz`;
  if (oscillator) oscillator.frequency.setTargetAtTime(frequency.value, audioContext.currentTime, 0.04);
});

document.querySelectorAll('.room').forEach(room => {
  room.addEventListener('click', () => room.classList.toggle('selected'));
  room.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); room.click(); } });
});

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!open));
  navigation.classList.toggle('open', !open);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navigation.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false');
}));
