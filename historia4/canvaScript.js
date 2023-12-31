const canvas = document.getElementById("canvas");
canvas.willReadFrequently = true;
const context = canvas.getContext("2d");
context.willReadFrequently = true;
const shapeSelector = document.getElementById("shape");
const sizeSelector = document.getElementById("size");
const modeSelector = document.getElementById("mode");
const colorSelector = document.getElementById("color");
const clearButton = document.getElementById("clear");
let selectedShape = "pencil";

const bucketShape = shapeSelector.value;
shapeSelector.addEventListener("change", () => {
  selectedShape = shapeSelector.value;
});

const bucketButton = document.getElementById("bucketButton"); //remove this
let isBucketToolActive = false;
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Separate canvas for pre-defined shapes
const predefinedCanvas = document.createElement("canvas");
predefinedCanvas.willReadFrequently = true;
predefinedCanvas.width = canvas.width;
predefinedCanvas.height = canvas.height;
const predefinedContext = predefinedCanvas.getContext("2d");

// Draw pre-defined shapes on the separate canvas initially
drawPredefinedShapes(predefinedContext);

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mousemove", draw);

canvas.addEventListener("touchstart", startDrawing);
canvas.addEventListener("touchend", stopDrawing);
canvas.addEventListener("touchmove", draw);

clearButton.addEventListener("click", clearCanvas);

//Bucket function !!!!
let selectedColor = colorSelector.value; // Initialize with the default color
colorSelector.addEventListener("change", () => {
  selectedColor = colorSelector.value;
  console.log(hexToRgb(selectedColor))
});

canvas.addEventListener("mousedown", (e) => {
  if (selectedShape == "bucket") {
    const x = e.offsetX;
    const y = e.offsetY;
    const pixelColor = getPixelColor(x, y);
    fillArea(x, y, pixelColor);
  }
});

// Add touch event listeners for the bucket tool
canvas.addEventListener("touchstart", (e) => {
  e.preventDefault(); // Prevent scrolling on touch devices
  if (selectedShape === "bucket") {
    const [x, y] = getTouchCoordinates(e);
    const pixelColor = getPixelColor(x, y);
    fillArea(x, y, pixelColor);
  }
});

let isFilling = false; // Track if we are currently filling

function getPixelColor(x, y) {
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const index = (x + y * canvas.width) * 4;
  return {
    r: imageData.data[index],
    g: imageData.data[index + 1],
    b: imageData.data[index + 2],
    a: imageData.data[index + 3],
  };
}

function fillArea(x, y, targetColor) {
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  imageData.willReadFrequently = true;
  const fillColor = hexToRgb(selectedColor);
  console.log("targetColor: ")
  console.log(targetColor)


  const stack = [{ x, y }];
  const maxX = canvas.width;
  const maxY = canvas.height;

  while (stack.length > 0) {
    const { x, y } = stack.pop();

    if (x >= 0 && x < maxX && y >= 0 && y < maxY) {
      const index = (x + y * maxX) * 4;
      if (
        imageData.data[index] === targetColor.r &&
        imageData.data[index + 1] === targetColor.g &&
        imageData.data[index + 2] === targetColor.b &&
        imageData.data[index + 3] === targetColor.a
      ) {
        imageData.data[index] = fillColor.r;
        imageData.data[index + 1] = fillColor.g;
        imageData.data[index + 2] = fillColor.b;
        imageData.data[index + 3] = 255;

        stack.push({ x: x + 1, y });
        stack.push({ x: x - 1, y });
        stack.push({ x, y: y + 1 });
        stack.push({ x, y: y - 1 });
      }
    }
  }

  context.putImageData(imageData, 0, 0);
}

function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}

//End of Bucket function

function clickDraw(e) {
  isDrawing = true;
  const shape = shapeSelector.value;
  const size = parseInt(sizeSelector.value, 10);
  const mode = modeSelector.value;
  const color = colorSelector.value;
  const [x, y] = getCoordinates(e);

  context.strokeStyle = color;
  context.fillStyle = color;
  context.lineWidth = 2;

  switch (shape) {
    case "rectangle":
      drawRectangle(x, y, size, mode);
      break;
    case "circle":
      drawCircle(x, y, size, mode);
      break;
    case "dot":
      drawDot(x, y, size, mode);
      break;
    case "star":
      drawStar(x, y, size, mode);
      break;
    case "pentagon":
      drawPentagon(x, y, size, mode);
      break;
    case "pencil":
      context.beginPath();
      context.moveTo(lastX, lastY);
      context.lineTo(x, y);
      context.stroke();
      lastX = x;
      lastY = y;
      return; // Skip the closePath() for the pencil
    default:
      break;
  }
  if (mode === "draw") {
    context.stroke();
  } else if (mode === "fill") {
    context.fill();
  }
}

function startDrawing(e) {
  e.preventDefault();
  isDrawing = true;
  const [x, y] = getCoordinates(e);
  [lastX, lastY] = [x, y];
}

function stopDrawing() {
  isDrawing = false;
  context.closePath();
}

