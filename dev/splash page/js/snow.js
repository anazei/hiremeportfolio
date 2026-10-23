/* This effect was created with the help of ChatGPT */

'use strict';

// These are real PNG bitmaps embedded directly into the HTML (no external assets).
const SNOWFLAKE_PNGS = [
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAANCAYAAACZ3F9/AAAALHRFWHRDcmVhdGlvbiBUaW1lAEZyaSAxNiBPY3QgMjAyNiAwMToxNzo1NSAtMDUwMDk+jd0AAAAHdElNRQfqChAUMwCO5rPmAAAACXBIWXMAAArwAAAK8AFCrDSYAAAABGdBTUEAALGPC/xhBQAAANRJREFUeNq9kjsKwkAQQLN+0cJf6wctbAyInTcSvIPH8CZioQcQT2BjIQEbsfAHhgRNfAsjLNGkEgceM0n2ZTJDLOvfob7dDMOwQBpCG46wUkqdEkWkLmkEdXiCC1uYIrvvc5mI1CRNoCHPHnCTugObDxFJ12M5UIU8eJCVF9TMJmbHHthQhAqU4SJyDg6mmDJqW2YOZDZfsr7egxPXUXe5y0xpyVq+wozF+HHiDgbyFZ7IerYZLKLbN8U19KEl3bS8hDndgsQfgM2WZKs6HISz9et4AUylOhVu2CvAAAAAAElFTkSuQmCC',
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAANCAYAAACZ3F9/AAAALHRFWHRDcmVhdGlvbiBUaW1lAEZyaSAxNiBPY3QgMjAyNiAwMTo0MjowNSAtMDUwMOag5L8AAAAHdElNRQfqChAUMwJg6NLKAAAACXBIWXMAAArwAAAK8AFCrDSYAAAABGdBTUEAALGPC/xhBQAAAFBJREFUeNpjYBj+gBFd4P///wuhTAUo/Z6RkTEAXR0LkgY9KFMbSqtB6VvYbGQi16ksSGwpKH0PSr+F0uupaiO2wNGHMh+CFTAyfqCqjfQHAEpOEPvlbh7CAAAAAElFTkSuQmCC',
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAANCAYAAACZ3F9/AAAALHRFWHRDcmVhdGlvbiBUaW1lAEZyaSAxNiBPY3QgMjAyNiAwMTo0NTozMSAtMDUwMH683DYAAAAHdElNRQfqChAUMwSJi3f/AAAACXBIWXMAAArwAAAK8AFCrDSYAAAABGdBTUEAALGPC/xhBQAAAKxJREFUeNpjYBgygBGboKqqagMTE5Pk//////348ePmo0ePJqCrYUEX0NLSUufj4zNjZWVl//v37+/Pnz/zYDMcQyM3N3eXgICANBcXl+CvX7++4XIqE7oAMzMzKxsbG6eQkJAskOYC8Ymy8c+fPz+/f//+6dWrV7eBNn7//fv3T6I0Av30CkqD/fj169dgbBqZMUxiYTkCtFUPaOvHb9++Tb1169Zj0iJq0AEAomBJW2omXhgAAAAASUVORK5CYII='
];
const images = SNOWFLAKE_PNGS.map(src => {
  const img = new Image();
  img.src = src;
  return img;
});

const config = {
  snowAmount: 500,
  snowSize: 1,
  minScale: 1.5, // every normal flake is at least 1.5x
  foregroundIntervalMin: 3,
  foregroundIntervalMax: 7,
  foregroundMaxActive: 5,
  foregroundScaleMultiplier: 30,
  foregroundSpeedMultiplier: 5,
  snowZmin: 0,
  snowZmax: 1,
  snowAlphaMin: 0.1,
  snowAlphaMax: 1.0, // AS3 used 1.3; Canvas alpha is restricted to 0..1
  snowRotation: 1,
  gravity: 100,
  windBegin: 200,
  windForceMin: 0,
  windForceMax: 400,
  windDirection: 'right', // 'right', 'left', or 'both'
  windTimeMin: 3,
  windTimeMax: 6,
  margin: 200,
  intro: true,
  fade: true
};

const canvas = document.getElementById('snow');
const ctx = canvas.getContext('2d');
let width = 0, height = 0, dpr = 1;
const flakes = [];
const foregroundFlakes = [];
let nextForegroundBurst = 0;
// Global opacity is separate from particle alpha and never alters their movement.
const visibility = { alpha: 1, from: 1, target: 1, elapsed: 0, duration: 0 };
const wind = { force: config.windBegin, start: config.windBegin,
  target: config.windBegin, delay: 0, elapsed: 0, duration: 2, transitioning: false };

