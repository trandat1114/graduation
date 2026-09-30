const envelopeButton = document.querySelector('#envelopeButton');
const invitation = document.querySelector('#invitation');
const musicToggle = document.querySelector('#musicToggle');
const musicLabel = document.querySelector('#musicLabel');
const rsvpButton = document.querySelector('#rsvpButton');
const rsvpDialog = document.querySelector('#rsvpDialog');
const dialogClose = document.querySelector('#dialogClose');
const snowLayer = document.querySelector('#snowLayer');

let audioContext;
let masterGain;
let melodyTimer;
let isPlaying = false;
let noteIndex = 0;

function createSnowfall() {
  const snowflakeCount = 42;
  for (let index = 0; index < snowflakeCount; index += 1) {
    const snowflake = document.createElement('span');
    snowflake.className = 'snowflake';
    snowflake.style.setProperty('--left', `${Math.random() * 100}%`);
    snowflake.style.setProperty('--size', `${2 + Math.random() * 5}px`);
    snowflake.style.setProperty('--opacity', `${0.25 + Math.random() * 0.6}`);
    snowflake.style.setProperty('--duration', `${9 + Math.random() * 13}s`);
    snowflake.style.setProperty('--delay', `${Math.random() * -18}s`);
    snowLayer.appendChild(snowflake);
  }
}

const melody = [261.63, 329.63, 392, 329.63, 293.66, 349.23, 440, 349.23, 261.63, 329.63, 392, 523.25];

createSnowfall();

function playNote(frequency, startTime, duration = 0.8) {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = 'triangle';
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(0.065, startTime + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  oscillator.connect(gain).connect(masterGain);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.05);
}

function scheduleMelody() {
  if (!isPlaying) return;
  playNote(melody[noteIndex], audioContext.currentTime, 1.1);
  noteIndex = (noteIndex + 1) % melody.length;
  melodyTimer = window.setTimeout(scheduleMelody, 620);
}

function toggleMusic() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioContext.createGain();
    masterGain.gain.value = 0.45;
    masterGain.connect(audioContext.destination);
  }

  if (isPlaying) {
    isPlaying = false;
    window.clearTimeout(melodyTimer);
    musicToggle.classList.remove('is-playing');
    musicLabel.textContent = 'Bật nhạc';
  } else {
    isPlaying = true;
    audioContext.resume();
    musicToggle.classList.add('is-playing');
    musicLabel.textContent = 'Tắt nhạc';
    scheduleMelody();
  }
}

envelopeButton.addEventListener('click', () => {
  const isOpen = envelopeButton.classList.toggle('is-open');
  envelopeButton.setAttribute('aria-label', isOpen ? 'Đóng thư mời tốt nghiệp' : 'Mở thư mời tốt nghiệp');
  if (isOpen) {
    window.setTimeout(() => invitation.scrollIntoView({ behavior: 'smooth', block: 'start' }), 850);
  }
});

musicToggle.addEventListener('click', toggleMusic);
rsvpButton.addEventListener('click', () => rsvpDialog.showModal());
dialogClose.addEventListener('click', () => rsvpDialog.close());
rsvpDialog.addEventListener('click', (event) => {
  if (event.target === rsvpDialog) rsvpDialog.close();
});
