/* Audio visualizer: worker-based Canvas 2D
   with automatic fallback. */

var spectrumCanvas = document.getElementById(
    'audioVisualizerBinCanvas'
);

var spectrumContext = null;

var audioContext, analyser, frequencyData;

var currentAudioState = 'playing';

var music = new AudioManager();

var currentAudioTrack = '';

var unlock = false;


// ======================================================
// CONFIGURATION
// ======================================================

var visualizerConfig = {

    useWorker: true,

    targetFPS: 60,

    maxParticles: 6000

};


// ======================================================
// CANVAS RENDERING ENGINE
//
// This function is shared by the worker and the
// main-thread fallback.
//
// It has no dependencies on the DOM, EaselJS,
// or external variables.
// ======================================================

function createVisualizerRenderer(canvas, options) {

    var ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('Canvas 2D unavailable');
    }

    var particles = [];
    var pool = [];

    var small = false;

    var lastTime = null;
    var accumulator = 0;

    var heights = new Float32Array(600);

    var limit = options.maxParticles;

    var color = '#A4C5D9';


    // ==================================================
    // PARTICLE POOL
    // ==================================================

    function initPool() {

        while (pool.length < 250) {

            pool.push({});

        }
    }

    initPool();


    // ==================================================
    // PARTICLE EMITTER
    // ==================================================

    function emit(x, y, h) {

        if (
            h <= 10 ||
            particles.length >= limit
        ) {
            return;
        }

        var p = pool.pop() || {};

        p.originalAlpha =
            128 + Math.random() * 127;

        p.radius =
            Math.round(Math.random() * 5) + 1;

        p.age = 0;

        p.life = Math.ceil(
            90 + (h - 10) * 90 / 117.5
        );

        p.speed = Math.ceil(
            1 + (h - 10) * 4 / 117.5
        );

        p.startX = x;

        p.startY = y;

        particles.push(p);
    }


    // ==================================================
    // CANVAS RESIZE
    // ==================================================

    function resize(w, h, compact) {

        w = Math.max(1, Math.round(w));

        h = Math.max(1, Math.round(h));

        if (
            canvas.width !== w ||
            canvas.height !== h ||
            small !== compact
        ) {

            while (particles.length) {

                pool.push(particles.pop());

            }
        }

        if (canvas.width !== w) {

            canvas.width = w;

        }

        if (canvas.height !== h) {

            canvas.height = h;

        }

        small = compact;
    }


    // ==================================================
    // MAIN VISUALIZER RENDERING FUNCTION
    //
    // All calculations and rendering in this function
    // execute inside the Web Worker when supported.
    // ==================================================

    function frame(bins, now) {

        var count = small ? 600 : 150;

        var spacing = small ? 12 : 6;

        var barWidth = small ? 8 : 3;

        var sparkle = small ? 16 : 7;

        var size = small ? 2 : 1;

        var w = canvas.width;

        var h = canvas.height;

        var i, p, v, radius, x, y;


        // Preserve the original doubled bar spacing
        // (shape offset + rectangle offset).
        //
        // Do not calculate bars beyond canvas width.

        count = Math.min(
            count,
            Math.ceil(w / spacing)
        );


        // ==============================================
        // CALCULATE FREQUENCY BAR HEIGHTS
        // ==============================================

        for (i = 0; i < count; i++) {

            v = i < bins.length ? bins[i] : 0;

            heights[i] = v > 0
                ? v * 0.25
                : 1;

        }


        // ==============================================
        // FIXED 60 HZ PARTICLE SIMULATION
        //
        // Particle movement is independent of the
        // actual visualizer rendering frame rate.
        // ==============================================

        accumulator += lastTime === null

            ? 1

            : Math.min(
                3,
                Math.max(
                    0,
                    (now - lastTime) * 0.06
                )
            );

        lastTime = now;


        while (accumulator >= 1) {

            accumulator -= 1;


            // ==========================================
            // GENERATE NEW PARTICLES
            // ==========================================

            for (i = 0; i < count; i++) {

                if (
                    heights[i] > 10 &&
                    Math.round(Math.random() * 15) === 0
                ) {

                    emit(
                        i * spacing + 7,
                        h - heights[i],
                        heights[i]
                    );

                }
            }


            // ==========================================
            // UPDATE EXISTING PARTICLES
            //
            // Stable in-place array compaction.
            //
            // Eliminates splice() and array shifting.
            // ==========================================

            var write = 0;

            for (i = 0; i < particles.length; i++) {

                p = particles[i];


                // Recycle expired particles.

                if (p.age >= p.life) {

                    pool.push(p);

                    continue;

                }


                // Calculate particle opacity.

                p.alpha = Math.min(
                    1,
                    (p.life / p.originalAlpha) *
                    (p.life - p.age) / 255
                );


                // Calculate particle speed.

                p.speed +=
                    Math.round(Math.random() * 10) * 0.1;


                // Calculate X and Y position.

                p.x = Math.round(
                    p.startX + 0.0008 * p.speed
                );

                p.y = Math.round(
                    p.startY - p.speed
                );


                // Increase particle age.

                p.age++;


                // Retain active particle.

                particles[write++] = p;

            }

            particles.length = write;
        }


        // ==============================================
        // CLEAR CANVAS
        // ==============================================

        ctx.clearRect(0, 0, w, h);

        ctx.fillStyle = color;


        // ==============================================
        // DRAW FREQUENCY BARS
        //
        // Native Canvas 2D replaces EaselJS shapes.
        // ==============================================

        ctx.globalAlpha = 0.9;

        for (i = 0; i < count; i++) {

            ctx.fillRect(

                i * spacing,

                h - heights[i],

                barWidth,

                heights[i]

            );

        }


        // ==============================================
        // DRAW PARTICLES
        // ==============================================

        for (i = 0; i < particles.length; i++) {

            p = particles[i];


            // Random sparkle effect.

            radius =
                Math.round(Math.random() * 10) >= 6

                ? Math.round(
                    Math.random() * sparkle
                  )

                : p.radius * size;


            x = p.x;

            y = p.y;


            // Skip invisible and offscreen particles.
            //
            // Avoids unnecessary canvas drawing.

            if (

                !radius ||

                !p.alpha ||

                x + radius <= 0 ||

                x - radius >= w ||

                y + radius <= 0 ||

                y - radius >= h

            ) {

                continue;

            }


            // Draw particle using native Canvas 2D.

            ctx.globalAlpha = p.alpha;

            ctx.beginPath();

            ctx.arc(
                x,
                y,
                radius,
                0,
                Math.PI * 2
            );

            ctx.fill();

        }


        // Restore default alpha.

        ctx.globalAlpha = 1;

    }


    // Public renderer methods.

    return {

        frame: frame,

        resize: resize,

        initPool: initPool

    };

}


