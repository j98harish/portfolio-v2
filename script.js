// Theme toggle
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;
const loader = document.getElementById('loader');
const bgAnimation = document.querySelector('.bg-animation');
const cursorOrb = document.getElementById('cursorOrb');

// Loader
window.addEventListener('load', () => {
  setTimeout(() => {
    body.classList.add('loaded');
  }, 600);
});

// Theme logic
function setTheme(mode) {
  if (mode === 'dark') {
    body.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else if (mode === 'light') {
    body.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  } else {
    localStorage.removeItem('theme');
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      body.classList.add('dark');
    } else {
      body.classList.remove('dark');
    }
  }
}
function getTheme() {
  return localStorage.getItem('theme') || 'system';
}
// Restore three-way mode buttons
const lightBtn = document.getElementById('lightBtn');
const darkBtn = document.getElementById('darkBtn');
const systemBtn = document.getElementById('systemBtn');

function applyModeButtons(mode) {
  [lightBtn, systemBtn, darkBtn].forEach(b => b.classList.remove('active'));
  if (mode === 'light') lightBtn.classList.add('active');
  else if (mode === 'dark') darkBtn.classList.add('active');
  else systemBtn.classList.add('active');
}

lightBtn.addEventListener('click', () => { setTheme('light'); applyModeButtons('light'); resizeCanvas(); });
darkBtn.addEventListener('click', () => { setTheme('dark'); applyModeButtons('dark'); resizeCanvas(); });
systemBtn.addEventListener('click', () => { setTheme('system'); applyModeButtons('system'); resizeCanvas(); });

themeToggle && themeToggle.addEventListener('click', () => {
  const current = getTheme();
  if (current === 'dark') setTheme('light');
  else if (current === 'light') setTheme('system');
  else setTheme('dark');
});
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (getTheme() === 'system') setTheme('system');
});
setTheme(getTheme());
applyModeButtons(getTheme());

// Canvas flow background for smooth continuous motion
let canvas, ctx, width, height, flowParticles = [];
const FLOW_COUNT = 70;

function initCanvas() {
  bgAnimation.innerHTML = '';
  canvas = document.createElement('canvas');
  canvas.className = 'bg-canvas';
  bgAnimation.appendChild(canvas);
  ctx = canvas.getContext('2d');
  resizeCanvas();
}
function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  flowParticles = [];
  const dark = body.classList.contains('dark');
  for (let i=0;i<FLOW_COUNT;i++) {
    if (dark) {
      flowParticles.push({
        x: Math.random()*width,
        y: Math.random()*height,
        r: 1 + Math.random()*3,
        vx: (Math.random()-0.5) * 0.25,
        vy: (Math.random()-0.5) * 0.25,
        alpha: 0.04 + Math.random()*0.12
      });
    } else {
      // brighter / bigger particles for light mode
      flowParticles.push({
        x: Math.random()*width,
        y: Math.random()*height,
        r: 2 + Math.random()*5,
        vx: (Math.random()-0.5) * 0.9,
        vy: (Math.random()-0.5) * 0.9,
        alpha: 0.08 + Math.random()*0.22
      });
    }
  }
}

function drawFlow() {
  ctx.clearRect(0,0,width,height);
  const dark = body.classList.contains('dark');
  for (let p of flowParticles) {
    p.x += p.vx;
    p.y += p.vy;
    // wrap-around
    if (p.x < -50) p.x = width + 50;
    if (p.x > width + 50) p.x = -50;
    if (p.y < -50) p.y = height + 50;
    if (p.y > height + 50) p.y = -50;
    const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r*12);
    if (dark) {
      grad.addColorStop(0, `rgba(0,234,255,${p.alpha})`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
    } else {
      // amplify visibility in light mode
      const core = Math.min(1, p.alpha * 1.8);
      grad.addColorStop(0, `rgba(255,214,0,${core})`);
      grad.addColorStop(0.6, `rgba(255,230,150,${core*0.6})`);
      grad.addColorStop(1, 'rgba(255,255,255,0)');
    }
    ctx.fillStyle = grad;
  const radiusMult = dark ? p.r*12 : p.r*14;
  ctx.beginPath();
  ctx.arc(p.x, p.y, radiusMult, 0, Math.PI*2);
    ctx.fill();
  }
  requestAnimationFrame(drawFlow);
}

// init
initCanvas();
drawFlow();
window.addEventListener('resize', () => { resizeCanvas(); });
// Recreate flow on theme change
const observer = new MutationObserver(() => { resizeCanvas(); });
observer.observe(body, { attributes: true, attributeFilter: ['class'] });

// Cursor orb with lag
let mouseX = window.innerWidth/2, mouseY = window.innerHeight/2;
let orbX = mouseX, orbY = mouseY;
let orbVisible = false;
function animateCursorOrb() {
  // eased follow with slight rotation based on velocity
  const vx = mouseX - orbX;
  const vy = mouseY - orbY;
  orbX += vx * 0.16;
  orbY += vy * 0.16;
  const rot = Math.atan2(vy, vx) * 10;
  cursorOrb.style.transform = `translate(${orbX-20}px,${orbY-20}px) rotate(${rot}deg)`;
  if (body.classList.contains('dark')) {
    cursorOrb.style.width = '56px'; cursorOrb.style.height = '56px';
    cursorOrb.style.background = 'radial-gradient(circle at 28px 28px, rgba(0,234,255,0.95) 0%, transparent 70%)';
    cursorOrb.style.boxShadow = '0 0 48px 14px rgba(0,234,255,0.10)';
    cursorOrb.style.opacity = 1;
    cursorOrb.classList.remove('light');
  } else {
    // brighter & larger for light mode
    cursorOrb.style.width = '64px'; cursorOrb.style.height = '64px';
    cursorOrb.style.background = 'radial-gradient(circle at 32px 32px, rgba(255,214,0,0.98) 0%, transparent 70%)';
    cursorOrb.style.boxShadow = '0 0 64px 20px rgba(255,214,0,0.14)';
    cursorOrb.style.opacity = 1;
    cursorOrb.classList.add('light');
  }
  requestAnimationFrame(animateCursorOrb);
}
animateCursorOrb();
document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (!orbVisible) {
    cursorOrb.style.display = 'block';
    orbVisible = true;
  }
});
document.addEventListener('mouseleave', () => {
  cursorOrb.style.display = 'none';
  orbVisible = false;
});
document.addEventListener('mouseenter', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorOrb.style.display = 'block';
  orbVisible = true;
});
