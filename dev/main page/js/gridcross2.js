  /*
    ChatGPT translated this into canvas from my original gridcross.js which was based on <divs>
    which was too slow in rendering performance
    but would have wasted an entire day rewriting for canvas manually so I had AI translate it in minutes
  */

  // Public functions retain the names from the original grideffect.html.
  const GRID_SPACING = 26;
  const CROSS_SPACING = GRID_SPACING * 8;
  const gridCanvas = document.getElementById("masterGrid");
  const crossCanvas = document.getElementById("masterCross");
  const gridCtx = gridCanvas.getContext("2d", { alpha: true });
  const crossCtx = crossCanvas.getContext("2d", { alpha: true });

  let gridArray = [];
  let crossArray = [];
  let numGridX = 0;
  let numGridY = 0;
  let currentBackgroundGridState = "inactive";
  let cssWidth = 0;
  let cssHeight = 0;
  let pixelRatio = 1;
  let gridDirty = true;
  let crossDirty = true;
  let gridMode = "hidden";
  let crossMode = "hidden";
  let gridClock = { t: 0 };
  let crossClock = { t: 0 };
  let gridExitDuration = 0;
  let crossExitDuration = 0;
  let gridAnimation = null;
  let crossAnimation = null;
  let delayedCrossStart = null;
  let pendingIntervals = new Set();
  const highlightTweens = new Set();

  function clamp01(value) { return Math.max(0, Math.min(1, value)); }
  function mix(a, b, t) { return a + (b - a) * t; }
  function fromToColor(a, b, t) {
    const r = Math.round(mix(a[0], b[0], t));
    const g = Math.round(mix(a[1], b[1], t));
    const bl = Math.round(mix(a[2], b[2], t));
    return `rgb(${r},${g},${bl})`;
  }

  function markGridDirty() { gridDirty = true; }
  function markCrossDirty() { crossDirty = true; }

  // GSAP already owns an RAF loop. This callback draws a canvas at most once
  // per tick, regardless of how many highlighted squares are being animated.
  gsap.ticker.add(() => {
    if (gridDirty) { drawGrid(); gridDirty = false; }
    if (crossDirty) { drawCrosses(); crossDirty = false; }
  });

  function resizeCanvas(canvas, ctx) {
    const w = Math.max(1, Math.round(cssWidth * pixelRatio));
    const h = Math.max(1, Math.round(cssHeight * pixelRatio));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  }

  function sizeCanvases() {
    cssWidth = window.innerWidth;
    cssHeight = window.innerHeight;
    // Cap high-density device pixel ratios to avoid unnecessary pixel work.
    // Change the 2 to 1 for maximum performance on very dense screens.
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    resizeCanvas(gridCanvas, gridCtx);
    resizeCanvas(crossCanvas, crossCtx);
    numGridX = Math.ceil(cssWidth / GRID_SPACING);
    numGridY = Math.ceil(cssHeight / GRID_SPACING);
    gridDirty = true;
    crossDirty = true;
  }

  function drawGrid() {
    gridCtx.clearRect(0, 0, cssWidth, cssHeight);
    if (gridMode === "hidden") return;
    const time = gridClock.t;
    const total = gridArray.length;
    for (let i = 0; i < total; i++) {
      const square = gridArray[i];
      let opacity = 1;
      let scale = 1;
      let color = "#141414";

      if (gridMode === "enter") {
        const p = clamp01((time - square.inDelay) / square.inDuration);
        if (p <= 0) continue;
        opacity = p;
        scale = mix(1.25, 1, p);
        color = fromToColor([128, 128, 128], [20, 20, 20], p);
      } else if (gridMode === "exit") {
        // Original array.reverse(): last square disappears first.
        const reverseIndex = total - 1 - i;
        const p = clamp01((time - reverseIndex / 2500) / square.outDuration);
        if (p >= 1) continue;
        opacity = 1 - p;
        scale = mix(1, 1.25, p);
      }

      if (square.highlightActive) {
        scale = square.highlightScale;
        color = square.highlightColor;
      } else if (square.debug) {
        color = "#ffffff";
      }

      gridCtx.globalAlpha = opacity;
      gridCtx.strokeStyle = color;
      gridCtx.lineWidth = 1;
      gridCtx.save();
      // Approximate the original CSS border box (25px content + two 1px borders)
      // with transform-origin at its centre.
      gridCtx.translate(square.x + 13.5, square.y + 13.5);
      gridCtx.scale(scale, scale);
      gridCtx.strokeRect(-13, -13, 26, 26);
      gridCtx.restore();
    }
    gridCtx.globalAlpha = 1;
  }

  function drawCrosses() {
    crossCtx.clearRect(0, 0, cssWidth, cssHeight);
    if (crossMode === "hidden") return;
    const time = crossClock.t;
    const total = crossArray.length;
    crossCtx.fillStyle = "#4E5959";
    for (let i = 0; i < total; i++) {
      const cross = crossArray[i];
      let opacity = 1;
      let scale = 1;
      if (crossMode === "enter") {
        const p = clamp01((time - cross.inDelay) / cross.inDuration);
        if (p <= 0) continue;
        opacity = p;
        scale = mix(3, 1, p);
      } else if (crossMode === "exit") {
        const reverseIndex = total - 1 - i;
        const p = clamp01((time - reverseIndex / 50) / 2);
        if (p >= 1) continue;
        opacity = 1 - p;
      }
      crossCtx.globalAlpha = opacity;
      crossCtx.save();
      crossCtx.translate(cross.x, cross.y);
      crossCtx.scale(scale, scale);
      crossCtx.fillRect(0, -10, 1, 20);
      crossCtx.fillRect(-10, 0, 20, 1);
      crossCtx.restore();
    }
    crossCtx.globalAlpha = 1;
  }

  function cancelPendingIntervals() {
    for (const id of pendingIntervals) clearInterval(id);
    pendingIntervals.clear();
  }
  function cancelAnimations() {
    if (gridAnimation) { gridAnimation.kill(); gridAnimation = null; }
    if (crossAnimation) { crossAnimation.kill(); crossAnimation = null; }
    if (delayedCrossStart) { delayedCrossStart.kill(); delayedCrossStart = null; }
    for (const tween of highlightTweens) tween.kill();
    highlightTweens.clear();
    cancelPendingIntervals();
  }

  function createNewGridSquare(xPosition, yPosition, id, animateIn = true) {
    const square = {
      x: xPosition, y: yPosition,
      inDelay: id / 1500,
      inDuration: Math.max(0.001, Math.random()),
      outDuration: Math.max(0.001, Math.random()),
      highlightActive: false,
      highlightScale: 1,
      highlightColor: "#141414",
      debug: false
    };
    gridArray.push(square);
    return square;
  }

  function animateInGrid(animateIn = true) {
    gridArray = [];
    const totalGridSquares = numGridX * numGridY;
    let endTime = 0;
    for (let i = 0; i < totalGridSquares; i++) {
      const sq = createNewGridSquare((i % numGridX) * GRID_SPACING,
                  Math.floor(i / numGridX) * GRID_SPACING, i, animateIn);
      endTime = Math.max(endTime, sq.inDelay + sq.inDuration);
    }
    gridClock = { t: 0 };
    gridMode = animateIn ? "enter" : "static";
    markGridDirty();
    if (animateIn) {
      gridAnimation = gsap.to(gridClock, {
        t: endTime, duration: endTime, ease: "none",
        onUpdate: markGridDirty,
        onComplete: () => { gridMode = "static"; gridAnimation = null; markGridDirty(); }
      });
    }
  }

  function getGridSquareXYNum(numInArray) {
    return [numInArray % numGridX, Math.floor(numInArray / numGridX)];
  }
  function getGridSquareNumber(x, y) {
    return Number.isInteger(x) && Number.isInteger(y) &&
           x >= 0 && y >= 0 && x < numGridX && y < numGridY
      ? x + numGridX * y : NaN;
  }
  function findAndLightupSquareGrid(gridNum) {
    const position = getGridSquareXYNum(gridNum);
    lightupGridSquare(position[0], position[1]);
  }

  function lightupGridSquare(x, y, randomDuration = true) {
    if (currentBackgroundGridState !== "active") return;
    const square = gridArray[getGridSquareNumber(x, y)];
    if (!square) return;
    const durationIn = randomDuration ? Math.random() : 0.1;
    const durationOut = randomDuration ? Math.random() * 0.5 : 0.15;
    if (square.highlightTween) {
      square.highlightTween.kill();
      highlightTweens.delete(square.highlightTween);
    }
    square.highlightActive = true;
    square.highlightScale = 1;
    square.highlightColor = "#ffffff";
    markGridDirty();
    const tween = gsap.timeline({
      onUpdate: markGridDirty,
      onComplete: () => {
        highlightTweens.delete(tween);
        if (square.highlightTween === tween) {
          square.highlightTween = null;
          square.highlightActive = false;
        }
        markGridDirty();
      }
    });
    square.highlightTween = tween;
    highlightTweens.add(tween);
    tween.to(square, {
      highlightScale: 1.5,
      highlightColor: "#566464",
      duration: durationIn
    }).to(square, {
      highlightScale: 1,
      highlightColor: "#141414",
      duration: durationOut
    });
  }

  function createCross(x, y, id, animateIn = true) {
    const cross = {
      x, y,
      inDelay: id * 75 / 2500,
      inDuration: Math.max(0.001, id * 0.05)
    };
    crossArray.push(cross);
    return cross;
  }
  function animateInCrossesOnGrid(animateIn = true) {
    if (currentBackgroundGridState !== "active") return;
    crossArray = [];
    const numCrossX = Math.ceil(cssWidth / CROSS_SPACING);
    const numCrossY = Math.ceil(cssHeight / CROSS_SPACING);
    let endTime = 0;
    for (let i = 0; i < numCrossX * numCrossY; i++) {
      const cross = createCross((i % numCrossX) * CROSS_SPACING,
                                Math.floor(i / numCrossX) * CROSS_SPACING, i, animateIn);
      endTime = Math.max(endTime, cross.inDelay + cross.inDuration);
    }
    crossClock = { t: 0 };
    crossMode = animateIn ? "enter" : "static";
    markCrossDirty();
    if (animateIn) {
      crossAnimation = gsap.to(crossClock, {
        t: endTime, duration: endTime, ease: "none",
        onUpdate: markCrossDirty,
        onComplete: () => { crossMode = "static"; crossAnimation = null; markCrossDirty(); }
      });
    }
  }

  function animateBackgroundGrid(minRange, maxRange) {
    if (currentBackgroundGridState !== "active") return;
    for (let i = 0; i < gridArray.length; i++) {
      const x = i % numGridX;
      if (x > minRange && x < maxRange && Math.round(Math.random() * 4) === 1) {
        findAndLightupSquareGrid(i);
      }
    }
  }

  function animateRollingGrid(minRange, maxRange) {
    if (currentBackgroundGridState !== "active") return;
    let counter = 0;
    const numRows = Math.floor(cssHeight / GRID_SPACING);
    const numColumns = Math.floor(cssWidth / GRID_SPACING);
    const id = setInterval(() => {
      const xGrid = Math.min(Math.round(Math.random() * (maxRange - minRange)) + minRange, numColumns);
      lightupGridSquare(xGrid, counter);
      if (counter >= numRows) { clearInterval(id); pendingIntervals.delete(id); }
      else counter++;
    }, 25);
    pendingIntervals.add(id);
  }

  function highlightGridSquareDebug(x, y) {
    const square = gridArray[getGridSquareNumber(x, y)];
    if (!square) return;
    square.debug = true;
    markGridDirty();
  }

  function circularGridAnimation(x, y, radius) {
    if (currentBackgroundGridState !== "active") return;
    let counter = 0;
    radius = Math.max(0, Math.min(20, Math.floor(radius)));
    const id = setInterval(() => {
      if (counter < radius) {
        // Deduplicate positions: multiple degrees often round to the same cell.
        const seen = new Set();
        for (let degree = 0; degree < 360; degree++) {
          const angle = degree * Math.PI / 180;
          const gx = x + Math.round(Math.cos(angle) * counter);
          const gy = y + Math.round(Math.sin(angle) * counter);
          const index = getGridSquareNumber(gx, gy);
          if (Number.isNaN(index) || seen.has(index)) continue;
          seen.add(index);
          lightupGridSquare(gx, gy, false);
        }
        counter++;
      } else { clearInterval(id); pendingIntervals.delete(id); }
    }, 25);
    pendingIntervals.add(id);
  }

  function removeGrid() { gridArray = []; gridMode = "hidden"; markGridDirty(); }
  function removeCrosses() { crossArray = []; crossMode = "hidden"; markCrossDirty(); }
  function randomizeArray(inputArray) {
    for (let i = inputArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [inputArray[i], inputArray[j]] = [inputArray[j], inputArray[i]];
    }
    return inputArray;
  }

  function transitionOutGridAnimation() {
    if (gridAnimation) gridAnimation.kill();
    let maxEnd = 0;
    for (let i = 0; i < gridArray.length; i++) {
      const square = gridArray[i];
      maxEnd = Math.max(maxEnd, (gridArray.length - 1 - i) / 2500 + square.outDuration);
    }
    gridClock = { t: 0 };
    gridMode = "exit";
    gridExitDuration = maxEnd;
    gridAnimation = gsap.to(gridClock, {
      t: maxEnd, duration: maxEnd, ease: "none", onUpdate: markGridDirty,
      onComplete: () => { gridAnimation = null; removeGrid(); }
    });
    markGridDirty();
  }
  function transitionOutCrossAnimation() {
    if (crossAnimation) crossAnimation.kill();
    crossClock = { t: 0 };
    crossMode = "exit";
    crossExitDuration = crossArray.length ? 2 + (crossArray.length - 1) / 50 : 0;
    if (!crossArray.length) { removeCrosses(); return; }
    crossAnimation = gsap.to(crossClock, {
      t: crossExitDuration, duration: crossExitDuration,
      ease: "none", onUpdate: markCrossDirty,
      onComplete: () => { crossAnimation = null; removeCrosses(); }
    });
    markCrossDirty();
  }
  function animateOutGridCrossBackground() {
    if (currentBackgroundGridState !== "active") return;
    currentBackgroundGridState = "inactive";
    if (delayedCrossStart) { delayedCrossStart.kill(); delayedCrossStart = null; }
    for (const tween of highlightTweens) tween.kill();
    highlightTweens.clear();
    gridArray.forEach(sq => { sq.highlightActive = false; sq.highlightTween = null; });
    cancelPendingIntervals();
    transitionOutGridAnimation();
    transitionOutCrossAnimation();
  }

  function instantRedraw() {
    if (currentBackgroundGridState !== "active") return;
    cancelAnimations();
    animateInGrid(false);
    animateInCrossesOnGrid(false);
  }
  function onResizeGridArray() {
    sizeCanvases();
    if (currentBackgroundGridState === "active") instantRedraw();
    // When exiting/inactive, don't restart the grid on resize.
  }
  function animateInGridCrossBackground() {
    if (currentBackgroundGridState !== "inactive") return;
    cancelAnimations();
    currentBackgroundGridState = "active";
    animateInGrid(true);
    crossMode = "hidden";
    crossArray = [];
    markCrossDirty();
    delayedCrossStart = gsap.delayedCall(0.75, () => {
      delayedCrossStart = null;
      if (currentBackgroundGridState === "active") animateInCrossesOnGrid(true);
    });
  }

  sizeCanvases();
  //animateInGridCrossBackground();
  window.addEventListener("resize", onResizeGridArray);
