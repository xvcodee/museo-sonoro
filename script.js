const playButton = document.querySelector('#play-button');
const status = document.querySelector('#sound-status');
const texture = document.querySelector('#texture');
const frequency = document.querySelector('#frequency');
const frequencyOutput = document.querySelector('#frequency-output');
const consolePanel = document.querySelector('.sound-console');
let audioContext;
let masterGain;
let activeSources = [];
let toneNodes = [];
let lfo;

function setSoundState(playing) {
  playButton.setAttribute('aria-pressed', String(playing));
  playButton.querySelector('.play-icon').textContent = playing ? 'Ⅱ' : '▶';
  playButton.querySelector('.play-label').textContent = playing ? 'Pausar' : 'Escuchar';
  status.textContent = playing ? 'SONANDO' : 'EN PAUSA';
  consolePanel.classList.toggle('is-playing', playing);
}

function addTone(type, ratio = 1, volume = 0.6, detune = 0) {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = type;
  oscillator.frequency.value = Number(frequency.value) * ratio;
  oscillator.detune.value = detune;
  gain.gain.value = volume;
  oscillator.connect(gain).connect(masterGain);
  oscillator.start();
  activeSources.push(oscillator);
  toneNodes.push(oscillator);
}

function addNoise(volume = 0.16, filterFrequency = 1200) {
  const seconds = 2;
  const buffer = audioContext.createBuffer(1, audioContext.sampleRate * seconds, audioContext.sampleRate);
  const data = buffer.getChannelData(0);
  for (let index = 0; index < data.length; index += 1) data[index] = Math.random() * 2 - 1;
  const source = audioContext.createBufferSource();
  const filter = audioContext.createBiquadFilter();
  const gain = audioContext.createGain();
  source.buffer = buffer;
  source.loop = true;
  filter.type = 'bandpass';
  filter.frequency.value = filterFrequency;
  filter.Q.value = 0.7;
  gain.gain.value = volume;
  source.connect(filter).connect(gain).connect(masterGain);
  source.start();
  activeSources.push(source);
}

function startSound() {
  audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
  masterGain = audioContext.createGain();
  masterGain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  masterGain.gain.exponentialRampToValueAtTime(0.11, audioContext.currentTime + 0.45);
  masterGain.connect(audioContext.destination);
  activeSources = [];
  toneNodes = [];

  const sound = texture.value;
  if (sound === 'viento') {
    addTone('sine', 0.5, 0.32, -7);
    addTone('sine', 1.5, 0.22, 7);
    addNoise(0.035, 680);
  } else if (sound === 'lluvia') {
    addNoise(0.22, 2200);
    addTone('sine', 0.25, 0.15);
  } else {
    addTone(sound, 1, 0.72);
    if (sound === 'sawtooth') addTone('triangle', 0.5, 0.14);
    if (sound === 'square') addTone('sine', 2, 0.12);
  }

  lfo = audioContext.createOscillator();
  const lfoGain = audioContext.createGain();
  lfo.frequency.value = sound === 'lluvia' ? 0.7 : 0.12;
  lfoGain.gain.value = sound === 'square' ? 10 : 4;
  toneNodes.forEach(tone => lfoGain.connect(tone.frequency));
  lfo.connect(lfoGain);
  lfo.start();
  activeSources.push(lfo);
  setSoundState(true);
}

function stopSound() {
  masterGain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.25);
  activeSources.forEach(source => source.stop(audioContext.currentTime + 0.28));
  activeSources = [];
  toneNodes = [];
  setSoundState(false);
}

playButton.addEventListener('click', () => activeSources.length ? stopSound() : startSound());
texture.addEventListener('change', () => { if (activeSources.length) { stopSound(); startSound(); } });
frequency.addEventListener('input', () => {
  frequencyOutput.value = `${frequency.value} Hz`;
  frequencyOutput.textContent = `${frequency.value} Hz`;
  toneNodes.forEach((tone, index) => tone.frequency.setTargetAtTime(Number(frequency.value) * (index === 0 ? 1 : 1.5), audioContext.currentTime, 0.05));
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
  navigation.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));
