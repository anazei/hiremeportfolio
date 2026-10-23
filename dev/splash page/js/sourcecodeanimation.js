  var masterCodeCounter = 0;
  var masterCode = document.getElementById("masterCode");
  var masterCodeTotal = masterCode.children[0].children.length;

  //start with zero visibility state
  function initSourceCodeVisibility()
  {
      for(var i=0;i<masterCodeTotal;i++)
      {
          masterCode.children[0].children[i].style.opacity = 0;
          masterCode.children[0].children[i].style.scale = 1.01;
      }
  }

  //animate in rolling source code
  function animateInMasterSourceCode()
  {
      var delayer = setInterval(function(){

        if(masterCodeCounter !== masterCodeTotal)
        {
            var currentNode = masterCode.children[0].children[masterCodeCounter];

            gsap.to(currentNode, {
              scale: 1,
              delay: masterCodeCounter / 550,
              duration: .35,
              opacity: 1,
              z: 0
            });

            masterCodeCounter++;
        } else {
            masterCodeCounter = 0;
            clearInterval(delayer);
        }

      }, 25);
  }

  //animate out rolling source code
  function animateOutMasterSourceCode()
  {
      var delayer = setInterval(function(){

        if(masterCodeCounter !== masterCodeTotal)
        {
            var currentNode = masterCode.children[0].children[masterCodeCounter];

            gsap.to(currentNode, {
              scale: 0.99,
              delay: masterCodeCounter / 1250,
              duration: .25,
              opacity: 0,
              z: 0
            });

            masterCodeCounter++;
        } else {
            masterCodeCounter = 0;
            clearInterval(delayer);
        }

      }, 25);
  }

  initSourceCodeVisibility();
  //animateInMasterSourceCode();
  //animateOutMasterSourceCode();
