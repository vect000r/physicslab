let grid;
let cols;
let rows;
let squareWidth = 20;
let canvas;
let ctx;

function makeArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
    for(let j = 0; j < arr[i].length; j++){
      arr[i][j] = 0;
    }
  }
  return arr;
}

function setupCanvas() {
  canvas = document.getElementById('sandCanvas');
  canvas.width = 800;
  canvas.height = 800;
  ctx = canvas.getContext('2d');
  
  cols = Math.floor(canvas.width / squareWidth);
  rows = Math.floor(canvas.height / squareWidth);
  grid = makeArray(cols, rows);
  
  for(let i = 0; i < cols; i++) {
    for(let j = 0; j < rows; j++) {
      grid[i][j] = 0;  // Initialize all grid values to 0
    }
  }
  
  drawSand();  // Initial drawing of grid

 
  canvas.addEventListener('mousedown', function(event) {
    isDragging = true;  // Start dragging
    addParticle(event);
  });

  canvas.addEventListener('mousemove', function(event) {
    if (isDragging) {
      addParticle(event);  // Add sand particle while dragging
    }
  });

  canvas.addEventListener('mouseup', function() {
    isDragging = false;  // Stop dragging
  });

  canvas.addEventListener('mouseleave', function() {
    isDragging = false;  // Stop dragging when mouse leaves the canvas
  });
}

function addParticle(event) {
  let x = Math.floor(event.offsetX / squareWidth);
  let y = Math.floor(event.offsetY / squareWidth);
  grid[x][y] = 1;  // Set grid value to 1 where the particle is added
}

function drawSand() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear canvas
  
  for(let i = 0; i < cols; i++) {
    for(let j = 0; j < rows; j++) {
      ctx.fillStyle = `rgb(${grid[i][j] * 255}, ${grid[i][j] * 255}, ${grid[i][j] * 255})`;
      ctx.strokeStyle = '#ffffff';
      let x = i * squareWidth;
      let y = j * squareWidth;
      ctx.fillRect(x, y, squareWidth, squareWidth);  // Draw filled square
      ctx.fillStyle = grid[i][j] === 1 ? 'yellow' : 'rgb(200, 200, 200)'
      ctx.strokeRect(x, y, squareWidth, squareWidth);  // Draw square outline
      
    }
  }

  // Calculate the next frame of the animation ( make a new grid )
  let nextGrid = makeArray(cols, rows);
  
  for(let i = 0; i < cols; i++){
    for(let j = 0; j < rows; j++){
      let state = grid[i][j];
      if (state === 1) {
        let below = grid[i][j + 1];
        let dir = Math.random() >= 0.5 ? 1 : -1;
        
        // I am aware that belowLeft and belowRight are not the best names for these variables as they are left or right depending on the dir variable
        // Simulates the sand piling up instead of making a straight tower

        let belowLeft  = -1;
        let belowRight = -1;
        if (i > 0 && i < cols - 1) {
          belowLeft = grid[i + dir][j + 1];
        }
        if (i > 0 && i < cols - 1) {
          belowRight = grid[i - dir][j + 1];
        }

        if (below === 0) {
          nextGrid[i][j + 1] = state;
        } else if (belowLeft === 0) {
          nextGrid[i + dir][j + 1] = state;
        } else if (belowRight === 0) {
          nextGrid[i - dir][j + 1] = state;
        } else {
          // Stay in the same position if there is no space below
          nextGrid[i][j] = state;
        }
      }
    }
  }
  grid = nextGrid;
  requestAnimationFrame(drawSand); // Loop the drawing of sand so we can see the movement
}

window.onload = setupCanvas;  // Initialize canvas when the page loads