// ======================================================
// EMBEDDED WEB WORKER
//
// This function is converted into a worker script.
// No separate JavaScript file is required.
// ======================================================

function visualizerWorkerMain() {

    var renderer;


    self.onmessage = function (event) {

        var m = event.data;

        try {


            // ==========================================
            // TEST OFFSCREEN CANVAS SUPPORT
            // ==========================================

            if (m.type === 'probe') {

                var probe = new OffscreenCanvas(1, 1);

                if (!probe.getContext('2d')) {

                    throw new Error(
                        'Worker 2D unavailable'
                    );

                }

                self.postMessage({

                    type: 'supported'

                });

            }


            // ==========================================
            // INITIALIZE OFFSCREEN CANVAS
            // ==========================================

            else if (m.type === 'init') {

                renderer = createVisualizerRenderer(

                    m.canvas,

                    m.options

                );

                self.postMessage({

                    type: 'ready'

                });

            }


            // ==========================================
            // CALCULATE AND RENDER FRAME
            // ==========================================

            else if (m.type === 'frame') {

                renderer.resize(

                    m.width,

                    m.height,

                    m.small

                );

                renderer.frame(

                    m.bins,

                    m.now

                );


                // Notify main thread that rendering
                // has completed.

                self.postMessage({

                    type: 'done'

                });

            }


            // ==========================================
            // INITIALIZE PARTICLE POOL
            // ==========================================

            else if (m.type === 'pool') {

                renderer.initPool();

            }

        }

        catch (error) {

            self.postMessage({

                type: 'error',

                message: String(error)

            });

        }

    };

}


// ======================================================
// MAIN THREAD - WORKER MANAGEMENT
// ======================================================

var visualizerWorker = null;

var visualizerURL = null;

var visualizerRenderer = null;

var visualizerTransferred = false;

var visualizerBusy = false;

var visualizerRunning = false;

var visualizerMode = 'initializing';

var visualizerTimer = null;

var visualizerRAF = null;

var visualizerLastFrame = -Infinity;

var visualizerWidth = spectrumCanvas.width;

var visualizerHeight = spectrumCanvas.height;


// ======================================================
// SET VISUALIZER MODE
// ======================================================

