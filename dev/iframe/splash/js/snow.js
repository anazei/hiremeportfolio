/* This effect was created with the help of ChatGPT */

'use strict';

// Embedded PNG snowflake bitmaps.
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


// ======================================================
// CONFIGURATION
// ======================================================

const config = {
    snowAmount: 500,

    // Multithreading settings
    maxWorkers: 8,
    minParticlesPerWorker: 100,
    targetFPS: 60,

    // Original snow settings
    snowSize: 1,
    minScale: 1.5,
    foregroundIntervalMin: 3,
    foregroundIntervalMax: 7,
    foregroundMaxActive: 5,
    foregroundScaleMultiplier: 30,
    foregroundSpeedMultiplier: 5,
    snowZmin: 0,
    snowZmax: 1,
    snowAlphaMin: 0.1,
    snowAlphaMax: 1.0,
    gravity: 100,
    windBegin: 200,
    windForceMin: 0,
    windForceMax: 400,
    windDirection: 'right',
    windTimeMin: 3,
    windTimeMax: 6,
    margin: 200,
    intro: true,
    fade: true
};


// ======================================================
// PARTICLE SIMULATION
//
// This function is executed independently inside each
// Web Worker. It is also used by the main-thread fallback.
// ======================================================

function createSimulation(config) {

    let width = 0;
    let height = 0;

    const flakes = [];
    const foregroundFlakes = [];

    let nextForegroundBurst = 0;

    const wind = {
        force: config.windBegin
    };

    const rand = (a, b) =>
        a + Math.random() * (b - a);

    const clamp = (v, min, max) =>
        Math.min(max, Math.max(min, v));

    const easeQuadInOut = t =>
        t < 0.5
            ? 2 * t * t
            : 1 - Math.pow(-2 * t + 2, 2) / 2;


    // Calculate individual snowflake opacity.

    function alphaFor(flake) {

        const base = rand(
            config.snowAlphaMin,
            config.snowAlphaMax
        );

        if (flake.scale > 4 * config.snowSize)
            return base * 0.4;

        if (flake.scale > 2 * config.snowSize)
            return base * 0.6;

        return base;
    }


    // Recycle horizontally offscreen particles.

    function xReset(f) {

        if (f.foreground) return;

        if (f.x > width + config.margin) {
            f.x = rand(-config.margin, 0);
        }
        else if (f.x < -config.margin) {
            f.x = rand(width, width + config.margin);
        }
    }


    // Recycle vertically offscreen particles.

    function yReset(f) {

        if (f.foreground) return;

        if (f.y > height + config.margin) {
            f.y = rand(-config.margin, 0);
        }
        else if (f.y < -config.margin) {
            f.y = rand(height, height + config.margin);
        }
    }


    // Start a new horizontal movement tween.

    function snowX(f) {

        xReset(f);

        f.xFrom = f.x;

        f.xTo = f.x +
            (rand(-40, 40) + wind.force) *
            f.scale *
            (f.speedMultiplier || 1);

        f.alphaFrom = f.alpha;

        f.alphaTo = f.foreground
            ? rand(0.025, 0.095)
            : alphaFor(f);

        f.xDuration = rand(1, 3);
        f.xElapsed = 0;
    }


    // Start a new vertical movement tween.

    function snowY(f) {

        yReset(f);

        f.yFrom = f.y;

        f.yTo = f.y +
            rand(config.gravity / 2, config.gravity) *
            f.scale * 3 *
            (f.speedMultiplier || 1);

        f.yDuration = rand(1, 3);
        f.yElapsed = 0;
    }


    // Create a normal snowflake.

    function createSnow() {

        const depth = rand(
            config.snowZmin,
            config.snowZmax * 2
        );

        const scale = clamp(
            (1 / Math.max(0.05, depth) - 0.5) *
                config.snowSize,
            config.minScale,
            5
        );

        const f = {

            x: config.intro
                ? rand(
                    -config.margin * 2,
                    width / 2 - config.margin
                  )
                : rand(-config.margin * 2, width),

            y: config.intro
                ? rand(-config.margin * 2, 0)
                : rand(-config.margin * 2, height),

            scale,

            foreground: false,

            speedMultiplier: 1,

            alpha: config.fade ? 0 : 0.5,

            // Workers use image indexes instead of
            // HTML Image objects.

            image: Math.floor(Math.random() * 3)
        };

        if (!config.fade) {
            f.alpha = alphaFor(f);
        }

        snowX(f);
        snowY(f);

        flakes.push(f);
    }


    // Create a large foreground snowflake.

    function createForegroundSnow() {

        if (
            foregroundFlakes.length >=
            config.foregroundMaxActive
        ) {
            return;
        }

        const baseScale = rand(config.minScale, 2.2);

        const scale =
            baseScale * config.foregroundScaleMultiplier;

        const size = 8 * scale;

        const f = {

            foreground: true,

            speedMultiplier:
                config.foregroundSpeedMultiplier,

            x: rand(-size / 2, width + size / 2),

            y: -size / 2 -
                rand(0, Math.min(200, size / 2)),

            scale,

            alpha: rand(0.025, 0.095),

            image: Math.floor(Math.random() * 3),

            age: 0
        };

        snowX(f);
        snowY(f);

        foregroundFlakes.push(f);
    }


    function scheduleForegroundBurst() {

        nextForegroundBurst = rand(
            config.foregroundIntervalMin,
            config.foregroundIntervalMax
        );
    }


    // Update foreground snowflakes.

    function updateForeground(dt) {

        nextForegroundBurst -= dt;

        if (nextForegroundBurst <= 0) {

            const count = Math.min(
                Math.floor(rand(1, 6)),
                config.foregroundMaxActive -
                    foregroundFlakes.length
            );

            for (let i = 0; i < count; i++) {
                createForegroundSnow();
            }

            scheduleForegroundBurst();
        }

        for (
            let i = foregroundFlakes.length - 1;
            i >= 0;
            i--
        ) {

            const f = foregroundFlakes[i];

            updateFlake(f, dt);

            f.age += dt;

            const halfSize = 4 * f.scale;

            if (
                f.y > height + halfSize ||
                f.x > width + halfSize ||
                f.x < -halfSize ||
                f.age > 10
            ) {
                foregroundFlakes.splice(i, 1);
            }
        }
    }


    // ==================================================
    // INDIVIDUAL PARTICLE CALCULATIONS
    //
    // All of these calculations run in parallel workers.
    // ==================================================

    function updateFlake(f, dt) {

        f.xElapsed += dt;
        f.yElapsed += dt;

        const tx = clamp(
            f.xElapsed / f.xDuration,
            0,
            1
        );

        const ty = clamp(
            f.yElapsed / f.yDuration,
            0,
            1
        );

        const ex = easeQuadInOut(tx);

        f.x = f.xFrom +
            (f.xTo - f.xFrom) * ex;

        f.alpha = f.alphaFrom +
            (f.alphaTo - f.alphaFrom) * ex;

        f.y = f.yFrom +
            (f.yTo - f.yFrom) * ty;

        if (tx >= 1) snowX(f);

        if (ty >= 1) snowY(f);
    }


    scheduleForegroundBurst();


    // ==================================================
    // WORKER SIMULATION STEP
    //
    // Return a compact Float32Array containing only
    // the information needed to render the particles.
    //
    // Each particle occupies five floats:
    // x, y, scale, alpha, image index.
    //
    // Total: 20 bytes per particle.
    // ==================================================

    return function step(message) {

        Object.assign(config, message.config);

        width = message.width;
        height = message.height;

        wind.force = message.wind;

        // Adjust particle quantity.

        while (flakes.length < message.count) {
            createSnow();
        }

        flakes.length = message.count;


        // Update each particle.

        for (const f of flakes) {
            updateFlake(f, message.dt);
        }


        // Only one worker handles foreground particles.

        if (message.foreground) {
            updateForeground(message.dt);
        }


        const count =
            flakes.length + foregroundFlakes.length;

        const needed = count * 5 * 4;


        // Reuse existing memory where possible.

        const buffer =
            message.buffer &&
            message.buffer.byteLength >= needed

                ? message.buffer

                : new ArrayBuffer(needed);


        const data = new Float32Array(buffer);

        let i = 0;

        for (const group of [flakes, foregroundFlakes]) {

            for (const f of group) {

                data[i++] = f.x;
                data[i++] = f.y;
                data[i++] = f.scale;
                data[i++] = f.alpha;
                data[i++] = f.image;
            }
        }


        return {
            buffer,
            count,
            normalCount: flakes.length,
            frame: message.frame
        };
    };
}


