/* Background transitions:
   Smooth masks and frame-driven video playback.
*/

var mainCanvas = document.getElementById('mainCanvas');
var mainContext = mainCanvas.getContext('2d');

var crossfade = new Crossfade(this, mainCanvas);
var maskwall = new Maskwall(this, mainCanvas);
var spotlight = new Spotlight(this, mainCanvas);

var currentMask;

var runOnMainLoop = false;

var videoActive = false;
var keepCopyingVideo = false;

var incomingVideo;
var oppositeToggle = true;

var newImage = new Image();

var newVideo = document.getElementById('mainVideo');
var newVideo2 = document.getElementById('mainVideo2');


// ======================================================
// PERFORMANCE CONFIGURATION
// ======================================================

var backgroundConfig = {

    // Draw video directly to the main canvas after
    // the masking transition has completed.
    //
    // Set to false to restore buffered video drawing.

    directVideoDrawing: true,

    // Only redraw the video when a new video frame
    // becomes available.
    //
    // Automatically falls back to requestAnimationFrame
    // on older browsers.

    useVideoFrameCallback: true

};


// ======================================================
// INITIALIZE CANVASES
// ======================================================

var blankCanvas = createInvisibleCanvas(
    'blankCanvas',
    mainCanvas.width,
    mainCanvas.height
);

var originalImage = blankCanvas;

var originalContext = blankCanvas.getContext('2d');

originalContext.fillStyle = '#000';

originalContext.fillRect(
    0,
    0,
    blankCanvas.width,
    blankCanvas.height
);


var bufferCanvas = createInvisibleCanvas(
    'bufferCanvas',
    mainCanvas.width,
    mainCanvas.height
);

var bufferContext = bufferCanvas.getContext('2d');


var maskCanvas = createInvisibleCanvas(
    'maskCanvas',
    mainCanvas.width,
    mainCanvas.height
);

var maskContext = maskCanvas.getContext('2d');


var coveredImageVideoWidth = 0;
var coveredImageVideoHeight = 0;


// ======================================================
// ANIMATION CALLBACK MANAGEMENT
// ======================================================

var maskRAF = null;

var videoRAF = null;

var videoCallback = null;

var copyingVideo = null;

var copyGeneration = 0;

var selectionGeneration = 0;


// ======================================================
// SOURCE VALIDATION
// ======================================================

function isVideo(source)
{
    return source && source.tagName === 'VIDEO';
}


function drawable(source)
{
    return source && (
        !isVideo(source) ||
        source.readyState >= 2
    );
}


// ======================================================
// DRAW IMAGE OR VIDEO COVERING THE CANVAS
// ======================================================

function drawCovered(ctx, source)
{
    if (drawable(source))
    {
        ctx.drawImage(
            source,
            0,
            0,
            coveredImageVideoWidth,
            coveredImageVideoHeight
        );
    }
}


// ======================================================
// SETUP SELECTED MASK
// ======================================================

function setupSelectedMask(mask)
{
    if (currentMask !== mask)
    {
        currentMask = mask;

        currentMask.setupMask();
    }
}


// ======================================================
// SELECT MASK FOR IMAGE OR VIDEO SOURCE
// ======================================================