const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const easeQuadInOut = t => t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2, 2)/2;

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(width*dpr);
  canvas.height = Math.floor(height*dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener('resize', resize);
resize();

function alphaFor(flake) {
  const base = rand(config.snowAlphaMin, config.snowAlphaMax);
  if (flake.scale > 4 * config.snowSize) return base * 0.4;
  if (flake.scale > 2 * config.snowSize) return base * 0.6;
  return base;
}

function xReset(f) {
  if (f.foreground) return; // flybys are temporary, never recycled
  if (f.x > width + config.margin) f.x = rand(-config.margin, 0);
  else if (f.x < -config.margin) f.x = rand(width, width + config.margin);
}
function yReset(f) {
  if (f.foreground) return;
  if (f.y > height + config.margin) f.y = rand(-config.margin, 0);
  else if (f.y < -config.margin) f.y = rand(height, height + config.margin);
}

// Equivalent to AS3 snowX(): start an independent horizontal TweenLite tween.
function snowX(f) {
  xReset(f);
  f.xFrom = f.x;
  f.xTo = f.x + (rand(-40, 40) + wind.force) * f.scale * (f.speedMultiplier || 1);
  f.rotationFrom = f.rotation;
  f.rotationTo = rand(0, config.snowRotation * 900) * Math.PI/180;
  f.alphaFrom = f.alpha;
  f.alphaTo = f.foreground ? rand(0.025, 0.095) : alphaFor(f);
  f.xDuration = rand(1, 3);
  f.xElapsed = 0;
}

// Equivalent to AS3 snowY(): its own independent linear tween.
function snowY(f) {
  yReset(f);
  f.yFrom = f.y;
  f.yTo = f.y + rand(config.gravity/2, config.gravity) * f.scale * 3 * (f.speedMultiplier || 1);
  f.yDuration = rand(1, 3);
  f.yElapsed = 0;
}

function createSnow() {
  // The original code samples depth from [snowZmin, 2*snowZmax].
  const depth = rand(config.snowZmin, config.snowZmax*2);
  // Cap extreme large scales when depth is nearly zero.
  const scale = clamp((1/Math.max(0.05, depth) - 0.5) * config.snowSize, config.minScale, 5);
  const f = {
    x: config.intro ? rand(-config.margin*2, width/2-config.margin) : rand(-config.margin*2, width),
    y: config.intro ? rand(-config.margin*2, 0) : rand(-config.margin*2, height),
    scale,
    foreground: false,
    speedMultiplier: 1,
    alpha: config.fade ? 0 : 0.5,
    rotation: rand(0, 2*Math.PI),
    image: images[Math.floor(Math.random()*images.length)]
  };
  if (!config.fade) f.alpha = alphaFor(f);
  snowX(f);
  snowY(f);
  flakes.push(f);
}

// Short-lived, very close snowflakes, roughly 30x the scale of a normal flake.
// Never recycle these: remove them when they have flown past the viewport.
function createForegroundSnow() {
  if (foregroundFlakes.length >= config.foregroundMaxActive) return;
  const baseScale = rand(config.minScale, 2.2);
  const scale = baseScale * config.foregroundScaleMultiplier;
  const size = 8 * scale;
  const f = {
    foreground: true,
    speedMultiplier: config.foregroundSpeedMultiplier,
    x: rand(-size / 2, width + size / 2),
    y: -size / 2 - rand(0, Math.min(200, size / 2)),
    scale,
    alpha: rand(0.025, 0.095),
    rotation: rand(0, 2 * Math.PI),
    image: images[Math.floor(Math.random() * images.length)],
    age: 0
  };
  snowX(f);
  snowY(f);
  foregroundFlakes.push(f);
}

function scheduleForegroundBurst() {
  nextForegroundBurst = rand(config.foregroundIntervalMin, config.foregroundIntervalMax);
}

function updateForeground(dt) {
  nextForegroundBurst -= dt;
  if (nextForegroundBurst <= 0) {
    const count = Math.min(
      Math.floor(rand(1, 6)), // between 1 and 5
      config.foregroundMaxActive - foregroundFlakes.length
    );
    for (let i = 0; i < count; i++) createForegroundSnow();
    scheduleForegroundBurst();
  }
  for (let i = foregroundFlakes.length - 1; i >= 0; i--) {
    const f = foregroundFlakes[i];
    updateFlake(f, dt);
    f.age += dt;
    const halfSize = 4 * f.scale;
    // One flyby, then dispose. Age limit also handles unusual low gravity.
    if (f.y > height + halfSize || f.x > width + halfSize ||
        f.x < -halfSize || f.age > 10) {
      foregroundFlakes.splice(i, 1);
    }
  }
}

// Public control: instantly START a smooth fade to zero opacity.
// All snowflakes, gusts, and movement continue running while invisible.
function fadeOutSnowfall(duration = 0.7) {
  visibility.from = visibility.alpha;
  visibility.target = 0;
  visibility.duration = Math.max(0, Number(duration) || 0);
  visibility.elapsed = 0;
  if (visibility.duration === 0) visibility.alpha = 0;
}
window.fadeOutSnowfall = fadeOutSnowfall;

// Optional opposite control for restoring visibility.
function fadeInSnowfall(duration = 0.7) {
  visibility.from = visibility.alpha;
  visibility.target = 1;
  visibility.duration = Math.max(0, Number(duration) || 0);
  visibility.elapsed = 0;
  if (visibility.duration === 0) visibility.alpha = 1;
}
window.fadeInSnowfall = fadeInSnowfall;

function updateVisibility(dt) {
  if (visibility.alpha === visibility.target) return;
  visibility.elapsed += dt;
  const t = visibility.duration === 0 ? 1 :
    clamp(visibility.elapsed / visibility.duration, 0, 1);
  visibility.alpha = visibility.from +
    (visibility.target - visibility.from) * t;
}

function chooseNewWind() {
  // Equivalent to AS3 windRandom(): pick the target then wait 3–6 seconds.
  let target;
  if (config.windDirection === 'right') target = rand(config.windForceMin, config.windForceMax);
  else if (config.windDirection === 'left') target = -rand(config.windForceMin, config.windForceMax);
  else target = rand(-config.windForceMax, config.windForceMax);
  wind.target = target;
  wind.delay = rand(config.windTimeMin, config.windTimeMax);
  wind.duration = rand(1, 4);
  wind.elapsed = 0;
  wind.transitioning = false;
}
function updateWind(dt) {
  if (!wind.transitioning) {
    wind.delay -= dt;
    if (wind.delay <= 0) {
      wind.start = wind.force;
      wind.transitioning = true;
      wind.elapsed = 0;
    }
  } else {
    wind.elapsed += dt;
    const t = clamp(wind.elapsed / wind.duration, 0, 1);
    wind.force = wind.start + (wind.target - wind.start)*t;
    if (t >= 1) chooseNewWind();
  }
}

function updateFlake(f, dt) {
  f.xElapsed += dt;
  f.yElapsed += dt;
  const tx = clamp(f.xElapsed/f.xDuration, 0, 1);
  const ty = clamp(f.yElapsed/f.yDuration, 0, 1);
  const ex = easeQuadInOut(tx);
  f.x = f.xFrom + (f.xTo - f.xFrom)*ex;
  f.rotation = f.rotationFrom + (f.rotationTo - f.rotationFrom)*ex;
  f.alpha = f.alphaFrom + (f.alphaTo - f.alphaFrom)*ex;
  f.y = f.yFrom + (f.yTo - f.yFrom)*ty;
  if (tx >= 1) snowX(f);
  if (ty >= 1) snowY(f);
}

function render() {
  ctx.clearRect(0, 0, width, height);
  //const grad = ctx.createLinearGradient(0,0,0,height);
  //grad.addColorStop(0, '#081224'); grad.addColorStop(1, '#253850');
  //ctx.fillStyle=grad; ctx.fillRect(0,0,width,height);
  for (const f of flakes) drawFlake(f);
  for (const f of foregroundFlakes) drawFlake(f);
}

function drawFlake(f) {
    if (!f.image.complete || !f.image.naturalWidth) return;
    // Snowflake bitmap is 64x64, with a nominal 8px sprite size at scale=1.
    const size = 8*f.scale;
    ctx.save();
    ctx.globalAlpha = clamp(f.alpha * visibility.alpha, 0, 1);
    ctx.translate(f.x, f.y);
    ctx.rotate(f.rotation);
    ctx.drawImage(f.image, -size/2, -size/2, size, size);
    ctx.restore();
}

for (let i=0; i<config.snowAmount; i++) createSnow();
chooseNewWind();
scheduleForegroundBurst();
let lastTime = performance.now();
function animate(now) {
  const dt = Math.min((now-lastTime)/1000, 0.05);
  lastTime = now;
  updateWind(dt);
  for (const f of flakes) updateFlake(f,dt);
  updateForeground(dt);
  updateVisibility(dt);
  render();
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

document.getElementById('windMax')?.addEventListener('input', e => {
  config.windForceMax = Number(e.target.value);
  wind.target = clamp(wind.target, -config.windForceMax, config.windForceMax);
});
document.getElementById('gravity')?.addEventListener('input', e => config.gravity = Number(e.target.value));
document.getElementById('quantity')?.addEventListener('input', e => {
  const target = Number(e.target.value);
  while (flakes.length < target) createSnow();
  flakes.length = target;
});
