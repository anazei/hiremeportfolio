"use strict";
var Crossfade = function(masterReference, mainCanvas)
{
    //public methods
    this.setupMask = setupMask;
    this.startAnimate = startAnimate;
    this.resetMaskState = resetMaskState;

    var parentReference = masterReference;

    //masking animations will be drawn to this buffer canvas
    var maskCanvas = createInvisibleCanvas("maskCanvas", mainCanvas.width, mainCanvas.height);
    var maskContext = maskCanvas.getContext("2d");

    var stage = new createjs.Stage("maskCanvas"); //switch to bufferCanvas later
    var maskContainer = new createjs.Container();

    var crossFadeBoxArray = new Array();

    var xPosition = -1;
    var yPosition = -1;

    var canvasHeight = Math.ceil(mainCanvas.height / 15);

    var runStageUpdate = false;

    function setupMask()
    {
        for(var i=0;i<canvasHeight;i++)
        {
          xPosition++;

          var roundRect = new createjs.Shape();
          roundRect.graphics.beginFill("red").drawRoundRect(0, 0, mainCanvas.width, 15, 0, 0, 0, 0);

          if(i % 1 == 0
          && i !== 0)
          {
            xPosition = 0;
            yPosition += 15;
          }

          roundRect.alpha = 0;

          roundRect.x = xPosition * mainCanvas.width;
          roundRect.y = yPosition;

          crossFadeBoxArray.push(roundRect);

          maskContainer.addChild(roundRect);
        }

        stage.addChild(maskContainer);
        stage.update();
    }

    function startAnimate()
    {
        runStageUpdate = true;
        redrawEasel();

        for(let i=0;i<crossFadeBoxArray.length;i++)
        {
            gsap.to(crossFadeBoxArray[i], {
              duration: 1.5,
              alpha: 1,
              delay: i / 400,
              onComplete: function(){

                  if(i == crossFadeBoxArray.length - 1)
                  {
                      parentReference.onMaskComplete();
                      resetMaskState();
                      runStageUpdate = false;
                  }
              }
            });
        }
    }

    function resetMaskState()
    {
        crossFadeBoxArray.reverse();

        for(var i=0;i<crossFadeBoxArray.length;i++)
        {
            crossFadeBoxArray[i].alpha = 0;
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