// ======================================================
// MAIN THREAD - CANVAS
// ======================================================

const canvas = document.getElementById('snow');

const ctx = canvas.getContext('2d');

let width = 0;
let height = 0;
let dpr = 1;


// Global visibility is independent of particle opacity.

const visibility = {
    alpha: 1,
    from: 1,
    target: 1,
    elapsed: 0,
    duration: 0
};


// Global wind shared by all workers.

const wind = {
    force: config.windBegin,
    start: config.windBegin,
    target: config.windBegin,
    delay: 0,
    elapsed: 0,
    duration: 2,
    transitioning: false
};


const rand = (a, b) =>
    a + Math.random() * (b - a);

const clamp = (v, min, max) =>
    Math.min(max, Math.max(min, v));

const easeQuadInOut = t =>
    t < 0.5
        ? 2 * t * t
        : 1 - Math.pow(-2 * t + 2, 2) / 2;


// ======================================================
// CANVAS RESIZE
// ======================================================

function resize() {

    width = window.innerWidth;
    height = window.innerHeight;

    dpr = Math.min(
        window.devicePixelRatio || 1,
        2
    );

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener('resize', resize);

resize();


// ======================================================
// GLOBAL FADE CONTROLS
// ======================================================

function fadeOutSnowfall(duration = 0.7) {

    visibility.from = visibility.alpha;
    visibility.target = 0;

    visibility.duration = Math.max(
        0,
        Number(duration) || 0
    );

    visibility.elapsed = 0;

    if (visibility.duration === 0) {
        visibility.alpha = 0;
    }
}

window.fadeOutSnowfall = fadeOutSnowfall;


function fadeInSnowfall(duration = 0.7) {

    visibility.from = visibility.alpha;
    visibility.target = 1;

    visibility.duration = Math.max(
        0,
        Number(duration) || 0
    );

    visibility.elapsed = 0;

    if (visibility.duration === 0) {
        visibility.alpha = 1;
    }
}

window.fadeInSnowfall = fadeInSnowfall;


function updateVisibility(dt) {

    if (visibility.alpha === visibility.target) {
        return;
    }

    visibility.elapsed += dt;

    const t = visibility.duration === 0

        ? 1

        : clamp(
            visibility.elapsed / visibility.duration,
            0,
            1
          );

    visibility.alpha = visibility.from +
        (visibility.target - visibility.from) * t;
}


// ======================================================
// GLOBAL WIND CALCULATIONS
// ======================================================

function chooseNewWind() {

    let target;

    if (config.windDirection === 'right') {

        target = rand(
            config.windForceMin,
            config.windForceMax
        );
    }
    else if (config.windDirection === 'left') {

        target = -rand(
            config.windForceMin,
            config.windForceMax
        );
    }
    else {

        target = rand(
            -config.windForceMax,
            config.windForceMax
        );
    }

    wind.target = target;

    wind.delay = rand(
        config.windTimeMin,
        config.windTimeMax
    );

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
    }
    else {

        wind.elapsed += dt;

        const t = clamp(
            wind.elapsed / wind.duration,
            0,
            1
        );

        wind.force = wind.start +
            (wind.target - wind.start) * t;

        if (t >= 1) {
            chooseNewWind();
        }
    }
}


