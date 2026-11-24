  var heroTitleArray2 = new Array();
  var heroTitleArray3 = new Array();

  function createHeroTitle1(message)
  {
      var messageDiv2;
      var messageDiv;

      for(var i=0;i<message.length;i++)
      {
          messageDiv2 = document.createElement("span");
              messageDiv2.innerHTML = message[i];
              messageDiv2.style.marginRight = "4px";
              messageDiv2.style.filter = "blur(" + parseInt(message.length - i) + "px)";
              messageDiv2.style.scale = 1;
              messageDiv2.style.display = "inline-block";
              messageDiv2.style.opacity = 0;
              messageDiv2.style.color = "white";
              messageDiv2.style.position = "relative";

              if(window.screen.height < 500)
              {
                  messageDiv2.style.top = "30px";
              } else {
                  messageDiv2.style.top = "-15px";
              }

              messageDiv2.style.backgroundBlendMode = "normal";

          heroTitleArray2.push(messageDiv2);

          document.getElementById("heroTitle2").appendChild(messageDiv2);
      }

      var heroWidth = 1050;
      var heroHeight = 175

      if(window.screen.height < 500)
      {
          heroWidth = 1700; //1700
          heroHeight = 275; //275
      }

      //hero window animates in
      gsap.fromTo("#heroTitleMasterContainer",
        {
          width: 0,
          height: heroHeight,
          scaleX: 1,
          scaleY: 0,
          alpha: 0,
        },
        {
          width: heroWidth,
          height: heroHeight,
          scaleX: 1,
          scaleY: 1,
          alpha: 1,
          duration: .35,
          transformOrigin: "50% 50%",
        });

        for(let i=0;i<heroTitleArray2.length;i++)
        {
            gsap.to(heroTitleArray2[i], {
              alpha: 1,
              textShadow: "0 0 0px rgba(255, 255, 255, 1)",
              filter: "blur(0px)",
              duration: .75,
              delay: i / 90,
            });
        }

        gsap.to("#heroTitleContainer1", {
          x: 100,
          duration: 5,
        });

        gsap.to("#heroTitleContainer2", {
          x: -100,
          duration: 7,
        });
  }

  function createHeroTitle2(message)
  {
      var messageDiv;

      for(var i=0;i<message.length;i++)
      {
          var heroYPosition = 35;

          if(window.screen.height < 500)
          {
              heroYPosition = 85;
          }

          messageDiv2 = document.createElement("span");
              messageDiv2.innerHTML = message[i];
              messageDiv2.style.marginRight = "4px";
              messageDiv2.style.filter = "blur(" + parseInt(message.length - i) + "px)";
              messageDiv2.style.display = "inline-block";
              messageDiv2.style.opacity = 0;
              messageDiv2.style.color = "white";
              messageDiv2.style.position = "relative";
              messageDiv2.style.top = heroYPosition + "px";
              messageDiv2.style.backgroundBlendMode = "screen";

          heroTitleArray3.push(messageDiv2);

          document.getElementById("heroTitle3").appendChild(messageDiv2);
      }

      heroTitleArray3.reverse();

      for(let i=0;i<heroTitleArray3.length;i++)
      {
          gsap.to(heroTitleArray3[i], {
            alpha: 1,
            textShadow: "0 0 0px rgba(255, 255, 255, 1)",
            filter: "blur(0px)",
            duration: .5,
            delay: i / 150,
          });
      }
  }

  function animateOutHeroTitle()
  {
      for(let j=0;j<heroTitleArray2.length;j++)
      {
          gsap.to(heroTitleArray2[j], {
            alpha: 0,
            textShadow: "0 0 15px rgba(255, 255, 255, 1)",
            filter: "blur(15px)",
            duration: .75,
            delay: j / 100,
          });
      }

      setTimeout(function(){

          //animate out second hero title line
          for(var i=0;i<heroTitleArray3.length;i++)
          {
              gsap.to(heroTitleArray3[i], {
                alpha: 0,
                textShadow: "0 0 15px rgba(255, 255, 255, 1)",
                filter: "blur(15px)",
                duration: .75,
                delay: i / 50,
              });
          }

          //close hero window
          gsap.to("#heroTitleMasterContainer",
          {
            scaleX: 0,
            scaleY: 0,
            alpha: 0,
            duration: .35,
            delay: 1,
            transformOrigin: "50% 50%",
          });

      }, 500);
  }

  //createHeroTitle1("gift  giving  isn't  just  about  giving  things . . .");
  //animateOutHeroTitle()