function setVisualizerMode(mode) {

    visualizerMode = mode;

    window.audioVisualizerMode = mode;

}


// ======================================================
// CLEAR WORKER TIMEOUT
// ======================================================

function clearVisualizerTimer() {

    clearTimeout(visualizerTimer);

    visualizerTimer = null;

}


// ======================================================
// AUTOMATIC BACKWARDS COMPATIBILITY
//
// If OffscreenCanvas is unavailable or the worker fails,
// use the same rendering engine on the main thread.
// ======================================================

function fallbackVisualizer(reason) {

    clearVisualizerTimer();


    // Terminate existing worker.

    if (visualizerWorker) {

        visualizerWorker.terminate();

    }


    // Release embedded worker URL.

    if (visualizerURL) {

        URL.revokeObjectURL(visualizerURL);

    }

    visualizerWorker = null;

    visualizerURL = null;

    visualizerBusy = false;


    // Once a canvas has been transferred to a worker,
    // it cannot regain a main-thread rendering context.
    //
    // Replace the HTML canvas if necessary.

    if (visualizerTransferred) {

        var replacement =
            spectrumCanvas.cloneNode(false);

        replacement.width = visualizerWidth;

        replacement.height = visualizerHeight;

        spectrumCanvas.parentNode.replaceChild(

            replacement,

            spectrumCanvas

        );

        spectrumCanvas = replacement;

        visualizerTransferred = false;

    }


    // Initialize native main-thread rendering.

    spectrumContext =
        spectrumCanvas.getContext('2d');

    visualizerRenderer =
        createVisualizerRenderer(

            spectrumCanvas,

            visualizerConfig

        );

    setVisualizerMode('main-thread');


    if (reason) {

        console.warn(

            'Visualizer fallback:',

            reason

        );

    }

}


// ======================================================
// INITIALIZE VISUALIZER
// ======================================================

function initVisualizer() {

    setVisualizerMode('initializing');


    // ==============================================
    // CHECK BROWSER COMPATIBILITY
    // ==============================================

    if (

        !visualizerConfig.useWorker ||

        typeof Worker !== 'function' ||

        typeof spectrumCanvas
            .transferControlToOffscreen !== 'function'

    ) {

        fallbackVisualizer();

        return;

    }


    try {


        // ==========================================
        // CREATE EMBEDDED WORKER JAVASCRIPT
        // ==========================================

        var source =

            createVisualizerRenderer.toString() +

            '\n(' +

            visualizerWorkerMain.toString() +

            ')();';


        var blob = new Blob(

            [source],

            {

                type: 'text/javascript'

            }

        );


        visualizerURL =
            URL.createObjectURL(blob);


        visualizerWorker =
            new Worker(visualizerURL);


        // ==========================================
        // HANDLE WORKER ERRORS
        // ==========================================

        visualizerWorker.onerror = function (e) {

            fallbackVisualizer(

                e.message || 'Worker error'

            );

        };


        visualizerWorker.onmessageerror =
            function () {

                fallbackVisualizer(
                    'Worker message error'
                );

            };


        // ==========================================
        // RECEIVE WORKER MESSAGES
        // ==========================================

        visualizerWorker.onmessage =
            function (event) {

                var m = event.data;


                // Worker successfully tested its own
                // OffscreenCanvas 2D context.

                if (m.type === 'supported') {

                    try {

                        visualizerWidth =
                            spectrumCanvas.width;

                        visualizerHeight =
                            spectrumCanvas.height;


                        // Transfer the actual visible
                        // HTML canvas to the worker.

                        var offscreen = spectrumCanvas
                            .transferControlToOffscreen();

                        visualizerTransferred = true;


                        visualizerWorker.postMessage(

                            {

                                type: 'init',

                                canvas: offscreen,

                                options: visualizerConfig

                            },

                            [offscreen]

                        );

                    }

                    catch (e) {

                        fallbackVisualizer(e);

                    }

                }


                // Worker is ready to start rendering.

                else if (m.type === 'ready') {

                    clearVisualizerTimer();

                    setVisualizerMode('worker');

                }


                // Worker finished rendering a frame.

                else if (m.type === 'done') {

                    clearVisualizerTimer();

                    visualizerBusy = false;

                }


                // Worker encountered an error.

                else if (m.type === 'error') {

                    fallbackVisualizer(m.message);

                }

            };


        // ==========================================
        // INITIALIZATION TIMEOUT
        // ==========================================

        visualizerTimer = setTimeout(

            function () {

                fallbackVisualizer(
                    'Worker initialization timed out'
                );

            },

            5000

        );


        // Test worker canvas support before transferring
        // the actual HTML canvas.

        visualizerWorker.postMessage({

            type: 'probe'

        });

    }

    catch (e) {

        fallbackVisualizer(e);

    }

}


