  var characterArray = ["A", "B", "C", "D", "E", "F", "G", "H", "I",
  "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V",
  "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  var rotatingTextAnimationState = false; //starts as false
  var rotatingBackgroundTextInterval;
  var foregroundRotatingMessageArray = new Array();
  var backgroundRotationTextDiv = document.getElementById("backgroundRotationText")

  //continuously random rotating background text
  function generateRotatingBackgroundText(textLength)
  {
      var randomCharacters = "";

      for(var i=0;i<textLength;i++)
      {
          randomCharacters += characterArray[Math.floor(Math.random() * characterArray.length)];
      }

      backgroundRotationTextDiv.innerHTML = randomCharacters;
      backgroundRotationTextDiv.style.textShadow = "0px 0px 10px rgba(255, 255, 255, 1)";
  }

  //fade in rotational background text
  function startAnimateBackgroundRotatingText(length)
  {
      if(rotatingTextAnimationState == false)
      {
          rotatingTextAnimationState = true;

          rotatingBackgroundTextInterval = setInterval(function(){

              generateRotatingBackgroundText(length);

          }, 25);

          gsap.to(backgroundRotationTextDiv, {
            opacity: 0.4,
            duration: 0.5,
          });
      }
  }

  //fade out rotational background text
  function stopAnimateBackgroundRotatingText()
  {
      if(rotatingTextAnimationState == true)
      {
          gsap.to(backgroundRotationTextDiv, {
            opacity: 0,
            duration: 0.5,
            onComplete: function(){
              rotatingTextAnimationState = false;
              clearInterval(rotatingBackgroundTextInterval);
            }
          });
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

  //if no message, then fade in message with unblur effect
  //if message already exists, then transition out first and then transition in new message
  //dynamically create all the letters of the message string as individual divs
  function createRotatingMessageString(message)
  {
      //fade in rotational background text animation
      //startAnimateBackgroundRotatingText(message.length);

      var completeCounter = 0;
      message = message.toUpperCase();

      var targetDiv = document.getElementById("mainRotationText");

      //if there's existing text already,
      if(targetDiv.innerHTML.length > 0)
      {
          foregroundRotatingMessageArray = randomizeArray(foregroundRotatingMessageArray);

          //delay slightly before starting foreground text fade in
          setTimeout(function(){

              //fade out existing text first
              for(var i=0;i<foregroundRotatingMessageArray.length;i++)
              {
                  //gsap fade in each letter randomly
                  gsap.to(foregroundRotatingMessageArray[i], {
                    opacity: 0,
                    duration: 1,
                    delay: i / 45,
                    //ease: "power2.inOut",
                    onComplete: function(){

                        completeCounter++;

                        if(completeCounter == foregroundRotatingMessageArray.length)
                        {
                            foregroundRotatingMessageArray = [];

                            while(targetDiv.children.length > 0)
                            {
                                targetDiv.removeChild(targetDiv.children[0]);
                            }

                            //then fade in next text message
                            fadeInRotatingForegroundText(message, targetDiv);
                        }
                    }
                  });
              }

          }, 750);

      } else {

          //if no existing text, directly fade in message
          fadeInRotatingForegroundText(message, targetDiv);
        }
  }

  function fadeInRotatingForegroundText(message, targetDiv)
  {
      var completeCounter = 0;

      //dynamically create all the letters of the message string as individual divs
      for(var i=0;i<message.length;i++)
      {
          var messageDiv = document.createElement("span");
              messageDiv.innerHTML = message[i];
              messageDiv.style.marginRight = "4px";
              messageDiv.style.filter = "blur(10px)";
              messageDiv.style.scale = 7;
              messageDiv.style.display = "inline-block";

              messageDiv.style.opacity = 0;
              targetDiv.style.opacity = 1;

          foregroundRotatingMessageArray.push(messageDiv);
          targetDiv.appendChild(messageDiv);
      }

      foregroundRotatingMessageArray = randomizeArray(foregroundRotatingMessageArray);

      for(var i=0;i<message.length;i++)
      {
          //gsap fade in each letter randomly
          gsap.to(foregroundRotatingMessageArray[i], {
            filter: "blur(0px)",
            scale: 1,
            opacity: 1,
            duration: 1,
            delay: i / 50,
            onComplete: function()
            {
                completeCounter++;

                if(completeCounter == foregroundRotatingMessageArray.length)
                {
                    //stop rotational background text animation
                    //stopAnimateBackgroundRotatingText();
                }
            }
          });
      }
  }

  //instead of a fade out, explode outwards towards the z axis
  function explodeOutForegroundText()
  {
      //rebuild foregroundRotatingMessageArray so they're not scrambled
      foregroundRotatingMessageArray = [];
      var mainTextDiv = document.getElementById("mainRotationText")

      for(var i=0;i<mainTextDiv.children.length;i++)
      {
          foregroundRotatingMessageArray.push(mainTextDiv.children[i]);
      }

      document.getElementById("rotatingTextContainer").style.perspective = "1000px";
      document.getElementById("rotatingTextContainer").style.transformStyle = "preserve-3d";

      gsap.set(foregroundRotatingMessageArray, {
          transformPerspective: 1000
      });

      for(var i=0;i<foregroundRotatingMessageArray.length;i++)
      {
          foregroundRotatingMessageArray[i].style.display = "inline-block";
          foregroundRotatingMessageArray[i].style.transformStyle = "preserve-3d";
          foregroundRotatingMessageArray[i].style.willChange = "transform, opacity";

          //gsap fade in each letter randomly
          gsap.to(foregroundRotatingMessageArray[i], {
            filter: "blur(4px)",
            opacity: 0,
            duration: 1.5,
            delay: i / 25,
            ease: "power2.in",
            z: Math.round(Math.sin((180 / foregroundRotatingMessageArray.length * i - 90) * (Math.PI/180)) * 3000),
            x: Math.round(Math.cos((180 / foregroundRotatingMessageArray.length * i - 90) * (Math.PI/180)) * 50) - 25,
          });
      }
  }

/*
  setTimeout(function(){ createRotatingMessageString("hello  giftagram,  my  name  is  kevin"); }, 1000);

  setTimeout(function(){ createRotatingMessageString("i  am  applying  for  your  entry/mid  level  front  end  developer"); }, 6000);

  setTimeout(function(){ createRotatingMessageString("click  anywhere  to  launch  my  portfolio  experience"); }, 12000);

  setTimeout(function(){ createRotatingMessageString(""); }, 20000);
*/
