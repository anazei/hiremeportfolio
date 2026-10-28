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

    var canvasHeight = Math.ceil(mainCanvas.height / 5);

    function setupMask()
    {
        for(var i=0;i<canvasHeight;i++)
        {
          xPosition++;

          var roundRect = new createjs.Shape();
          roundRect.graphics.beginFill("red").drawRoundRect(0, 0, mainCanvas.width, 5, 0, 0, 0, 0);

          if(i % 1 == 0
          && i !== 0)
          {
            xPosition = 0;
            yPosition += 5;
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
        for(let i=0;i<crossFadeBoxArray.length;i++)
        {
            gsap.to(crossFadeBoxArray[i], {
              duration: 2,
              alpha: 1,
              delay: i / 200,
              onUpdate: function(){
                  stage.update();
              },
              onComplete: function(){

                  if(i == crossFadeBoxArray.length - 1)
                  {
                      parentReference.onMaskComplete();
                      resetMaskState();
                  }
              }
            });
        }
    }

    function resetMaskState()
    {
        //crossFadeBoxArray.reverse();

        for(var i=0;i<crossFadeBoxArray.length;i++)
        {
            crossFadeBoxArray[i].alpha = 0;
        }
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
            tempCanvas.style.display = "block";
            document.body.appendChild(tempCanvas);
        }

        return tempCanvas;
    }

}
