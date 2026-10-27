"use strict";
var Crossfade = function(mainCanvas)
{
    //public methods
    this.setupMask = setupMask;
    this.startAnimate = startAnimate;
    this.resetMaskState = resetMaskState;

    //masking animations will be drawn to this buffer canvas
    var maskCanvas = createInvisibleCanvas("maskCanvas", mainCanvas.width, mainCanvas.height);
    var maskContext = maskCanvas.getContext("2d");

    var stage = new createjs.Stage("maskCanvas"); //switch to bufferCanvas later
    var maskContainer = new createjs.Container();

    gsap.ticker.add(function() {
        stage.update();
    });

    var crossFadeBoxArray = new Array();

    var xPosition = -1;
    var yPosition = -1;

    function setupMask()
    {
        for(var i=0;i<250;i++)
        {
          xPosition++;

          var roundRect = new createjs.Shape();
          roundRect.graphics.beginFill("red").drawRoundRect(0, 0, 1194, 5, 0, 0, 0, 0);

          if(i % 2 == 0
          && i !== 0)
          {
            xPosition = 0;
            yPosition += 5;
          }

          roundRect.x = xPosition * 1194;
          roundRect.y = yPosition;

          roundRect.scaleX = roundRect.scaleY = 1;

          crossFadeBoxArray.push(roundRect);

          maskContainer.addChild(roundRect);
        }

        stage.addChild(maskContainer);
        stage.update();
    }

    function startAnimate()
    {
        for(var i=0;i<crossFadeBoxArray.length;i++)
        {
            gsap.to(crossFadeBoxArray[i], {
              duration: 1,
              alpha: 0,
              delay: i / 300,
            });
        }
    }

    function resetMaskState()
    {
        //crossFadeBoxArray.reverse();

        for(var i=0;i<crossFadeBoxArray.length;i++)
        {
            crossFadeBoxArray[i].alpha = 1;
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
