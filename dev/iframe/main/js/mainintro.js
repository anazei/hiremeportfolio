  /*
    This is the main page story key frames intro function
  */

  /////////////////////////////////Animation API Methods////////////////////////

  //animateInGridCrossBackground();
  //animateBackgroundGrid(5, 15)
  //animateRollingGrid(15, 20)
  //animateOutGridCrossBackground()
  //instantRedraw()
  //circularGridAnimation(25, 25, 10)

  //createHeroTitle1("gift  giving  isn't  just  about  giving  things . . .");

  //animateInProgressBarContainer();
  //animateOutProgressBarContainer();

  //animateInBufferBars();
  //animateOutBufferBars();

  //createCircleSpinner();
  //fadeOutCircleSpinner();

  /*
    createStoryWords("hello world hello world hello world", 100, 100, "storyText", function(messageDiv, i){
        gsap.fromTo(messageDiv,
          {
            y: 5,
            scale: 2,
            alpha: 0,
            filter: "blur(2px)",

          },
          {
            y: 0,
            scale: 1,
            filter: "blur(0px)",
          duration: .35,
          alpha: 1,
          delay: i / 25,
          ease: "Power2.in",
        });
    });

    createStoryCharacters("hello world hello world hello world", 100, 100, "storyText", function(messageDiv, i){
        gsap.fromTo(messageDiv,
          {
            y: 5,
            scale: 2,
            alpha: 0,
            filter: "blur(2px)",

          },
          {
            y: 0,
            scale: 1,
            filter: "blur(0px)",
          duration: .35,
          alpha: 1,
          delay: i / 25,
          ease: "Power2.in",
        });
    });

    createStoryWords("hello world hello world hello world", 250, 250, "storyText2", function(messageDiv, i){
        gsap.fromTo(messageDiv,
          {
            y: i % 2 == 0 ? -Math.round(Math.random() * 25) + 15 : Math.round(Math.random() * 15) + 25,
            alpha: 0,
          },
          {
            y: 0,
          duration: 1,
          alpha: 1,
          delay: i / 7,
          ease: "Power2.in",
        });
    });
  */
    //fadeOutAllStoryText("storyText", false)
    //fadeOutAllStoryText("storyText2", true)

  function startMainPage()
  {
      //keyframe
      //setTimeout(function(){
      //}, 100);

      createCircleSpinner();

      //keyframe
      setTimeout(function(){

          animateInBufferBars();

      }, 1000);

      //keyframe
      setTimeout(function(){

          //fadeOutCircleSpinner();

      }, 1500);

      //keyframe
      setTimeout(function(){

          selectMask(maskwall, "images/background1.jpg");

      }, 2000);

      //keyframe
      setTimeout(function(){

          animateInGridCrossBackground();

      }, 2500);

      //keyframe
      setTimeout(function(){

          animateRollingGrid(15, 22);

      }, 3500);

      //keyframe
      setTimeout(function(){

          animateOutBufferBars();

      }, 4000);

      //keyframe
      setTimeout(function(){

          //circularGridAnimation(5, 25, 5)

      }, 4250);

      //keyframe
      setTimeout(function(){

          animateInProgressBarContainer();

      }, 4500);

      //keyframe
      setTimeout(function(){

          createHeroTitle1("gift  giving  isn't  just  about  giving  things . . .");

      }, 5250);

      //keyframe
      setTimeout(function(){

          animateRollingGrid(30, 36);

      }, 8000);

      //keyframe
      setTimeout(function(){

          animateOutHeroTitle();

      }, 9000);

      //keyframe
      setTimeout(function(){

          animateRollingGrid(10, 20);
          //animateBackgroundGrid(10, 20)

      }, 10250);

      //keyframe
      setTimeout(function(){

          animateOutProgressBarContainer();

      }, 11000);

      //keyframe
      setTimeout(function(){

          selectMask(maskwall, "images/background2.jpg");

      }, 11500);

      //keyframe
      setTimeout(function(){

          animateOutGridCrossBackground();

      }, 12500);

      //keyframe
      setTimeout(function(){

          beginTellStory();

      }, 13000);

      //keyframe
      setTimeout(function(){

          selectMask(crossfade, "images/bluebg.jpg");

          //start snow animation
          requestAnimationFrame(animateSnow);

      }, 14500);
  }

  function beginTellStory()
  {
      //keyframe
      setTimeout(function(){
      }, 0);

      //keyframe
      setTimeout(function(){

          var xPosition = 50;
          var yPosition = 500;

          createStoryCharacters("I CAN HELP YOU CRAFT UNFORGETTABLE STORIES", xPosition, yPosition, "storyText", function(messageDiv, i){
              gsap.fromTo(messageDiv,
                {
                  y: 5,
                  scale: 1,
                  alpha: 0,
                  //shadowText: "0px 0px 50px rgba(250, 188, 102, 1)",
                },
                {
                  //shadowText: "0px 0px 50px rgba(250, 188, 102, 1)",
                  y: 0,
                  scale: 1,
                duration: .35,
                alpha: 1,
                delay: i / 50,
              });
          });

      }, 25);

      //keyframe
      setTimeout(function(){

          var xPosition = 50;
          var yPosition = 500;

          createStoryWords(" FOR YOUR CLIENTS", xPosition, yPosition, "storyText", function(messageDiv, i){
              gsap.fromTo(messageDiv,
                {
                  y: 5,
                  scale: 3,
                  alpha: 0,
                  filter: "blur(5px)",
                },
                {
                  y: 0,
                  scale: 1,
                  filter: "blur(0px)",
                duration: 1,
                alpha: 1,
                delay: i / 25,
              });
          });

      }, 1500);

      //keyframe
      setTimeout(function(){

          var xPosition = 900;
          var yPosition = 550;

          createStoryCharacters("THROUGH INTERACTIVE FRONT END EXPERIENCES", xPosition, yPosition, "storyText2", function(messageDiv, i){
              gsap.fromTo(messageDiv,
                {
                  y: -5,
                  scale: 1,
                  alpha: 0,
                  filter: "blur(2px)",
                },
                {
                  y: 0,
                  scale: 1,
                  filter: "blur(0px)",
                duration: .5,
                alpha: 1,
                delay: i / 35,
              });
          });

      }, 3500);

      //keyframe
      setTimeout(function(){

          fadeOutAllStoryText("storyText", false);

      }, 4000);

      //keyframe
      setTimeout(function(){

          fadeOutAllStoryText("storyText2", false);

      }, 6500);

      //keyframe
      setTimeout(function(){

          var xPosition = 50;
          var yPosition = 500;

          createStoryCharacters("SO THEY CAN SUCCESSFULLY BUILD", xPosition, yPosition, "storyText3", function(messageDiv, i){
              gsap.fromTo(messageDiv,
                {
                  y: 5,
                  scale: 1,
                  alpha: 0,
                  filter: "blur(5px)",
                },
                {
                  y: 0,
                  scale: 1,
                  filter: "blur(0px)",
                duration: 1,
                alpha: 1,
                delay: i / 25,
              });
          });

      }, 6500);

      //keyframe
      setTimeout(function(){

        var xPosition = 745;
        var yPosition = 500;

        createStoryCharactersRandom("RELATIONSHIPS", xPosition, yPosition, "storyText4", function(messageDiv, i){
            gsap.fromTo(messageDiv,
              {
                y: -5,
                //scale: 0.5,
                alpha: 0,
                filter: "blur(5px)",
              },
              {
                y: 0,
                //scale: 1,
                filter: "blur(0px)",
              duration: 1,
              alpha: 1,
              delay: i / 25,
            });
        });

      }, 7500);

      //keyframe
      setTimeout(function(){

        var xPosition = 745;
        var yPosition = 550;

        createStoryCharactersRandom("REFERRALS", xPosition, yPosition, "storyText5", function(messageDiv, i){
            gsap.fromTo(messageDiv,
              {
                //y: 5,
                scale: 0.5,
                alpha: 0,
                filter: "blur(5px)",
              },
              {
                //y: 0,
                scale: 1,
                filter: "blur(0px)",
              duration: 1,
              alpha: 1,
              delay: i / 25,
            });
        });

      }, 8000);

      //keyframe
      setTimeout(function(){

        var xPosition = 745;
        var yPosition = 600;

        createStoryCharactersRandom("AND REPEAT SALES", xPosition, yPosition, "storyText6", function(messageDiv, i){
            gsap.fromTo(messageDiv,
              {
                //y: 5,
                scale: 2,
                alpha: 0,
                filter: "blur(5px)",
              },
              {
                //y: 0,
                scale: 1,
                filter: "blur(0px)",
              duration: 1,
              alpha: 1,
              delay: i / 50,
            });
        });

      }, 8500);

      //keyframe
      setTimeout(function(){

          fadeOutAllStoryText("storyText3", false);

      }, 9500);

      //keyframe
      setTimeout(function(){

          fadeOutAllStoryText("storyText4", false);

          setTimeout(function(){ fadeOutAllStoryText("storyText5", false); }, 250);

          setTimeout(function(){ fadeOutAllStoryText("storyText6", false); }, 750);

      }, 10250);

      //keyframe
      setTimeout(function(){

        var xPosition = 1000;
        var yPosition = 500;

        createStoryCharactersRandom("I AM APPLYING AS A FRONT END DEVELOPER", xPosition, yPosition, "storyText", function(messageDiv, i){
            gsap.fromTo(messageDiv,
              {
                y: 5,
                scale: 2,
                alpha: 0,
                filter: "blur(5px)",
              },
              {
                y: 0,
                scale: 1,
                filter: "blur(0px)",
              duration: 1,
              alpha: 1,
              delay: i / 75,
            });
        });

      }, 11500);

      //keyframe
      setTimeout(function(){

          fadeOutAllStoryText("storyText", false);

      }, 14000);

      //keyframe
      setTimeout(function(){

          var xPosition = 50;
          var yPosition = 500;

          createStoryCharacters("BUT I AM ALSO CAPABLE OF HELPING MAINTAIN", xPosition, yPosition, "storyText2", function(messageDiv, i){
              gsap.fromTo(messageDiv,
                {
                  y: 5,
                  scale: 1,
                  alpha: 0,
                  //filter: "blur(5px)",
                },
                {
                  y: 0,
                  scale: 1,
                  //filter: "blur(0px)",
                duration: .75,
                alpha: 1,
                delay: i / 50,
              });
          });

      }, 14250);

      //keyframe
      setTimeout(function(){

          fadeOutAllStoryText("storyText2", true);

      }, 16500);

      //keyframe
      setTimeout(function(){

          var xPosition = 50;
          var yPosition = 500;

          createStoryCharacters("YOUR SaaS SOFTWARE INFRASTRUCTURE", xPosition, yPosition, "storyText3", function(messageDiv, i){
              gsap.fromTo(messageDiv,
                {
                  x: -5,
                  scale: 1,
                  alpha: 0,
                  //filter: "blur(5px)",
                },
                {
                  x: 0,
                  scale: 1,
                  //filter: "blur(0px)",
                duration: .75,
                alpha: 1,
                delay: i / 50,
              });
          });

      }, 17500);

      //keyframe
      setTimeout(function(){

          fadeOutAllStoryText("storyText3", true);

      }, 19000);

      //keyframe
      setTimeout(function(){

          var xPosition = 50;
          var yPosition = 500;

          createStoryCharacters("OR WORK ON YOUR SALESFORCE PLUGIN", xPosition, yPosition, "storyText4", function(messageDiv, i){
              gsap.fromTo(messageDiv,
                {
                  x: -5,
                  scale: 1,
                  alpha: 0,
                  //filter: "blur(5px)",
                },
                {
                  x: 0,
                  scale: 1,
                  //filter: "blur(0px)",
                duration: .75,
                alpha: 1,
                delay: i / 50,
              });
          });

      }, 20000);

      //keyframe
      setTimeout(function(){

        var xPosition = 825;
        var yPosition = 500;

        createStoryCharactersRandom("THAT YOUR CLIENTS RELY ON", xPosition, yPosition, "storyText5", function(messageDiv, i){
            gsap.fromTo(messageDiv,
              {
                x: 5,
                //scale: 2,
                alpha: 0,
                filter: "blur(10px)",
              },
              {
                x: 0,
                //scale: 1,
                filter: "blur(0px)",
              duration: .75,
              alpha: 1,
              delay: i / 50,
            });
        });

      }, 21000);

      //keyframe
      setTimeout(function(){

          fadeOutAllStoryText("storyText4", true);

      }, 23250);

      //keyframe
      setTimeout(function(){

          fadeOutAllStoryTextRandom("storyText5", false);

      }, 23300);

      //keyframe
      setTimeout(function(){

          var xPosition = 50;
          var yPosition = 500;

          createStoryCharactersRandom("FOR THEIR AUTOMATED GIFT LOGISTICS", xPosition, yPosition, "storyText6", function(messageDiv, i){
              gsap.fromTo(messageDiv,
                {
                  x: 5,
                  //scale: 2,
                  alpha: 0,
                  filter: "blur(10px)",
                },
                {
                  x: 0,
                  //scale: 1,
                  filter: "blur(0px)",
                duration: .5,
                alpha: 1,
                delay: i / 50,
              });
          });

      }, 23000);

      //keyframe
      setTimeout(function(){

          fadeOutAllStoryText("storyText6", true);

      }, 26500);

      //keyframe
      setTimeout(function(){

          var xPosition = 50;
          var yPosition = 500;

          createStoryCharactersRandom("I HAVE STRONG TECHNICAL ", xPosition, yPosition, "storyText", function(messageDiv, i){
              gsap.fromTo(messageDiv,
                {
                  x: 5,
                  //scale: 2,
                  alpha: 0,
                  filter: "blur(10px)",
                },
                {
                  x: 0,
                  //scale: 1,
                  filter: "blur(0px)",
                duration: 1,
                alpha: 1,
                delay: i / 50,
              });
          });

      }, 28000);

      //keyframe
      setTimeout(function(){

        var xPosition = 50;
        var yPosition = 500;

        createStoryCharactersRandom("AND PROBLEM SOLVING EXPERIENCE", xPosition, yPosition, "storyText", function(messageDiv, i){
            gsap.fromTo(messageDiv,
              {
                x: -5,
                //scale: 2,
                alpha: 0,
                filter: "blur(10px)",
              },
              {
                x: 0,
                //scale: 1,
                filter: "blur(0px)",
              duration: 1,
              alpha: 1,
              delay: i / 50,
            });
        });

      }, 29500);

      //keyframe
      setTimeout(function(){

          fadeOutAllStoryText("storyText", true);

      }, 32000);

      //keyframe
      setTimeout(function(){

        var xPosition = 1300;
        var yPosition = 500;

        createStoryCharactersRandom("DESIGNING AND BUILDING", xPosition, yPosition, "storyText2", function(messageDiv, i){
            gsap.fromTo(messageDiv,
              {
                x: -5,
                //scale: 2,
                alpha: 0,
                filter: "blur(10px)",
              },
              {
                x: 0,
                //scale: 1,
                filter: "blur(0px)",
              duration: 1,
              alpha: 1,
              delay: i / 50,
            });
        });

      }, 32250);

      //keyframe
      setTimeout(function(){

        var xPosition = 50;
        var yPosition = 500;

        createStoryCharacters("BUSINESS AUTOMATION AND INFRASTRUCTURE ", xPosition, 500, "storyText3", function(messageDiv, i){
            gsap.fromTo(messageDiv,
              {
                x: 5,
                //scale: 2,
                alpha: 0,
                //filter: "blur(10px)",
              },
              {
                x: 0,
                //scale: 1,
                //filter: "blur(0px)",
              duration: 1,
              alpha: 1,
              delay: i / 75,
            });
        });

      }, 34000);

      //keyframe
      setTimeout(function(){

          fadeOutAllStoryText("storyText2", false);

      }, 34500);

      //keyframe
      setTimeout(function(){

        var xPosition = 50;
        var yPosition = 500;

        createStoryCharacters("FROM SCRATCH", xPosition, yPosition, "storyText3", function(messageDiv, i){
            gsap.fromTo(messageDiv,
              {
                x: -5,
                //scale: 2,
                alpha: 0,
                //filter: "blur(10px)",
              },
              {
                x: 0,
                //scale: 1,
                //filter: "blur(0px)",
              duration: 1,
              alpha: 1,
              delay: i / 75,
            });
        });

      }, 35750);

      //keyframe
      setTimeout(function(){

          fadeOutAllStoryText("storyText3", false);

      }, 37000);

      //keyframe
      setTimeout(function(){

        var xPosition = 50;
        var yPosition = 500;

        createStoryCharacters("INCLUDING A LARGE SCALE DAILY DATA INGEST PROCESS", xPosition, yPosition, "storyText4", function(messageDiv, i){
            gsap.fromTo(messageDiv,
              {
                x: 50,
                //scale: 2,
                alpha: 0,
                //filter: "blur(10px)",
              },
              {
                x: 0,
                //scale: 1,
                //filter: "blur(0px)",
              duration: 2,
              alpha: 1,
              delay: i / 75,
            });
        });

      }, 37500);

      //keyframe
      setTimeout(function(){

        var xPosition = 50;
        var yPosition = 550;

        createStoryCharacters("A REAL ESTATE VECTOR SEARCH API", xPosition, yPosition, "storyText5", function(messageDiv, i){
            gsap.fromTo(messageDiv,
              {
                x: 50,
                //scale: 2,
                alpha: 0,
                //filter: "blur(10px)",
              },
              {
                x: 0,
                //scale: 1,
                //filter: "blur(0px)",
              duration: 2,
              alpha: 1,
              delay: i / 75,
            });
        });

      }, 38500);

      //keyframe
      setTimeout(function(){

        var xPosition = 50;
        var yPosition = 600;

        createStoryCharacters("A CUSTOM CALENDAR SCHEDULING SERVICE", xPosition, yPosition, "storyText6", function(messageDiv, i){
            gsap.fromTo(messageDiv,
              {
                x: 50,
                //scale: 2,
                alpha: 0,
                //filter: "blur(10px)",
              },
              {
                x: 0,
                //scale: 1,
                //filter: "blur(0px)",
              duration: 2,
              alpha: 1,
              delay: i / 75,
            });
        });

      }, 39500);

      //keyframe
      setTimeout(function(){

        var xPosition = 50;
        var yPosition = 650;

        createStoryCharacters("HUBSPOT CRM INTEGRATION", xPosition, yPosition, "storyText", function(messageDiv, i){
            gsap.fromTo(messageDiv,
              {
                x: 50,
                //scale: 2,
                alpha: 0,
                //filter: "blur(10px)",
              },
              {
                x: 0,
                //scale: 1,
                //filter: "blur(0px)",
              duration: 2,
              alpha: 1,
              delay: i / 75,
            });
        });

      }, 40500);

      //keyframe
      setTimeout(function(){

        var xPosition = 50;
        var yPosition = 700;

        createStoryCharacters("AND SHIPPING CARRIER API INTEGRATIONS", xPosition, yPosition, "storyText2", function(messageDiv, i){
            gsap.fromTo(messageDiv,
              {
                x: 50,
                //scale: 2,
                alpha: 0,
                //filter: "blur(10px)",
              },
              {
                x: 0,
                //scale: 1,
                //filter: "blur(0px)",
              duration: 2,
              alpha: 1,
              delay: i / 75,
            });
        });

      }, 41500);

      //keyframe
      setTimeout(function(){

        fadeOutAllStoryText("storyText4", false);
        fadeOutAllStoryText("storyText5", false);
        fadeOutAllStoryText("storyText6", false);
        fadeOutAllStoryText("storyText", false);
        fadeOutAllStoryText("storyText2", false);

      }, 46000);

      //keyframe
      setTimeout(function(){

        var xPosition = 50;
        var yPosition = 500;

        createStoryCharacters("I HAVE THE TECH SKILLS ", xPosition, yPosition, "storyText3", function(messageDiv, i){
            gsap.fromTo(messageDiv,
              {
                x: -5,
                y: -5,
                //scale: 2,
                alpha: 0,
                //filter: "blur(10px)",
              },
              {
                x: 0,
                y: 0,
                //scale: 1,
                //filter: "blur(0px)",
              duration: .75,
              alpha: 1,
              delay: i / 75,
            });
        });

      }, 48000);

      //keyframe
      setTimeout(function(){

        var xPosition = 50;
        var yPosition = 500;

        createStoryCharacters("BUT I ALSO UNDERSTAND THE BUSINESS SIDE", xPosition, yPosition, "storyText3", function(messageDiv, i){
            gsap.fromTo(messageDiv,
              {
                x: 5,
                y: 5,
                //scale: 2,
                alpha: 0,
                //filter: "blur(0px)",
              },
              {
                x: 0,
                y: 0,
                //scale: 1,
                //filter: "blur(0px)",
              duration: .75,
              alpha: 1,
              delay: i / 75,
            });
        });

      }, 50000);

      //keyframe
      setTimeout(function(){

        fadeOutAllStoryText("storyText3", false);

      }, 51000);

      //keyframe
      setTimeout(function(){

        var xPosition = 50;
        var yPosition = 500;

        createStoryCharacters("I UNDERSTAND THAT EVERY DECISION ", xPosition, yPosition, "storyText5", function(messageDiv, i){
            gsap.fromTo(messageDiv,
              {
                //x: 0,
                //y: 0,
                //scale: 2,
                alpha: 0,
                //filter: "blur(10px)",
              },
              {
                //x: 0,
                //y: 0,
                //scale: 1,
                //filter: "blur(0px)",
              duration: .75,
              alpha: 1,
              delay: i / 75,
            });
        });

      }, 52500);

      //keyframe
      setTimeout(function(){

        var xPosition = 50;
        var yPosition = 500;

        createStoryCharacters("SHOULD HELP LEAD", xPosition, yPosition, "storyText5", function(messageDiv, i){
            gsap.fromTo(messageDiv,
              {
                //x: 0,
                y: 10,
                //scale: 2,
                alpha: 0,
                //filter: "blur(10px)",
              },
              {
                //x: 0,
                y: 0,
                //scale: 1,
                //filter: "blur(0px)",
              duration: .75,
              alpha: 1,
              delay: i / 50,
            });
        });

      }, 53750);

      //keyframe
      setTimeout(function(){

          instantFadeOutStoryText("storyText5")

      }, 55250);

      //keyframe
      setTimeout(function(){

        var xPosition = 50;
        var yPosition = 500;

        createStoryCharacters("TO MORE EVENTUAL BUSINESS GROWTH AND SALES", xPosition, yPosition, "storyText6", function(messageDiv, i){
            gsap.fromTo(messageDiv,
              {
                //x: 0,
                //y: 0,
                //scale: 2,
                alpha: 0,
                //filter: "blur(10px)",
              },
              {
                //x: 0,
                //y: 0,
                //scale: 1,
                //filter: "blur(0px)",
              duration: .75,
              alpha: 1,
              delay: i / 75,
            });
        });

      }, 55500);

      //keyframe
      setTimeout(function(){

        fadeOutAllStoryText("storyText6");

      }, 57000);

      //keyframe
      setTimeout(function(){

        var xPosition = 50;
        var yPosition = 500;

        createStoryCharacters("SO THIS IS AN OPPORTUNITY FOR YOU ", xPosition, yPosition, "storyText", function(messageDiv, i){
            gsap.fromTo(messageDiv,
              {
                //x: 0,
                //y: 0,
                //scale: 2,
                alpha: 0,
                //filter: "blur(10px)",
              },
              {
                //x: 0,
                //y: 0,
                //scale: 1,
                //filter: "blur(0px)",
              duration: .75,
              alpha: 1,
              delay: i / 75,
            });
        });

      }, 57500);

      //keyframe
      setTimeout(function(){

        instantFadeOutStoryText("storyText")

        var xPosition = 50;
        var yPosition = 500;

        createStoryCharacters("TO TAKE ADVANTAGE OF MY EXPERIENCE IN ", xPosition, yPosition, "storyText", function(messageDiv, i){
            gsap.fromTo(messageDiv,
              {
                //x: 0,
                //y: 0,
                //scale: 2,
                alpha: 0,
                //filter: "blur(10px)",
              },
              {
                //x: 0,
                //y: 0,
                //scale: 1,
                //filter: "blur(0px)",
              duration: .75,
              alpha: 1,
              delay: i / 75,
            });
        });

      }, 60000);

      //keyframe
      setTimeout(function(){

        var xPosition = 50;
        var yPosition = 550;

        createStoryCharacters("GRAPHIC DESIGN ", xPosition, yPosition, "storyText2", function(messageDiv, i){
            gsap.fromTo(messageDiv,
              {
                x: -15,
                //y: 0,
                //scale: 2,
                alpha: 0,
                //filter: "blur(10px)",
              },
              {
                x: 0,
                //y: 0,
                //scale: 1,
                //filter: "blur(0px)",
              duration: 1,
              alpha: 1,
              delay: i / 75,
            });
        });

      }, 61000);

      //keyframe
      setTimeout(function(){

        var xPosition = 50;
        var yPosition = 600;

        createStoryCharacters("COMPUTER SCIENCE ", xPosition, yPosition, "storyText3", function(messageDiv, i){
            gsap.fromTo(messageDiv,
              {
                x: -15,
                //y: 0,
                //scale: 2,
                alpha: 0,
                //filter: "blur(10px)",
              },
              {
                x: 0,
                //y: 0,
                //scale: 1,
                //filter: "blur(0px)",
              duration: 1,
              alpha: 1,
              delay: i / 75,
            });
        });

      }, 62000);

      //keyframe
      setTimeout(function(){

        var xPosition = 50;
        var yPosition = 650;

        createStoryCharacters("COMPUTER GRAPHICS ", xPosition, yPosition, "storyText4", function(messageDiv, i){
            gsap.fromTo(messageDiv,
              {
                x: -15,
                //y: 0,
                //scale: 2,
                alpha: 0,
                //filter: "blur(10px)",
              },
              {
                x: 0,
                //y: 0,
                //scale: 1,
                //filter: "blur(0px)",
              duration: 1,
              alpha: 1,
              delay: i / 75,
            });
        });

      }, 63000);

      //keyframe
      setTimeout(function(){

        var xPosition = 50;
        var yPosition = 700;

        createStoryCharacters("WEB AND SOFTWARE DEVELOPMENT ", xPosition, yPosition, "storyText5", function(messageDiv, i){
            gsap.fromTo(messageDiv,
              {
                x: -15,
                //y: 0,
                //scale: 2,
                alpha: 0,
                //filter: "blur(10px)",
              },
              {
                x: 0,
                //y: 0,
                //scale: 1,
                //filter: "blur(0px)",
              duration: 1,
              alpha: 1,
              delay: i / 75,
            });
        });

      }, 64000);

      //keyframe
      setTimeout(function(){

          fadeOutAllStoryText("storyText");
          fadeOutAllStoryText("storyText2");
          fadeOutAllStoryText("storyText3");
          fadeOutAllStoryText("storyText4");
          fadeOutAllStoryText("storyText5");

      }, 66000);

      //keyframe
      setTimeout(function(){

        var xPosition = 850;
        var yPosition = 500;

        createStoryCharacters("ONE DAY", xPosition, yPosition, "storyText6", function(messageDiv, i){
            gsap.fromTo(messageDiv,
              {
                x: -15,
                //y: 0,
                //scale: 2,
                alpha: 0,
                //filter: "blur(10px)",
              },
              {
                x: 0,
                //y: 0,
                //scale: 1,
                //filter: "blur(0px)",
              duration: 1,
              alpha: 1,
              delay: i / 75,
            });
        });

      }, 68500);

      //keyframe
      setTimeout(function(){

          fadeOutAllStoryText("storyText6");

      }, 70250);

      //keyframe
      setTimeout(function(){

        var xPosition = 50;
        var yPosition = 500;

        createStoryCharacters("WHENEVER A SPECIAL OCCASSION ARISES OR A DEAL CLOSES", xPosition, yPosition, "storyText", function(messageDiv, i){
            gsap.fromTo(messageDiv,
              {
                x: -15,
                //y: 0,
                //scale: 2,
                alpha: 0,
                //filter: "blur(10px)",
              },
              {
                x: 0,
                //y: 0,
                //scale: 1,
                //filter: "blur(0px)",
              duration: 1,
              alpha: 1,
              delay: i / 75,
            });
        });

      }, 70500);

      //keyframe
      setTimeout(function(){

          fadeOutAllStoryText("storyText", false);

      }, 73000);

      //keyframe
      setTimeout(function(){

        var xPosition = 50;
        var yPosition = 500;

        createStoryCharacters("EVERY SALESPERSON WILL AUTOMATICALLY RECEIVE ", xPosition, yPosition, "storyText2", function(messageDiv, i){
            gsap.fromTo(messageDiv,
              {
                x: -15,
                //y: 0,
                //scale: 2,
                alpha: 0,
                //filter: "blur(10px)",
              },
              {
                x: 0,
                //y: 0,
                //scale: 1,
                //filter: "blur(0px)",
              duration: 1,
              alpha: 1,
              delay: i / 75,
            });
        });

      }, 74500);

      //keyframe
      setTimeout(function(){

          selectMaskVideoSource(crossfade, "pianoVideo");

      }, 76000);

      //keyframe
      setTimeout(function(){

          fadeOutAllStoryText("storyText2", false);

      }, 77000);

      //keyframe
      setTimeout(function(){

        var xPosition = 50;
        var yPosition = 500;

        createStoryCharacters("A CUSTOM GIFTAGRAM PURCHASE REMINDER", xPosition, yPosition, "storyText3", function(messageDiv, i){
            gsap.fromTo(messageDiv,
              {
                x: -15,
                //y: 0,
                //scale: 2,
                alpha: 0,
                //filter: "blur(10px)",
              },
              {
                x: 0,
                //y: 0,
                //scale: 1,
                //filter: "blur(0px)",
              duration: 1,
              alpha: 1,
              delay: i / 75,
            });
        });

      }, 77250);

      //keyframe
      setTimeout(function(){

          fadeOutAllStoryText("storyText3", true);

      }, 79500);

      //keyframe
      setTimeout(function(){

        var xPosition = 50;
        var yPosition = 500;

        createStoryCharacters("TO AUTHORIZE A GIFT WITH ONE CLICK", xPosition, yPosition, "storyText4", function(messageDiv, i){
            gsap.fromTo(messageDiv,
              {
                x: -15,
                //y: 0,
                //scale: 2,
                alpha: 0,
                //filter: "blur(10px)",
              },
              {
                x: 0,
                //y: 0,
                //scale: 1,
                //filter: "blur(0px)",
              duration: 1,
              alpha: 1,
              delay: i / 75,
            });
        });

      }, 80000);

      //keyframe
      setTimeout(function(){

          fadeOutAllStoryText("storyText4", true);

      }, 83000);

      //keyframe
      setTimeout(function(){

          selectMask(maskwall, "images/splashbackground.jpg");

      }, 83250);

      //keyframe
      setTimeout(function(){

        var xPosition = 400;
        var yPosition = 500;

        createStoryCharactersRandom("HIRE ME GIFTAGRAM AND LET ME HELP YOU MAKE IT HAPPEN", xPosition, yPosition, "storyText5", function(messageDiv, i){
            gsap.fromTo(messageDiv,
              {
                //x: 0,
                //y: 0,
                scale: 2,
                alpha: 0,
                filter: "blur(10px)",
              },
              {
                //x: 0,
                //y: 0,
                scale: 1,
                filter: "blur(0px)",
              duration: .75,
              alpha: 1,
              delay: i / 55,
            });
        });

      }, 84000);

      //keyframe
      setTimeout(function(){

        var xPosition = 675;
        var yPosition = 550;

        createStoryCharactersRandom("LET'S TALK AT (647) 741-0039", xPosition, yPosition, "storyText6", function(messageDiv, i){
            gsap.fromTo(messageDiv,
              {
                //x: 0,
                //y: 0,
                //scale: 2,
                alpha: 0,
                filter: "blur(10px)",
              },
              {
                //x: 0,
                //y: 0,
                //scale: 1,
                filter: "blur(0px)",
              duration: 1,
              alpha: 1,
              delay: i / 50,
            });
        });

      }, 85000);

      //keyframe
      setTimeout(function(){

          initGiftagramLogo();
          animateInLogo();

          animateInGridCrossBackground();

      }, 86000);

      //keyframe
      setTimeout(function(){

        fadeInMainPage()

      }, 89000);

      //keyframe
      //setTimeout(function(){
      //}, 0);
  }