// ======================================================
// AUTOMATIC CPU CORE DETECTION
// ======================================================

const hardwareThreads = Math.max(
    1,
    Math.floor(navigator.hardwareConcurrency || 2)
);


// Reserve one logical CPU slot when selecting worker count.
// Avoid excessive workers for small particle quantities.

const workerCount = Math.max(
    1,
    Math.min(
        hardwareThreads - 1,
        config.maxWorkers,
        Math.floor(
            config.snowAmount /
            config.minParticlesPerWorker
        )
    )
);


let slots = [];

let pending = null;

let frameNumber = 0;

let workerMode = false;

let workerURL = null;

let running = false;

let rafId = null;

let lastTime = null;

let simulationTime = 0;

let displayedTime = null;

let lastDispatch = -Infinity;


// ======================================================
// WEB WORKER MANAGEMENT
// ======================================================

function releaseWorkers() {

    for (const slot of slots) {

        slot.worker?.terminate();
    }

    if (workerURL) {
        URL.revokeObjectURL(workerURL);
    }

    workerURL = null;
}


// Automatic single-thread fallback.

function useFallback(reason) {

    if (reason) {

        console.warn(
            'Snow workers unavailable; using main thread:',
            reason
        );
    }

    releaseWorkers();

    workerMode = false;

    pending = null;

    slots = [{
        step: createSimulation({...config}),
        result: null
    }];

    window.snowWorkerCount = 0;
}


