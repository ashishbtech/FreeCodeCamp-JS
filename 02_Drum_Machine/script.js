const display = document.getElementById('display');
const pads = document.querySelectorAll('.drum-pad');
const themeToggle = document.getElementById('theme-toggle');

function playSound(element) {
  const audio = element.querySelector('.clip');
  const id = element.id;
  
  if (!audio) return;
  
  audio.currentTime = 0;
  audio.play();
  display.innerText = id.replace(/-/g, ' ');
  
  element.classList.add('active');
  setTimeout(() => element.classList.remove('active'), 100);
}

pads.forEach(pad => {
  pad.addEventListener('click', function() {
    playSound(this);
  });
});

document.addEventListener('keydown', function(event) {
  const key = event.key.toUpperCase();
  const audio = document.getElementById(key);
  
  if (audio) {
    const parentPad = audio.parentElement;
    playSound(parentPad);
  }
});

themeToggle.addEventListener('click', () => {
  const body = document.body;
  if (body.classList.contains('dark')) {
    body.classList.remove('dark');
    body.classList.add('antique');
  } else {
    body.classList.remove('antique');
    body.classList.add('dark');
  }
});