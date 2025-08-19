const canvas = document.getElementById('water-canvas');
const ctx = canvas.getContext('2d');
let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;
const padding = 20;

// Particle setup
let NUM = 800;
let particleSize = 11;
const particles = [];
function initParticles() {
  particles.length = 0;
  for (let i = 0; i < NUM; i++) {
    particles.push({
      x: Math.random() * (w - 2 * padding) + padding,
      y: Math.random() * (h / 2) + padding,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1,
      r: particleSize
    });
  }
}
initParticles();

// Physics constants
let gravityDir = "down";
const gravityStrength = 0.35;
const bounce = 0.6;
const friction = 0.995;
const interaction = 0.15;
const slothStrength = 0.03;
const maxSpeed = 10;

// Scroll interaction
let lastScroll = window.scrollY;
window.addEventListener('scroll', () => {
  const scrollAccel = window.scrollY - lastScroll;
  lastScroll = window.scrollY;

  particles.forEach(p => { 
    p.vy += -scrollAccel * 0.3;
    p.vx += (-scrollAccel * 0.5) * (Math.random() - 0.5);
  });
});

// Repulsion
const repulsionRadius = 100;
const repulsionStrength = 30;
let repulsionMode = "click";
let mouse = { x: 0, y: 0, active: false };

// Track mouse position
canvas.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  if (repulsionMode === "hover") mouse.active = true;
});
canvas.addEventListener('mouseleave', () => {
  if (repulsionMode === "hover") mouse.active = false;
});
canvas.addEventListener('click', e => {
  if (repulsionMode === "click") {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
    setTimeout(() => mouse.active = false, 150);
  }
});

// Controls
document.getElementById("particleCount").addEventListener("change", e => {
  NUM = parseInt(e.target.value);
  initParticles();
});
document.getElementById("particleSize").addEventListener("change", e => {
  particleSize = parseInt(e.target.value);
  initParticles();
});
document.getElementById("gravityDirection").addEventListener("change", e => {
  gravityDir = e.target.value;
});

// Repulsion toggle (switch)
const toggle = document.getElementById("repulsionToggle");
const label = document.getElementById("repulsionModeLabel");
toggle.addEventListener("change", e => {
  if (e.target.checked) {
    repulsionMode = "hover";
    label.textContent = "Hover";
  } else {
    repulsionMode = "click";
    label.textContent = "Click";
  }
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, w, h);

  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];

    // gravity based on direction
    if (gravityDir === "down") p.vy += gravityStrength;
    if (gravityDir === "up") p.vy -= gravityStrength;
    if (gravityDir === "left") p.vx -= gravityStrength;
    if (gravityDir === "right") p.vx += gravityStrength;

    // sloshing
    p.vx += (Math.random() - 0.5) * slothStrength;

    // clamp max speed
    const speed = Math.sqrt(p.vx*p.vx + p.vy*p.vy);
    if (speed > maxSpeed) {
      const scale = maxSpeed / speed;
      p.vx *= scale;
      p.vy *= scale;
    }

    // motion
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= friction;
    p.vy *= friction;

    // walls
    if (p.x - p.r < padding) { p.x = padding + p.r; p.vx *= -bounce; }
    if (p.x + p.r > w - padding) { p.x = w - padding - p.r; p.vx *= -bounce; }
    if (p.y - p.r < padding) { p.y = padding + p.r; p.vy *= -bounce; }
    if (p.y + p.r > h - padding) { 
      p.y = h - padding - p.r; 
      p.vy *= -bounce * 0.5;
      p.vx *= 0.7;
    }
  }

  // particle repulsion
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const p1 = particles[i], p2 = particles[j];
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      const minDist = p1.r + p2.r;
      if (dist < minDist && dist > 0) {
        let overlap = (minDist - dist) / 2;
        if (overlap > 0.5) overlap = 0.5;
        const nx = dx / dist, ny = dy / dist;
        p1.x -= nx * overlap;
        p1.y -= ny * overlap;
        p2.x += nx * overlap;
        p2.y += ny * overlap;
        p1.vx -= nx * interaction;
        p1.vy -= ny * interaction;
        p2.vx += nx * interaction;
        p2.vy += ny * interaction;
      }
    }
  }

  // Apply mouse repulsion
  if (mouse.active) {
    particles.forEach(p => {
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < repulsionRadius && dist > 0) {
        const force = (repulsionRadius - dist) / repulsionRadius * repulsionStrength;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }
    });
    if (repulsionMode === "click") mouse.active = false;
  }

  // draw
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(50,150,255,0.9)';
    ctx.fill();
  });
}
animate();

// Resize
window.addEventListener('resize', () => {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  initParticles();
});