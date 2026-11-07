"use strict";
var Spotlight = function(masterReference, mainCanvas)
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

    //tweenable properties
    var gradient = {
      radius: 0
    };

    var rectangle = {
      alpha: 0,
    };

    function setupMask()
    {
        maskContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

        const radial = maskContext.createRadialGradient(
            mainCanvas.width / 2, mainCanvas.height / 2, 0,
            mainCanvas.width / 2, mainCanvas.height / 2, Math.max(gradient.radius, 0.01)
        );

        radial.addColorStop(0, "rgba(255, 0, 0, 1)");
        radial.addColorStop(0.5, "rgba(255, 0, 0, 0.5)");
        radial.addColorStop(1, "rgba(255, 0, 0, 0)");

        maskContext.fillStyle = radial;
        maskContext.fillRect(0, 0, mainCanvas.width, mainCanvas.height);

        maskContext.fillStyle = "rgba(255, 0, 0," + rectangle.alpha + ")";
        maskContext.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
    }

    function startAnimate()
    {
        gsap.to(gradient, {
          radius: 1200,
          duration: 5,
          //ease: "power2.in",
          onUpdate: setupMask
        });

        gsap.to(rectangle, {
          alpha: 1,
          duration: 2,
          delay: 2,
          onUpdate: setupMask,
          onComplete: resetMaskState,
        });
    }

    function resetMaskState()
    {
        parentReference.onMaskComplete();

        gradient.radius = 0
        rectangle.alpha = 0;

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

}
