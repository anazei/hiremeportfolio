  var bufferBarArray = new Array();
  var bufferBarTextArray = new Array();
  var flashReadyBufferText = true;
  var bufferReadyTextDelayer;

  function initBufferBars()
  {
      var bufferBarTextContainer = document.getElementById("bufferBarText").children;

      //create 12 buffer bars
      for(var i=0;i<13;i++)
      {
          var newBufferBar = document.createElement("div");
              newBufferBar.className = "bufferBar";
              newBufferBar.style.scaleX = 0;
              newBufferBar.style.opacity = 0;
              newBufferBar.style.transformOrigin = "50% 50%";

          document.getElementById("bufferBarsContainer").appendChild(newBufferBar);

          bufferBarArray.push(newBufferBar);
      }

      for(var i=0;i<bufferBarTextContainer.length;i++)
      {
          bufferBarTextContainer[i].style.opacity = 0;

          bufferBarTextArray.push(bufferBarTextContainer[i]);
      }
  }

  function animateInBufferBars()
  {
      for(let i=0;i<bufferBarArray.length;i++)
      {
          gsap.fromTo(bufferBarArray[i],
              {
                  alpha: 0,
                  transformOrigin: "50% 50%"
              },
              {
                  alpha: 1,
                  duration: 1,
                  delay: i / 8,
              }
          );
      }

      for(let i=0;i<bufferBarTextArray.length;i++)
      {
          gsap.to(bufferBarTextArray[i],
          {
              alpha: 1,
              duration: .5,
              delay: i / 4,
              onComplete: function(){
                  if(i == bufferBarTextArray.length - 1)
                  {
                      bufferBarArray.reverse();
                      bufferBarTextArray.reverse();

                      flashBufferBarReadyText();
                  }
              }
          });
      }
  }

  function animateOutBufferBars()
  {
      for(var i=0;i<bufferBarArray.length;i++)
      {
          gsap.fromTo(bufferBarArray[i],
              {
                  scaleX: 1,
                  alpha: 1,
                  transformOrigin: "50% 50%"
              },
              {
                  alpha: 0,
                  scaleX: 0,
                  duration: .35,
                  delay: i / 25,
              }
          );
      }

      for(let i=0;i<bufferBarTextArray.length;i++)
      {
          gsap.to(bufferBarTextArray[i],
          {
              alpha: 0,
              duration: .5,
              delay: i / 25,
              onComplete: function(){
                  if(i == bufferBarTextArray.length - 1)
                  {
                      stopFlashBufferBarReadyText();
                  }
              }
          });
      }
  }

  function flashBufferBarReadyText()
  {
      var readyText = document.getElementById("bufferBarReadyText");
      var counter = 0;

      bufferReadyTextDelayer = setInterval(function(){

          if(flashReadyBufferText == true)
          {
              if(counter % 2 == 0)
              {
                  readyText.style.opacity = 1;
              } else {
                  readyText.style.opacity = 0;
              }

              counter++;
          } else {

              readyText.style.opacity = 0;
              clearInterval(bufferReadyTextDelayer)
          }

      }, 150)
  }

  function stopFlashBufferBarReadyText()
  {
      flashReadyBufferText = false;
  }

  initBufferBars();



  //animateInBufferBars();
  //animateOutBufferBars();
