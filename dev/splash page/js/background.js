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

  var newImage = new Image(); //new incoming image
  var newVideo = document.getElementById("mainVideo");

  var videoActive = false; //is transition masking a video?
  var keepCopyingVideo = false;

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

          newVideo = await setVideo(src);
          animateMask(mask);

      } else {

          newImage = await setImage(src);

          keepCopyingVideo = false;

          animateMask(mask);
      }
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

        //set the new incoming video
        newVideo.src = videoSrc;
        newVideo.load();

        newVideo.addEventListener("durationchange", function(){

            videoActive = true;
            resolve(newVideo);
        });
    });
  }

  //main masking animation transition command
  function onMainloop()
  {
      mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

      // 1) mask from mask canvas is drawn first
      mainContext.drawImage(document.getElementById("maskCanvas"), 0, 0); //main canvas draws/copies animated buffer mask canvas first and sets "source in" composition

      mainContext.globalCompositeOperation = "source-in";

      // 2) then newImage will automatically get masked
      if(videoActive == true)
      {
          mainContext.drawImage(newVideo, 0, 0, mainCanvas.width, mainCanvas.height); //draw out newVideo
      } else {
          mainContext.drawImage(newImage, 0, 0, mainCanvas.width, mainCanvas.height); //draw out newImage
      }

      mainContext.globalCompositeOperation = "destination-atop";

      // 3) originalImage gets drawn last with "destination-atop" set beforehand
      mainContext.drawImage(originalImage, 0, 0, mainCanvas.width, mainCanvas.height); //draw out originalImage

      if(runOnMainLoop == true)
      {
          requestAnimationFrame(onMainloop);
      }
  }

  //this copies the video to the main canvas continuously after masking in effect is completed
  function keepVideoCopying()
  {
      mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

      //continually copy video to orignalImage canvas by keeping runOnMainLoop = true;
      mainContext.drawImage(newVideo, 0, 0, mainCanvas.width, mainCanvas.height);

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
          newVideo.play();
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

          originalImage = newVideo; //current video on display

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
  }

  resizeCanvas();

  //selectMask can run crossfade, spotlight or maskwall as inputs at any time to change transitions
  //selectMask(crossfade, "background.png");
  //selectMask(spotlight, "background.png");
  //selectMask(maskwall, "background.png");
  //selectMask(maskwall, "video/symphony2.mp4");
