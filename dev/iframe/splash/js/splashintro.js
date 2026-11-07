  /*
    This is the splash page key frames intro function 

      startSplashPage()
      fadeOutSplashPage()
  */
  function startSplashPage()
  {
      //start snow animation
      requestAnimationFrame(animateSnow);

      //keyframe
      setTimeout(function(){

          startAnimateBackgroundRotatingText(38);

      }, 750);

      //keyframe
      setTimeout(function(){

          //animate in rolling source code
          animateInMasterSourceCode();

      }, 1000);

      //keyframe
      setTimeout(function(){

          createRotatingMessageString("hello  giftagram,  my  name  is  kevin");

      }, 1250);

      //keyframe
      setTimeout(function(){

          stopAnimateBackgroundRotatingText();

      }, 3000);

      //keyframe
      setTimeout(function(){

          startAnimateBackgroundRotatingText(48);

      }, 6000);

      //keyframe
      setTimeout(function(){

          createRotatingMessageString("welcome  to  my  symphony  of  code  portfolio");

      }, 7500);

      //keyframe
      setTimeout(function(){

          //selectMask(spotlight, "images/splashbackground.jpg");
          //selectMask(maskwall, "video/symphony2.mp4");
          selectMask(maskwall, "video/cello.mp4");

      }, 9500);

      //keyframe
      setTimeout(function(){

          stopAnimateBackgroundRotatingText();

      }, 12000);

      //keyframe
      setTimeout(function(){

          selectMask(maskwall, "video/violins.mp4");

      }, 13000);

      //keyframe
      setTimeout(function(){

          startAnimateBackgroundRotatingText(50);

      }, 18000);

      //keyframe
      setTimeout(function(){

          selectMask(spotlight, "video/conductor.mp4");

      }, 16500);

      //keyframe
      setTimeout(function(){

          //animate in hello giftagram logo and subtitle
          animateInLogo();

      }, 21500);

      //keyframe
      setTimeout(function(){

          createRotatingMessageString("click  anywhere  to  launch  my  portfolio  experience");

      }, 19750);

      //keyframe
      setTimeout(function(){

          //selectMask(crossfade, "images/blackbg.png");
          selectMask(crossfade, "images/splashbackground.jpg");

      }, 21250);

      //keyframe
      setTimeout(function(){

          //animate out rolling source code
          animateOutMasterSourceCode();

      }, 22500);

      //keyframe
      setTimeout(function(){

          stopAnimateBackgroundRotatingText();

      }, 25000);

      setTimeout(function(){

          //user is now allowed to begin portfolio experience
          clickLock = "allowed";

      }, 26000);
  }

  function fadeOutSplashPage()
  {
      explodeOutForegroundText();
      startParticleEmitter(750, 500, 1550, 490);

      fadeOutSnowfall(3);

      //keyframe
      setTimeout(function(){

          selectMask(crossfade, "images/blackbg.png");

          startAnimateBackgroundRotatingText(55);
          animateOutLogo();

      }, 1000);

      //keyframe
      setTimeout(function(){

          stopAnimateBackgroundRotatingText();
          stopContinuousEmit();

      }, 3000);

      //keyframe
      setTimeout(function(){

          //console.log("next page in");
          window.parent.postMessage("iframeClicked", "*");

      }, 7000);
  }