// ======================================================
// RESIZE VISUALIZER
//
// Use this function instead of directly modifying
// spectrumCanvas.width and spectrumCanvas.height
// after the canvas has been transferred.
// ======================================================

function resizeAudioVisualizer(width, height) {

    if (
        Number.isFinite(width) &&
        width > 0
    ) {

        visualizerWidth = Math.round(width);

    }

    if (
        Number.isFinite(height) &&
        height > 0
    ) {

        visualizerHeight = Math.round(height);

    }


    // Only directly resize the HTML canvas if it
    // has not been transferred to a worker.

    if (!visualizerTransferred) {

        spectrumCanvas.width = visualizerWidth;

        spectrumCanvas.height = visualizerHeight;

    }

}


// ======================================================
// PUBLIC PARTICLE POOL INITIALIZATION
//
// Retained for backwards compatibility.
// ======================================================

function initParticlePool() {

    if (visualizerRenderer) {

        visualizerRenderer.initPool();

    }

    if (visualizerMode === 'worker') {

        visualizerWorker.postMessage({

            type: 'pool'

        });

    }

}


// ======================================================
// DRAW RECTANGLES
//
// Retains original public function name.
//
// Sends frequency information to the worker.
// All calculations and rendering happen in the worker.
// ======================================================

function drawRectangles(now) {


    // Do not queue additional frames while the
    // worker is still processing the previous frame.

    if (

        visualizerMode === 'initializing' ||

        visualizerBusy

    ) {

        return;

    }


    // In fallback mode, allow external code to
    // continue resizing the original HTML canvas.

    if (!visualizerTransferred) {

        visualizerWidth = spectrumCanvas.width;

        visualizerHeight = spectrumCanvas.height;

    }


    // Maintain the original mobile layout detection.

    var small =
        document.documentElement.clientHeight < 500;


    var bins = frequencyData || [];


    now = typeof now === 'number'

        ? now

        : performance.now();


    // ==============================================
    // WORKER MODE
    // ==============================================

    if (visualizerMode === 'worker') {

        visualizerBusy = true;

        try {


            // Send frequency data to worker.
            //
            // Structured clone is used instead of
            // transferring ownership, because the
            // AudioManager may reuse its own buffer.

            visualizerWorker.postMessage({

                type: 'frame',

                bins: bins,

                now: now,

                width: visualizerWidth,

                height: visualizerHeight,

                small: small

            });


            // Fall back automatically if the worker
            // stops responding.

            visualizerTimer = setTimeout(

                function () {

                    if (visualizerBusy) {

                        fallbackVisualizer(
                            'Worker frame timed out'
                        );

                    }

                },

                5000

            );

        }

        catch (e) {

            fallbackVisualizer(e);

        }

    }


    // ==============================================
    // MAIN THREAD FALLBACK MODE
    // ==============================================

    else if (visualizerRenderer) {

        visualizerRenderer.resize(

            visualizerWidth,

            visualizerHeight,

            small

        );


        visualizerRenderer.frame(

            bins,

            now

        );

    }

}


// ======================================================
// AUDIO ANALYZER ANIMATION LOOP
//
// Only frequency data retrieval and worker messaging
// remain on the main thread.
// ======================================================

function updateAnalyzer() {


    // Prevent multiple animation loops from running
    // when switching between songs.

    if (visualizerRunning) {

        return;

    }

    visualizerRunning = true;

    visualizerLastFrame = -Infinity;


    function tick(now) {

        if (!visualizerRunning) {

            return;

        }


        // Respect configured maximum frame rate.
        //
        // Also avoid sending frames if the worker
        // has not completed the previous frame.

        if (

            !visualizerBusy &&

            visualizerMode !== 'initializing' &&

            now - visualizerLastFrame >=

                1000 / Math.max(
                    1,
                    visualizerConfig.targetFPS
                ) - 1

        ) {

            visualizerLastFrame = now;


            // Retrieve current FFT frequency data
            // from the existing AudioManager.

            frequencyData = music.getBins();


            // Send data to worker or fallback renderer.

            drawRectangles(now);

        }


        visualizerRAF =
            requestAnimationFrame(tick);

    }


    visualizerRAF =
        requestAnimationFrame(tick);

}


// ======================================================
// STOP VISUALIZER ANIMATION
// ======================================================