// ======================================================
// CREATE WEB WORKERS
//
// The worker source code is created dynamically using
// the createSimulation function defined above.
//
// Therefore, no separate worker JavaScript file is needed.
// ======================================================

function initWorkers() {

    if (
        typeof Worker !== 'function' ||
        hardwareThreads < 2
    ) {

        useFallback();

        return;
    }


    try {

        const source = `

            const createSimulation =
                ${createSimulation.toString()};

            let step;

            self.onmessage = ({data}) => {

                if (!step) {

                    step = createSimulation({
                        ...data.config
                    });
                }

                const result = step(data);

                // Transfer ownership of the ArrayBuffer
                // rather than copying its contents.

                self.postMessage(
                    result,
                    [result.buffer]
                );
            };
        `;


        const blob = new Blob(
            [source],
            {type: 'text/javascript'}
        );

        workerURL = URL.createObjectURL(blob);


        // Create the worker pool.

        for (let i = 0; i < workerCount; i++) {

            const worker = new Worker(workerURL);

            const slot = {
                worker,
                result: null
            };

            slots.push(slot);


            // Receive the completed particle calculations.

            worker.onmessage = ({data}) => {

                if (
                    !workerMode ||
                    !pending ||
                    data.frame !== pending.frame ||
                    slot.result
                ) {
                    return;
                }

                slot.result = data;

                if (--pending.remaining === 0) {

                    finishFrame();
                }
            };


            // Handle worker errors gracefully.

            worker.onerror = e => {

                if (workerMode) {

                    useFallback(
                        e.message || 'worker error'
                    );
                }
            };


            worker.onmessageerror = () => {

                if (workerMode) {

                    useFallback('message error');
                }
            };
        }


        workerMode = true;

        window.snowWorkerCount = slots.length;

    }
    catch (error) {

        useFallback(error);
    }
}


// ======================================================
// CANVAS RENDERING
//
// All individual particle calculations have already
// been completed by the workers.
//
// The main thread only needs to draw the snowflakes.
// ======================================================

function renderResults() {

    ctx.clearRect(0, 0, width, height);


    if (visibility.alpha > 0) {

        // Pass 0: normal snowflakes.
        // Pass 1: foreground snowflakes.

        for (let pass = 0; pass < 2; pass++) {

            for (const slot of slots) {

                const r = slot.result;

                if (!r) continue;

                const a = new Float32Array(r.buffer);

                const start =
                    pass === 0 ? 0 : r.normalCount;

                const end =
                    pass === 0 ? r.normalCount : r.count;


                for (
                    let i = start * 5;
                    i < end * 5;
                    i += 5
                ) {

                    const size = 8 * a[i + 2];

                    const half = size / 2;

                    const x = a[i] - half;

                    const y = a[i + 1] - half;

                    const alpha = clamp(
                        a[i + 3] * visibility.alpha,
                        0,
                        1
                    );


                    // Skip invisible and offscreen particles.
                    // This avoids unnecessary drawImage calls.

                    if (
                        alpha <= 0 ||
                        x + size <= 0 ||
                        y + size <= 0 ||
                        x >= width ||
                        y >= height
                    ) {
                        continue;
                    }


                    const image = images[a[i + 4]];

                    if (
                        !image ||
                        !image.complete ||
                        !image.naturalWidth
                    ) {
                        continue;
                    }


                    ctx.globalAlpha = alpha;

                    ctx.drawImage(
                        image,
                        x,
                        y,
                        size,
                        size
                    );
                }
            }
        }
    }

    ctx.globalAlpha = 1;
}


