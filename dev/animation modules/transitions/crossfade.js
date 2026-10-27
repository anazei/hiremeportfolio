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

    function setupMask()
    {
        console.log("setup mask")
    }

    function startAnimate()
    {
        console.log("start animate")
    }

    function resetMaskState()
    {
        console.log("reset mask")
    }

    //creates invisible canvas for buffering
    function createInvisibleCanvas(id, width, height)
    {
        var tempCanvas = document.createElement("canvas");
            tempCanvas.width = width;
            tempCanvas.height = height;
            tempCanvas.id = id;
            tempCanvas.style.display = "block";
            document.body.appendChild(tempCanvas);
        return tempCanvas;
    }

}
