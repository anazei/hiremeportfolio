  var mainNavArray = ["navDownloadCV", "navPortfolio", "navBehindScenes", "navSep1", "navSep2"];
  var nextPreviousArray = ["slideNavNext", "slideNavPrevious", "slideNavSep"];

  function navListeners()
  {
      document.getElementById("navDownloadCV").addEventListener("click", function(){
          lightupNavItem("navDownloadCV", mainNavArray);
      });

      document.getElementById("navPortfolio").addEventListener("click", function(){
          lightupNavItem("navPortfolio", mainNavArray);
      });

      document.getElementById("navBehindScenes").addEventListener("click", function(){
          lightupNavItem("navBehindScenes", mainNavArray);
      });

      document.getElementById("slideNavNext").addEventListener("click", function(){
          lightupNavItem("slideNavNext", nextPreviousArray);
      });

      document.getElementById("slideNavPrevious").addEventListener("click", function(){
          lightupNavItem("slideNavPrevious", nextPreviousArray);
      });
  }

  function lightupNavItem(divID, array)
  {
      for(let i=0;i<array.length;i++)
      {
          if(array[i] !== divID)
          {
              //non selected navs
              gsap.to("#" + array[i], {
                  alpha: .5,
                  filter: "blur(5px)",
                  duration: .35,
              });

              //restore non selected nav items
              setTimeout(function(){

                  for(var i=0;i<array.length;i++)
                  {
                      gsap.to("#" + array[i], {
                          alpha: 1,
                          filter: "blur(0px)",
                          duration: .35,
                      });
                  }
              }, 500);

          } else {

            //selected nav
            gsap.to("#" + array[i], {
                alpha: 1,
                filter: "drop-shadow(0px 0px 5px rgba(255, 255, 255, 1))",
                color: "white",
                duration: .75,
                onComplete: function(){

                    gsap.to("#" + this.targets()[0].id, {
                        alpha: 1,
                        filter: "drop-shadow(0px 0px 0px rgba(255, 255, 255, 0))",
                        color: "#FFFFFF",
                        duration: .35,
                    });
                }
            });
          }
      }
  }
