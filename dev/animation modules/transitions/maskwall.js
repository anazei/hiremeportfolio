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

    var stage = new createjs.Stage("maskCanvas"); //switch to bufferCanvas later
    var maskContainer = new createjs.Container();

    gsap.ticker.add(function() {
        stage.update();
    });

    function setupMask()
    {

    }

    function startAnimate()
    {

    }

    function resetMaskState()
    {

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
