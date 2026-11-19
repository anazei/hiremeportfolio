  var mainCanvas = document.getElementById("mainCanvas");
  var mainContext = mainCanvas.getContext("2d");

  var crossfade = new Crossfade(this, mainCanvas);
  var maskwall = new Maskwall(this, mainCanvas);
  var spotlight = new Spotlight(this, mainCanvas);

  var currentMask;

  var runOnMainLoop = false;

  var originalImage = createInvisibleCanvas("blankCanvas", mainCanvas.width, mainCanvas.height); //current image on display at start
  var originalContext = originalImage.getContext("2d");
      originalContext.fillStyle = "#000000";
      originalContext.fillRect(0, 0, mainCanvas.width, mainCanvas.height);

  var bufferCanvas = createInvisibleCanvas("bufferCanvas", mainCanvas.width, mainCanvas.height); //buffer canvas to accommodate iOS Chrome rendering issues
  var bufferContext = bufferCanvas.getContext("2d");

  var maskCanvas = createInvisibleCanvas("maskCanvas", mainCanvas.width, mainCanvas.height);
  var maskContext = maskCanvas.getContext("2d");

  var newImage = new Image(); //new incoming image
  var newVideo = document.getElementById("mainVideo");
  var newVideo2 = document.getElementById("mainVideo2");

  var videoActive = false; //is transition masking a video?
  var keepCopyingVideo = false;
  var incomingVideo;
  var oppositeToggle = true; //toggle back and forth between two video tags

  //setup which ever mask is selected
  async function selectMask(mask, src)
  {
      if(currentMask !== mask)
      {
          currentMask = mask;

          //setup mask
          currentMask.setupMask(); //method to call mask object but only once at the start of every new transition
      }

      if(src.indexOf(".mp4") >= 0)
      {
          keepCopyingVideo = true;

          incomingVideo = await setVideo(src);
          animateMask(mask);

      } else {

          keepCopyingVideo = false;

          newImage = await setImage(src);
          animateMask(mask);
      }
  }

  //setup which ever mask is selected
  async function selectMaskVideoSource(mask, src)
  {
      if(currentMask !== mask)
      {
          currentMask = mask;

          //setup mask
          currentMask.setupMask(); //method to call mask object but only once at the start of every new transition
      }

      keepCopyingVideo = true;

      incomingVideo = await setVideoSource(src);
      animateMask(mask);
  }

  async function setImage(imageSrc)
  {
      return new Promise(function(resolve){

          //set the new incoming image
          var image = new Image();
              image.src = imageSrc;

          image.onload = function()
          {
              resolve(image);
          }
      });
  }

  async function setVideo(videoSrc)
  {
    return new Promise(function(resolve){

        var currentVideo;

        //if video1 already exists
        if(oppositeToggle == true)
        {
            oppositeToggle = false;
            //new video is assigned to video2 instead
            currentVideo = mainVideo2;
        } else {

            oppositeToggle = true;
            //else, assign new video to video1
            currentVideo = mainVideo;
        }

        //set the new incoming video
        currentVideo.src = videoSrc;
        currentVideo.load();
        currentVideo.muted = true;

        currentVideo.addEventListener("canplay", function(){

            videoActive = true;
            resolve(currentVideo);
        });
    });
  }

  async function setVideoSource(videoID)
  {
      var currentVideo = document.getElementById(videoID);
          currentVideo.playsInline = true;
          currentVideo.muted = true;
          currentVideo.currentTime = 0;

        //set the new incoming video
        currentVideo.load();
        await currentVideo.play();

        videoActive = true;
        return currentVideo;
  }

  //main masking animation transition command - this version of onMainLoop works with iOS Chrome for video transitions but has rendering issues with spotlight going 100% on height properly
  function onMainloop()
  {
      bufferContext.globalCompositeOperation = "source-over"; //this resets the blend mode to source over without leaving it in destination-atop

      bufferContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

      // newImage or incoming video will automatically get masked
      if(videoActive == true)
      {
          bufferContext.drawImage(incomingVideo, 0, 0, mainCanvas.width, mainCanvas.height); //draw out newVideo
      } else {
          bufferContext.drawImage(newImage, 0, 0, mainCanvas.width, mainCanvas.height); //draw out newImage
      }

      bufferContext.globalCompositeOperation = "destination-in";

      // mask from mask canvas is drawn
      bufferContext.drawImage(document.getElementById("maskCanvas"), 0, 0, mainCanvas.width, mainCanvas.height);

      mainContext.drawImage(originalImage, 0, 0, mainCanvas.width, mainCanvas.height);

      mainContext.drawImage(bufferCanvas, 0, 0, bufferCanvas.width, bufferCanvas.height);

      if(runOnMainLoop == true)
      {
          requestAnimationFrame(onMainloop);
      }
  }

  //this copies the video to the main canvas continuously after masking in effect is completed
  function keepVideoCopying()
  {
      bufferContext.globalCompositeOperation = "source-over"; //this resets the blend mode to source over without leaving it in destination-atop

      bufferContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

      //continually copy video to orignalImage canvas by keeping runOnMainLoop = true;
      bufferContext.drawImage(incomingVideo, 0, 0, mainCanvas.width, mainCanvas.height);

      mainContext.drawImage(bufferCanvas, 0, 0);

      //unload and stop copying video once it ends
      if(incomingVideo.ended == true)
      {
          keepCopyingVideo = false;
          incomingVideo.src = "";
      }

      if(keepCopyingVideo == true)
      {
          requestAnimationFrame(keepVideoCopying);
      }
  }

  //animate the specific mask
  function animateMask(mask)
  {
      //allow main loop to run
      runOnMainLoop = true;

      if(videoActive == true)
      {
          incomingVideo.play();
      }

      //start on main loop
      onMainloop();

      //run mask animation
      mask.startAnimate(); //method to call mask object
  }

  //when masking animation is complete, reset for next mask setup
  function onMaskComplete()
  {
      //stop on main loop when done
      runOnMainLoop = false;

      if(videoActive == true)
      {
          videoActive = false;

          originalImage = incomingVideo; //current video on display

          //keep video copying to main canvas or it will disappear
          keepVideoCopying();

      } else {

          //set permanent image state
          originalImage = newImage; //current image on display
      }
  }

  //creates invisible canvas for buffering
  function createInvisibleCanvas(id, width, height)
  {
      var tempCanvas;

      if(document.getElementById(id) !== null)
      {
          tempCanvas = document.getElementById(id);
      } else {

          tempCanvas = document.createElement("canvas");
          tempCanvas.width = width;
          tempCanvas.height = height;
          tempCanvas.id = id;
          tempCanvas.style.display = "none";
          document.body.appendChild(tempCanvas);
      }

      return tempCanvas;
  }

  function resizeCanvas()
  {
      mainCanvas.width = window.innerWidth;
      mainCanvas.height = window.innerHeight;

      originalImage.width = window.innerWidth;
      originalImage.height = window.innerHeight;

      bufferCanvas.width = window.innerWidth;
      bufferCanvas.height = window.innerHeight;

      maskCanvas.width = window.innerWidth;
      maskCanvas.height = window.innerHeight;
  }

  resizeCanvas();

  //selectMask can run crossfade, spotlight or maskwall as inputs at any time to change transitions
  //selectMask(crossfade, "background.png");
  //selectMask(spotlight, "background.png");
  //selectMask(maskwall, "background.png");
  //selectMask(maskwall, "video/symphony2.mp4");