async function selectMask(mask, src)
{
    var generation = ++selectionGeneration;

    var isMovie = /\.mp4(?:[?#]|$)/i.test(src);

    var source = isMovie
        ? await setVideo(src)
        : await setImage(src);


    // Ignore outdated asynchronous loading operations.

    if (generation !== selectionGeneration)
    {
        return;
    }


    setupSelectedMask(mask);

    videoActive = isMovie;


    if (isMovie)
    {
        incomingVideo = source;
    }
    else
    {
        newImage = source;
    }


    animateMask(mask);
}


// ======================================================
// SELECT MASK FOR AN EXISTING VIDEO ELEMENT
// ======================================================

async function selectMaskVideoSource(mask, src)
{
    var generation = ++selectionGeneration;

    var source = await setVideoSource(src);


    if (generation !== selectionGeneration)
    {
        return;
    }


    setupSelectedMask(mask);

    incomingVideo = source;

    videoActive = true;

    animateMask(mask);
}


// ======================================================
// LOAD IMAGE
// ======================================================

function setImage(src)
{
    return new Promise(function(resolve, reject)
    {
        var image = new Image();


        // Register events before setting the source.

        image.onload = function()
        {
            resolve(image);
        };


        image.onerror = reject;


        image.src = src;
    });
}


// ======================================================
// LOAD VIDEO
//
// Alternate between the two existing HTML video tags.
// ======================================================

function setVideo(src)
{
    var video = oppositeToggle
        ? newVideo2
        : newVideo;


    oppositeToggle = !oppositeToggle;


    // Do not overwrite the currently displayed video
    // when the other video tag is available.

    if (video === originalImage)
    {
        video = video === newVideo
            ? newVideo2
            : newVideo;
    }


    return new Promise(function(resolve, reject)
    {

        function cleanup()
        {
            video.removeEventListener(
                'canplay',
                ready
            );

            video.removeEventListener(
                'error',
                failed
            );
        }


        function ready()
        {
            cleanup();

            resolve(video);
        }


        function failed()
        {
            cleanup();

            reject(
                video.error ||
                new Error('Video load failed')
            );
        }


        // Remove listeners after loading completes.

        video.addEventListener(
            'canplay',
            ready
        );

        video.addEventListener(
            'error',
            failed
        );


        video.muted = true;

        video.playsInline = true;

        video.src = src;

        video.load();

    });
}


// ======================================================
// LOAD EXISTING VIDEO ELEMENT
// ======================================================

async function setVideoSource(videoID)
{
    var video = document.getElementById(videoID);

    video.playsInline = true;

    video.muted = true;

    video.load();

    await video.play();

    return video;
}


// ======================================================
// RENDER MASK FRAME
//
// Preserve the existing compositing sequence for
// compatibility with iOS Safari and Chrome.
//
// Mask transitions continue rendering at the display
// refresh rate, normally 60 FPS.
// ======================================================

function renderMaskFrame()
{

    // Reset blend mode.

    bufferContext.globalCompositeOperation =
        'source-over';


    // Clear the intermediate buffer.

    bufferContext.clearRect(
        0,
        0,
        mainCanvas.width,
        mainCanvas.height
    );


    // Draw the incoming video or image.

    drawCovered(
        bufferContext,
        videoActive
            ? incomingVideo
            : newImage
    );


    // Apply the mask to the incoming source.

    bufferContext.globalCompositeOperation =
        'destination-in';


    // Use the existing canvas reference rather than
    // repeatedly calling document.getElementById().

    bufferContext.drawImage(
        maskCanvas,
        0,
        0,
        mainCanvas.width,
        mainCanvas.height
    );


    // Restore normal compositing on the main canvas.

    mainContext.globalCompositeOperation =
        'source-over';


    // Draw the previous background.

    drawCovered(
        mainContext,
        originalImage
    );


    // Composite the newly masked background.

    mainContext.drawImage(
        bufferCanvas,
        0,
        0
    );

}


// ======================================================
// MAIN MASK ANIMATION LOOP
//
// Always use requestAnimationFrame during animated
// masking so the GSAP transitions remain smooth.
// ======================================================

function onMainloop()
{
    if (!runOnMainLoop)
    {
        return;
    }


    // Prevent duplicate scheduled animation callbacks.

    if (maskRAF !== null)
    {
        cancelAnimationFrame(maskRAF);
    }


    renderMaskFrame();


    maskRAF = requestAnimationFrame(function()
    {
        maskRAF = null;

        onMainloop();
    });

}


// ======================================================
// STOP VIDEO COPYING
//
// Cancel pending callbacks before changing videos or
// starting another masking transition.
// ======================================================

function stopVideoCopying()
{
    keepCopyingVideo = false;


    // Invalidate callbacks belonging to previous videos.

    ++copyGeneration;


    // Cancel regular animation frame callback.

    if (videoRAF !== null)
    {
        cancelAnimationFrame(videoRAF);
    }


    // Cancel video frame callback if supported.

    if (copyingVideo)
    {
        if (
            videoCallback !== null &&
            typeof copyingVideo.cancelVideoFrameCallback
                === 'function'
        )
        {
            copyingVideo.cancelVideoFrameCallback(
                videoCallback
            );
        }


        copyingVideo.removeEventListener(
            'ended',
            onVideoEnded
        );
    }


    videoRAF = null;

    videoCallback = null;

    copyingVideo = null;
}


// ======================================================
// OPTIMIZED VIDEO FRAME DRAWING
//
// After masking is complete, there is no need to draw
// the video into a buffer canvas before drawing it
// to the main canvas.
//
// This reduces two drawImage calls and one clearRect
// call to just one drawImage call.
// ======================================================

function drawVideoFrame(video)
{

    if (!drawable(video))
    {
        return;
    }


    mainContext.globalCompositeOperation =
        'source-over';


    // ==============================================
    // FAST DIRECT VIDEO DRAWING
    // ==============================================

    if (backgroundConfig.directVideoDrawing)
    {

        drawCovered(
            mainContext,
            video
        );

    }


    // ==============================================
    // BACKWARDS COMPATIBLE BUFFERED DRAWING
    // ==============================================

    else
    {

        bufferContext.globalCompositeOperation =
            'source-over';


        bufferContext.clearRect(
            0,
            0,
            bufferCanvas.width,
            bufferCanvas.height
        );


        drawCovered(
            bufferContext,
            video
        );


        mainContext.drawImage(
            bufferCanvas,
            0,
            0
        );

    }

}


// ======================================================
// VIDEO PLAYBACK COMPLETED
//
// Preserve the final video frame so it can be used
// as the background of the next masking transition.
// ======================================================

function onVideoEnded()
{

    var video = copyingVideo;


    if (!video)
    {
        return;
    }


    // Display the final frame.

    drawVideoFrame(video);


    // Preserve the final video frame in a canvas.

    if (
        originalImage === video &&
        drawable(video)
    )
    {

        var still = document.createElement('canvas');


        still.width =
            video.videoWidth || mainCanvas.width;


        still.height =
            video.videoHeight || mainCanvas.height;


        still.getContext('2d').drawImage(
            video,
            0,
            0,
            still.width,
            still.height
        );


        originalImage = still;

    }


    // Stop all video rendering callbacks.

    stopVideoCopying();


    // Retain the video source.
    // The next setVideo() can safely reuse the element.

}


// ======================================================
// OPTIMIZED VIDEO PLAYBACK LOOP
//
// Uses requestVideoFrameCallback whenever available.
//
// 24 FPS video = approximately 24 canvas redraws/sec.
//
// Older browsers automatically fall back to
// requestAnimationFrame.
// ======================================================

function keepVideoCopying()
{

    var video = copyingVideo;


    // Make sure video playback should still be rendered.

    if (
        !keepCopyingVideo ||
        !video ||
        runOnMainLoop
    )
    {
        return;
    }


    // Do not schedule duplicate callbacks.

    if (
        videoRAF !== null ||
        videoCallback !== null
    )
    {
        return;
    }


    // Stop rendering when the video has finished.

    if (video.ended)
    {
        onVideoEnded();

        return;
    }


    // Draw current video frame.

    drawVideoFrame(video);


    var generation = copyGeneration;


    // Callback for the next available frame.

    function nextFrame()
    {

        // Ignore callbacks from previous video sources.

        if (generation !== copyGeneration)
        {
            return;
        }


        videoRAF = null;

        videoCallback = null;


        keepVideoCopying();

    }


    // ==============================================
    // MODERN BROWSER VIDEO FRAME CALLBACK
    // ==============================================

    if (
        backgroundConfig.useVideoFrameCallback &&

        typeof video.requestVideoFrameCallback
            === 'function'
    )
    {

        videoCallback =
            video.requestVideoFrameCallback(
                nextFrame
            );

    }


    // ==============================================
    // OLDER BROWSER FALLBACK
    // ==============================================

    else
    {

        videoRAF =
            requestAnimationFrame(
                nextFrame
            );

    }

}


// ======================================================
// START MASK TRANSITION
// ======================================================

function animateMask(mask)
{

    // Stop any previous video copying loop.

    stopVideoCopying();


    // Cancel any previous mask rendering callback.

    if (maskRAF !== null)
    {
        cancelAnimationFrame(maskRAF);
    }


    maskRAF = null;


    // Enable 60 FPS mask compositing.

    runOnMainLoop = true;


    // Start incoming video playback if necessary.

    if (videoActive)
    {

        var playback = incomingVideo.play();


        if (playback && playback.catch)
        {

            playback.catch(function(e)
            {

                console.warn(
                    'Background playback:',
                    e
                );

            });

        }

    }


    // Start canvas rendering.

    onMainloop();


    // Start GSAP mask animation.

    mask.startAnimate();

}


// ======================================================
// MASK TRANSITION COMPLETED
//
// Switch from display-refresh-rate rendering to
// video-frame-rate rendering.
// ======================================================

function onMaskComplete()
{

    if (!runOnMainLoop)
    {
        return;
    }


    // Stop the continuous mask rendering loop.

    runOnMainLoop = false;


    if (maskRAF !== null)
    {
        cancelAnimationFrame(maskRAF);
    }


    maskRAF = null;


    // Remember previous background source.

    var previous = originalImage;

    var wasVideo = videoActive;


    // Establish the new permanent background.

    originalImage = wasVideo
        ? incomingVideo
        : newImage;


    videoActive = false;


    // Present the completed, fully unmasked background.

    drawCovered(
        mainContext,
        originalImage
    );


    // Stop decoding the previous video once it is
    // no longer needed.

    if (
        isVideo(previous) &&
        previous !== originalImage
    )
    {

        previous.pause();

    }


    // ==============================================
    // VIDEO BACKGROUND
    // ==============================================

    if (wasVideo)
    {

        stopVideoCopying();


        copyingVideo = incomingVideo;


        keepCopyingVideo = true;


        // Listen for playback completion separately,
        // because requestVideoFrameCallback may stop
        // firing when there are no more video frames.

        copyingVideo.addEventListener(
            'ended',
            onVideoEnded
        );


        // Start optimized video-only rendering.

        keepVideoCopying();

    }


    // ==============================================
    // STATIC IMAGE BACKGROUND
    // ==============================================
    //
    // No continuous rendering is required.
    // The image remains on the main canvas.

}


// ======================================================
// CREATE INVISIBLE BUFFER CANVAS
// ======================================================

function createInvisibleCanvas(id, width, height)
{

    var canvas = document.getElementById(id);


    if (!canvas)
    {

        canvas = document.createElement('canvas');

        canvas.id = id;

        canvas.width = width;

        canvas.height = height;

        canvas.style.display = 'none';


        document.body.appendChild(canvas);

    }


    return canvas;

}


// ======================================================
// RESIZE ALL CANVASES
// ======================================================

function resizeCanvas()
{

    var w = window.innerWidth;

    var h = window.innerHeight;


    // Only resize when dimensions actually change.
    //
    // Assigning canvas.width or canvas.height clears
    // the canvas and resets its context state.


    if (
        mainCanvas.width !== w ||
        mainCanvas.height !== h
    )
    {

        mainCanvas.width = w;

        mainCanvas.height = h;

    }


    if (
        bufferCanvas.width !== w ||
        bufferCanvas.height !== h
    )
    {

        bufferCanvas.width = w;

        bufferCanvas.height = h;

    }


    if (
        maskCanvas.width !== w ||
        maskCanvas.height !== h
    )
    {

        maskCanvas.width = w;

        maskCanvas.height = h;

    }


    // Resize only the original blank canvas.
    //
    // Never modify the dimensions of an actual image
    // or video being used as the current background.

    if (
        blankCanvas.width !== w ||
        blankCanvas.height !== h
    )
    {

        blankCanvas.width = w;

        blankCanvas.height = h;


        originalContext.fillStyle = '#000';


        originalContext.fillRect(
            0,
            0,
            w,
            h
        );

    }


    // ==============================================
    // CALCULATE COVER DIMENSIONS
    //
    // Original image and video aspect ratio: 1280x720.
    // ==============================================

    var dw =
        document.documentElement.clientWidth || w;

    var dh =
        document.documentElement.clientHeight || h;


    var scale = Math.max(
        dw / 1280,
        dh / 720
    );


    coveredImageVideoWidth =
        Math.ceil(1280 * scale);


    coveredImageVideoHeight =
        Math.ceil(720 * scale);


    // Redraw immediately after resizing.

    if (runOnMainLoop)
    {

        renderMaskFrame();

    }
    else
    {

        drawCovered(
            mainContext,
            originalImage
        );

    }

}


// ======================================================
// INITIALIZATION
// ======================================================

resizeCanvas();


// Existing callers can continue calling resizeCanvas()
// when resizing or changing device orientation.


// ======================================================
// EXAMPLE USAGE
// ======================================================

// selectMask(crossfade, "background.png");

// selectMask(spotlight, "background.png");

// selectMask(maskwall, "background.png");

// selectMask(maskwall, "video/symphony2.mp4");
