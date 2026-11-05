"use strict";
var Maskwall = function(masterReference, mainCanvas)
{
    //public methods
    this.setupMask = setupMask;
    this.startAnimate = startAnimate;
    this.resetMaskState = resetMaskState;

    var parentReference = masterReference;

    //masking animations will be drawn to this buffer canvas
    var maskCanvas = createInvisibleCanvas("maskCanvas", mainCanvas.width, mainCanvas.height);
    var maskContext = maskCanvas.getContext("2d");

    var stage = new createjs.Stage("maskCanvas");
    var maskContainer = new createjs.Container();

    var boxArray = new Array();

    var xPosition = -1;
    var yPosition = -1;

    var runStageUpdate = false;

    var howManyAcross = window.innerWidth / 150;
    var howManyDown = window.innerHeight / 100;
    var totalRectsNeeded = Math.ceil(howManyAcross * howManyDown * 1.2);

    function setupMask()
    {
        for(var i=0;i<totalRectsNeeded;i++)
        {
          xPosition++;

          var roundRect = new createjs.Shape();
          roundRect.graphics.beginFill("red").drawRoundRect(0, 0, 150, 100, 25, 25, 25, 25);

          if(i % 7 == 0
          && i !== 0)
          {
            xPosition = 0;
            yPosition += 50; //tighten up the spacing so it can achieve the roll down effect
          }

          roundRect.x = xPosition * 300;
          roundRect.y = yPosition;
          roundRect.regX = 75;
          roundRect.regY = 30;

          roundRect.scaleX = roundRect.scaleY = 0;

          boxArray.push(roundRect);

          maskContainer.addChild(roundRect);
        }

        stage.addChild(maskContainer);
        stage.update();
    }

    function startAnimate()
    {
        runStageUpdate = true;
        redrawEasel();

        for(let i=0;i<boxArray.length;i++)
        {
            gsap.to(boxArray[i], {
              duration: .75,
              scaleX: 2,
              scaleY: 1.5,
              delay: i / 600,
              ease: "power1.inOut",
              onComplete: function(){

                  if(i == boxArray.length - 1)
                  {
                      resetMaskState();
                      runStageUpdate = false;
                  }
              }
            });
        }
    }

    function resetMaskState()
    {
        parentReference.onMaskComplete();

        boxArray.reverse();

        for(var i=0;i<boxArray.length;i++)
        {
            boxArray[i].scaleX = boxArray[i].scaleY = 0;
        }

        maskContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    }

    //creates invisible canvas for buffering
    function createInvisibleCanvas(id, width, height)
    {
        var tempCanvas;

        if(document.getElementById(id) !== null)
        {
            tempCanvas = document.getElementById(id);
        } else {

            tempCanvas = document.createElement("canvas");
            tempCanvas.width = width;
            tempCanvas.height = height;
            tempCanvas.id = id;
            tempCanvas.style.display = "none";
            document.body.appendChild(tempCanvas);
        }

        return tempCanvas;
    }

    //only redrawl EaselJS while animating
    function redrawEasel()
    {
        if(runStageUpdate == true)
        {
            stage.update();
            window.requestAnimationFrame(redrawEasel);
        }
    }
}