// ======================================================
// WORKER FRAME SYNCHRONIZATION
// ======================================================

function finishFrame() {

    if (!pending) return;

    displayedTime = pending.time;

    pending = null;

    // Rendering occurs during the next animation frame.
}


// ======================================================
// DISTRIBUTE PARTICLES ACROSS ALL WORKERS
// ======================================================

function dispatch(dt, now) {

    const frame = ++frameNumber;

    const n = slots.length;

    pending = {
        frame,
        remaining: n,
        time: simulationTime,
        sent: now
    };


    for (let i = 0; i < n; i++) {

        const slot = slots[i];


        // Distribute particles as evenly as possible.

        const count =
            Math.floor(config.snowAmount / n) +

            (
                i < config.snowAmount % n
                    ? 1
                    : 0
            );


        // Recycle the existing ArrayBuffer.

        const buffer = slot.result?.buffer;

        slot.result = null;


        const message = {

            frame,

            count,

            // Only the first worker handles
            // large foreground snowflakes.

            foreground: i === 0,

            dt,

            width,

            height,

            wind: wind.force,

            config,

            buffer
        };


        try {

            if (workerMode) {

                slot.worker.postMessage(
                    message,
                    buffer ? [buffer] : []
                );
            }
            else {

                // Single-thread fallback.

                slot.result = slot.step(message);

                if (--pending.remaining === 0) {

                    finishFrame();
                }
            }
        }
        catch (error) {

            useFallback(error);

            break;
        }
    }
}


// ======================================================
// INITIALIZATION
// ======================================================

chooseNewWind();

initWorkers();


// ======================================================
// MAIN ANIMATION LOOP
// ======================================================

function tick(now) {

    if (!running) return;


    const dt = lastTime === null

        ? 0

        : Math.min(
            Math.max(
                (now - lastTime) / 1000,
                0
            ),
            0.05
          );


    lastTime = now;

    simulationTime += dt;


    // These global calculations are inexpensive.

    updateWind(dt);

    updateVisibility(dt);


    // Recover automatically if a worker stops responding.

    if (
        pending &&
        now - pending.sent > 2000
    ) {

        useFallback('worker response timeout');
    }


    // Wait until all workers have completed their current
    // calculations before sending another batch.
    //
    // This prevents an accumulating message queue.

    if (
        !pending &&

        now - lastDispatch >=
            1000 / Math.max(1, config.targetFPS) - 1
    ) {

        renderResults();


        const stepDT = displayedTime === null

            ? dt

            : Math.min(
                simulationTime - displayedTime,
                0.05
              );


        lastDispatch = now;


        // Send the next frame to all workers.

        dispatch(stepDT, now);
    }


    if (visibility.alpha === 0) {

        ctx.clearRect(0, 0, width, height);
    }


    rafId = requestAnimationFrame(tick);
}


// ======================================================
// PUBLIC ANIMATION CONTROLS
// ======================================================

function animateSnow() {

    // Prevent duplicate animation loops.

    if (running) return;

    running = true;

    lastTime = null;

    rafId = requestAnimationFrame(tick);
}


window.animateSnow = animateSnow;

window.startSnowfall = animateSnow;


window.stopSnowfall = function () {

    running = false;

    if (rafId !== null) {

        cancelAnimationFrame(rafId);
    }

    rafId = null;
};


window.destroySnowfall = function () {

    window.stopSnowfall();

    useFallback();

    ctx.clearRect(0, 0, width, height);
};


// Uncomment to automatically start snowfall.

// requestAnimationFrame(animateSnow);


// ======================================================
// OPTIONAL HTML CONTROLS
// ======================================================

document.getElementById('windMax')
    ?.addEventListener('input', e => {

        config.windForceMax = Number(e.target.value);

        wind.target = clamp(
            wind.target,
            -config.windForceMax,
            config.windForceMax
        );
    });


document.getElementById('gravity')
    ?.addEventListener('input', e => {

        config.gravity = Number(e.target.value);
    });


document.getElementById('quantity')
    ?.addEventListener('input', e => {

        const target = Number(e.target.value);

        if (Number.isFinite(target)) {

            config.snowAmount = Math.max(
                0,
                Math.floor(target)
            );
        }
    });