function draw(e) {
  if (!isDrawing) return;
  const shape = shapeSelector.value;
  const size = parseInt(sizeSelector.value, 10);
  const mode = modeSelector.value;
  const color = colorSelector.value;
  const [x, y] = getCoordinates(e);

  context.strokeStyle = color;
  context.fillStyle = color;
  context.lineWidth = 2;

  switch (shape) {
    case "rectangle":
      drawRectangle(x, y, size, mode);
      break;
    case "circle":
      drawCircle(x, y, size, mode);
      break;
    case "dot":
      drawDot(x, y, size, mode);
      break;
    case "star":
      drawStar(x, y, size, mode);
      break;
    case "pentagon":
      drawPentagon(x, y, size, mode);
      break;
    case "pencil":
      context.beginPath();
      context.moveTo(lastX, lastY);
      context.lineTo(x, y);
      context.stroke();
      lastX = x;
      lastY = y;
      return; // Skip the closePath() for the pencil
    default:
      break;
  }

  if (mode === "draw") {
    context.stroke();
  } else if (mode === "fill") {
    context.fill();
  }
}

function drawRectangle(x, y, size, mode) {
  context.beginPath();
  context.rect(x - size / 2, y - size / 2, size, size);
  if (mode === "draw") {
    context.stroke();
  } else if (mode === "fill") {
    context.fill();
  }
  context.closePath();
}

function drawCircle(x, y, size, mode) {
  context.beginPath();
  context.arc(x, y, size / 2, 0, 2 * Math.PI);
  if (mode === "draw") {
    context.stroke();
  } else if (mode === "fill") {
    context.fill();
  }
  context.closePath();
}

function drawDot(x, y, size, mode) {
  context.beginPath();
  context.arc(x, y, size / 10, 0, 2 * Math.PI);
  if (mode === "draw") {
    context.stroke();
  } else if (mode === "fill") {
    context.fill();
  }
  context.closePath();
}

function drawStar(x, y, size, mode) {
  const spikes = 5; // Number of spikes in the star
  const outerRadius = size / 2;
  const innerRadius = size / 4;

  const centerX = x;
  const centerY = y;

  context.beginPath();
  let rot = (Math.PI / 2) * 3; // Initial rotation angle to start at the top
  const step = Math.PI / spikes;

  for (let i = 0; i < spikes; i++) {
    const xOuter = centerX + Math.cos(rot) * outerRadius;
    const yOuter = centerY + Math.sin(rot) * outerRadius;
    context.lineTo(xOuter, yOuter);

    rot += step;

    const xInner = centerX + Math.cos(rot) * innerRadius;
    const yInner = centerY + Math.sin(rot) * innerRadius;
    context.lineTo(xInner, yInner);

    rot += step;
  }
  context.closePath();
}

function drawPentagon(x, y, size, mode) {
  const sideLength = 30; // Length of each side
  context.beginPath();

  for (let i = 0; i < 5; i++) {
    const angle = (i * 2 * Math.PI) / 5;
    const xVertex = x + sideLength * Math.cos(angle);
    const yVertex = y + sideLength * Math.sin(angle);

    context.lineTo(xVertex, yVertex);
  }

  context.closePath();
}

function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(predefinedCanvas, 0, 0);
}

// Modify the getCoordinates function to handle both mouse and touch events
function getCoordinates(e) {
  let x, y;
  if (e.changedTouches) {
    x = e.changedTouches[0].clientX - canvas.getBoundingClientRect().left;
    y = e.changedTouches[0].clientY - canvas.getBoundingClientRect().top;
  } else {
    x = e.clientX - canvas.getBoundingClientRect().left;
    y = e.clientY - canvas.getBoundingClientRect().top;
  }
  return [x, y];
}


// Function to get touch coordinates
function getTouchCoordinates(e) {
  const touch = e.touches[0];


  const x = touch.pageX - canvas.getBoundingClientRect().left;
  const y = touch.pageY - canvas.getBoundingClientRect().top;
  console.log("X value: " + x + " Y value: " + y)
  return [x, y];

}



// Function to draw pre-defined shapes on a separate canvas
function drawPredefinedShapes(ctx) {
  // Draw Mickey Mouse's face
  const centerX = predefinedCanvas.width / 2;
  const centerY = predefinedCanvas.height / 2;
  const headRadius = 60;
  const earRadius = 20;
  const eyeRadius = 10;
  const eyeOffset = 15;
  const mouthWidth = 30;
  const mouthHeight = 10;

  // Head
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(centerX, centerY, headRadius, 0, 2 * Math.PI);
  ctx.fill();

  // Ears
  ctx.beginPath();
  ctx.arc(
    centerX - headRadius * 0.7,
    centerY - headRadius * 0.7,
    earRadius,
    0,
    2 * Math.PI
  );
  ctx.arc(
    centerX + headRadius * 0.7,
    centerY - headRadius * 0.7,
    earRadius,
    0,
    2 * Math.PI
  );
  ctx.fill();

  // Eyes
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(centerX - eyeOffset, centerY - eyeOffset, eyeRadius, 0, 2 * Math.PI);
  ctx.arc(centerX + eyeOffset, centerY - eyeOffset, eyeRadius, 0, 2 * Math.PI);
  ctx.fill();

  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(
    centerX - eyeOffset,
    centerY - eyeOffset,
    eyeRadius / 2,
    0,
    2 * Math.PI
  );
  ctx.arc(
    centerX + eyeOffset,
    centerY - eyeOffset,
    eyeRadius / 2,
    0,
    2 * Math.PI
  );
  ctx.fill();

  // Mouth
  ctx.beginPath();
  ctx.arc(centerX, centerY + 10, mouthWidth, 0, Math.PI);
  ctx.fill();

  // Nose
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI);
  ctx.fill();
}
