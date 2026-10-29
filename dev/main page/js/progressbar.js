  var progressAnimationNumberCounter = 1000;
  var runProgressBarNumberCounter = true;
  var progressBarRotatingText;

  //continuously random rotating progress bar text
  function generateRotatingProgressBarText(textLength)
  {
      progressAnimationNumberCounter += 46;
      document.getElementById("scrambleTextProgressBar").innerHTML = "initializing..." + progressAnimationNumberCounter;
  }

  function startProgressBarRotatingText()
  {
      gsap.fromTo("#progress", {
        backgroundPositionX: "0px"
        },
        {
          backgroundPositionX: "-30px",
          duration: .5,
          ease: "none",
          repeat: -1
        }
      );

      progressBarRotatingText = setInterval(function(){

        if(runProgressBarNumberCounter == true)
        {

            generateRotatingProgressBarText(25);

        } else {

            clearInterval(progressBarRotatingText);
        }
      }, 15);
  }

  function stopProgressBarRotatingText()
  {
      runProgressBarNumberCounter = false;
  }

  function animateInProgressBarContainer()
  {
      startProgressBarRotatingText();

      gsap.fromTo("#progressBarContainer",
      {
        width: 435,
        height: 85,
        scaleX: 0,
        scaleY: 0
      },
      {
        scaleX: 1,
        scaleY: 1,
        duration: .35,
        transformOrigin: "50% 50%",
        onComplete: function(){

            gsap.to("#progress", {
              duration: .35,
              alpha: 1
            });

            gsap.to("#progressBorder", {
              duration: .35,
              alpha: 1
            });

            gsap.to("#scrambleTextProgressBar", {
              duration: .35,
              alpha: 1
            });
        }
      });
  }

  function animateOutProgressBarContainer()
  {
      gsap.to("#progress", {
        duration: .35,
        alpha: 0
      });

      gsap.to("#progressBorder", {
        duration: .35,
        alpha: 0
      });

      gsap.to("#scrambleTextProgressBar", {
        duration: .35,
        alpha: 0
      });

      gsap.to("#progressBarContainer",
      {
          scaleX: 0,
          scaleY: 0,
          duration: .35,
          delay: .35,
          transformOrigin: "50% 50%",
      });

      setTimeout(stopProgressBarRotatingText, 2000);
  }

  //animateInProgressBarContainer();
  //animateOutProgressBarContainer();
