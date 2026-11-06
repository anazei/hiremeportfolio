  var mainGiftagramLogoArray = new Array();
  var maingiftagramLogoSubtitleArray = new Array();
  var mainGiftagramLogo = document.getElementById("giftagramLogo").children;
  var mainGiftagramSubtitle = document.getElementById("giftagramLogoSubtitle").children;

  function initGiftagramLogo()
  {
      for(var i=0;i<mainGiftagramLogo.length;i++)
      {
          mainGiftagramLogoArray.push(mainGiftagramLogo[i]);
      }

      for(var i=0;i<mainGiftagramSubtitle.length;i++)
      {
          maingiftagramLogoSubtitleArray.push(mainGiftagramSubtitle[i]);
      }
  }

  //shuffle an array
  function randomizeArray(inputArray)
  {
      for(var i=0;i<inputArray.length;i++)
      {
          var randomPosition = Math.floor(Math.random() * inputArray.length);
          var temp = inputArray[i];
          inputArray[i] = inputArray[randomPosition];
          inputArray[randomPosition] = temp;
      }

      return inputArray;
  }

  function animateInLogo()
  {
      //mainGiftagramLogoArray.reverse();
      maingiftagramLogoSubtitleArray.reverse();

      for(var i=0;i<mainGiftagramLogoArray.length;i++)
      {
          gsap.to(mainGiftagramLogoArray[i], {
              opacity: 1,
              duration: 2,
              delay: i/15,
          });
      }

      setTimeout(function(){

          for(var i=0;i<maingiftagramLogoSubtitleArray.length;i++)
          {
              gsap.to(maingiftagramLogoSubtitleArray[i], {                  
                  opacity: 1,
                  duration: .75,
                  delay: i/75,
              });
          }

      }, 1000);
  }

  function animateOutLogo()
  {
      maingiftagramLogoSubtitleArray.reverse();

      for(var i=0;i<mainGiftagramLogoArray.length;i++)
      {
          gsap.to(mainGiftagramLogoArray[i], {
              opacity: 0,
              duration: 1,
              delay: i/55,
          });
      }

      for(var i=0;i<maingiftagramLogoSubtitleArray.length;i++)
      {
          gsap.to(maingiftagramLogoSubtitleArray[i], {
              opacity: 0,
              duration: 1,
              delay: i/75,
          });
      }
  }

  initGiftagramLogo();
  //animateInLogo();
  //animateOutLogo()
