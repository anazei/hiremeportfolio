  var rotateCircleSpinner = true;
  var circleSpinnerDelayer;
  var circleSpinnerAngle = 0;
  var circleSpinnerArray = new Array();

  function createCircleSpinner()
  {
      for(var i=0;i<18;i++)
      {
          const angle = (i / 18) * Math.PI * 2;
          const degrees = angle * 180 / Math.PI + 90;

          const rectangle = document.createElement("div");
                rectangle.className = "rectangle";
                rectangle.style.left = (Math.cos(angle) * 30 - 20 / 2 + 80) + "px";
                rectangle.style.top = (Math.sin(angle) * 30 - 50 / 2 + 100) + "px";
                rectangle.style.transform = `rotate3d(0, 0, 1, ${degrees}deg)`;
                rectangle.style.opacity = 0;

          document.getElementById("circleContainer").appendChild(rectangle);

          circleSpinnerArray.push(rectangle);
      }
/*
      circleSpinnerDelayer = setInterval(function(){

          if(rotateCircleSpinner == true)
          {
              document.getElementById("circleContainer").style.transform = "rotate(" + circleSpinnerAngle + "deg)"

              circleSpinnerAngle += 1;

          } else {
              clearInterval(circleSpinnerDelayer);
          }

      }, 100);
*/
      infiniteCircleSpinnerfadeInOut();
  }

  function infiniteCircleSpinnerfadeInOut()
  {
      for(let i=0;i<circleSpinnerArray.length;i++)
      {
          gsap.to(circleSpinnerArray[i], {
              alpha: 1,
              duration: .35,
              delay: i / 15,
              onComplete: function()
              {
                  gsap.to(circleSpinnerArray[i], {
                      alpha: 0,
                      duration: .5,
                  });

                  if(i == circleSpinnerArray.length - 2)
                  {
                      if(rotateCircleSpinner == true)
                      {
                          //infiniteCircleSpinnerfadeInOut();
                      }
                  }
              }
          });
      }
  }

  function fadeOutCircleSpinner()
  {
      rotateCircleSpinner = false;
  }

  //createCircleSpinner();
  //fadeOutCircleSpinner();