function stopAudioVisualizer() {

    visualizerRunning = false;

    if (visualizerRAF !== null) {

        cancelAnimationFrame(visualizerRAF);

    }

    visualizerRAF = null;

}


// ======================================================
// INITIALIZE THE VISUALIZER
// ======================================================

initVisualizer();


// ======================================================
// ORIGINAL AUDIO PLAYER FUNCTIONS
// ======================================================


// Change the audio track title.

function changeAudioTrackTitle(newTitle) {

    var titleText =
        document.getElementById(
            "audioVisualizerText"
        );


    if (titleText.innerHTML == "") {

        titleText.innerHTML = newTitle;


        // Fade in text.

        gsap.fromTo(

            titleText,

            {

                alpha: 0

            },

            {

                alpha: .75,

                duration: 1

            }

        );

    }

    else {


        // Fade out old text and fade in new text.

        gsap.fromTo(

            titleText,

            {

                alpha: 1

            },

            {

                alpha: 0,

                duration: .75,

                onComplete: function () {

                    titleText.innerHTML = newTitle;

                    gsap.fromTo(

                        titleText,

                        {

                            alpha: 0

                        },

                        {

                            alpha: .75,

                            duration: 1

                        }

                    );

                }

            }

        );

    }

}


// ======================================================
// PLAY, PAUSE, AND RESTART AUDIO
// ======================================================

function playPauseAudio() {

    switch (currentAudioState) {


        case "playing":

            currentAudioState = "paused";

            music.stop(currentAudioTrack);

            displayPauseAudioState();

        break;


        case "paused":

            currentAudioState = "playing";

            music.play(currentAudioTrack);

            displayPlayAudioState();

        break;


        case "finished":

            currentAudioState = "playing";

            music.restart(currentAudioTrack);

            displayPlayAudioState();

        break;

    }

}


// ======================================================
// DISPLAY PAUSE STATE
// ======================================================

function displayPauseAudioState() {

    document.getElementById(
        "audioVisualizerPlayButton"
    ).style.display = "block";


    document.getElementById(
        "audioVisualizerPauseButton"
    ).style.display = "none";


    document.getElementById(
        "audioVisualizerRepeatButton"
    ).style.display = "none";

}


// ======================================================
// DISPLAY PLAY STATE
// ======================================================

function displayPlayAudioState() {

    document.getElementById(
        "audioVisualizerPlayButton"
    ).style.display = "none";


    document.getElementById(
        "audioVisualizerPauseButton"
    ).style.display = "block";


    document.getElementById(
        "audioVisualizerRepeatButton"
    ).style.display = "none";

}


// ======================================================
// DISPLAY RESTART STATE
// ======================================================

function displayRestartAudioState() {

    document.getElementById(
        "audioVisualizerPlayButton"
    ).style.display = "none";


    document.getElementById(
        "audioVisualizerPauseButton"
    ).style.display = "none";


    document.getElementById(
        "audioVisualizerRepeatButton"
    ).style.display = "block";

}


// ======================================================
// PAUSE SONG
// ======================================================

function pauseSong() {

    currentAudioState = "playing";

    playPauseAudio();

}


// ======================================================
// PLAY SONG
// ======================================================

function playSong(name) {

    currentAudioTrack = name;

    music.play(currentAudioTrack);

    updateAnalyzer();

}


// ======================================================
// LOAD NEW SONG
// ======================================================

function loadNewSong(id, url) {


    // Retain original audio unlocking behaviour.

    if (unlock == false) {

        unlock = true;

        window.parent.music.unlock();

    }


    // Load audio track.
    // False specifies that the track should not loop.

    music.load(id, url, false);


    playSong(id);


    currentAudioState = "playing";


    // Reset player controls when loading another song.

    displayPlayAudioState();


    // Handle end of audio playback.

    music.onEnded(

        id,

        function (endedId) {


            // Ignore callbacks from previous songs.

            if (id !== currentAudioTrack) {

                return;

            }

            currentAudioState = "finished";

            displayRestartAudioState();

        }

    );

}


// ======================================================
// AUDIO PLAYER BUTTON EVENT LISTENERS
// ======================================================

document.getElementById(
    "audioVisualizerPlayButton"
).addEventListener(

    "click",

    playPauseAudio

);


document.getElementById(
    "audioVisualizerPauseButton"
).addEventListener(

    "click",

    playPauseAudio

);


document.getElementById(
    "audioVisualizerRepeatButton"
).addEventListener(

    "click",

    playPauseAudio

);
