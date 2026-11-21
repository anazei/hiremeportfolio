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
          //selectMask(maskwall, "video/cello.mp4");
          //selectMaskVideoSource(maskwall, "cello");
          //selectMaskVideoSource(maskwall, "combinedVideo");
          selectMaskVideoSource(crossfade, "combinedVideo");

      }, 9500);

      //keyframe
      setTimeout(function(){

          stopAnimateBackgroundRotatingText();

      }, 12000);

      //keyframe
      setTimeout(function(){

          //selectMask(maskwall, "video/violins.mp4");
          //selectMaskVideoSource(maskwall, "violin");

      }, 13000);

      //keyframe
      setTimeout(function(){

          //selectMask(spotlight, "video/conductor.mp4");
          //selectMaskVideoSource(spotlight, "conductor");

      }, 16500);

      //keyframe
      setTimeout(function(){

          startAnimateBackgroundRotatingText(50);

      }, 18000);

      //keyframe
      setTimeout(function(){

          createRotatingMessageString("click  anywhere  to  launch  my  portfolio  experience");

      }, 19500);

      //keyframe
      setTimeout(function(){

          //animate in hello giftagram logo and subtitle
          animateInLogo();

      }, 20500);

      //keyframe
      setTimeout(function(){

          selectMask(crossfade, "../main/images/splashbackground4.jpg");

      }, 21000);

      //keyframe
      setTimeout(function(){

      }, 27500);

      //keyframe
      setTimeout(function(){

          stopAnimateBackgroundRotatingText();

      }, 25000);

      setTimeout(function(){

          //user is now allowed to begin portfolio experience
          clickLock = "allowed";

      }, 25000);
  }

  function fadeOutSplashPage()
  {
      //animate out rolling source code
      animateOutMasterSourceCode();

      //keyframe
      setTimeout(function(){

          explodeOutForegroundText();

          var particleShooterStartX = 775;
          var particleShooterStartY = 500;

          startParticleEmitter(particleShooterStartX, particleShooterStartY, particleShooterStartX + 800, particleShooterStartY);

          fadeOutSnowfall(3);

      }, 1000);

      //keyframe
      setTimeout(function(){

          selectMask(crossfade, "images/blackbg.png");

          startAnimateBackgroundRotatingText(55);
          animateOutLogo();

      }, 2000);

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
