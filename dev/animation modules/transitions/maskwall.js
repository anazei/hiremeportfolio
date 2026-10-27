"use strict";
var Maskwall = function()
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
        var tempCanvas = document.createElement("canvas");
            tempCanvas.width = width;
            tempCanvas.height = height;
            tempCanvas.id = id;
            tempCanvas.style.display = "block";
            document.body.appendChild(tempCanvas);
        return tempCanvas;
    }
}
