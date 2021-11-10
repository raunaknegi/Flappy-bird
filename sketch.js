// How big is the population
let totalPopulation = 500;

let activeBirds = [];

let allBirds = [];
// Pipes
let pipes = [];

let counter = 0;

// Interface elements
let speedSlider;
let speedSpan;
let highScoreSpan;
let allTimeHighScoreSpan;

// All time high score
let highScore = 0;

// Training or just showing the current best
let runBest = false;
let runBestButton;

function setup() {
  let canvas = createCanvas(600, 400);
  canvas.parent('canvascontainer');

  // Access the interface elements
  speedSlider = select('#speedSlider');
  speedSpan = select('#speed');
  highScoreSpan = select('#hs');
  allTimeHighScoreSpan = select('#ahs');
  runBestButton = select('#best');
  runBestButton.mousePressed(toggleState);

  // Create a population
  for (let i = 0; i < totalPopulation; i++) {
    let bird = new Bird();
    activeBirds[i] = bird;
    allBirds[i] = bird;
  }
}

// Toggle the state of the simulation
function toggleState() {
  runBest = !runBest;
  // Show the best bird
  if (runBest) {
    resetGame();
    runBestButton.html('continue training');
  } else {
    nextGeneration();
    runBestButton.html('run best');
  }
}



function draw() {
  background(0);

  let cycles = speedSlider.value();
  speedSpan.html(cycles);

  for (let n = 0; n < cycles; n++) {
    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].update();
      if (pipes[i].offscreen()) {
        pipes.splice(i, 1);
      }
    }
    if (runBest) {
      bestBird.think(pipes);
      bestBird.update();
      for (let j = 0; j < pipes.length; j++) {
        // Start over, bird hit pipe
        if (pipes[j].hits(bestBird)) {
          resetGame();
          break;
        }
      }

      if (bestBird.bottomTop()) {
        resetGame();
      }
    } else {
      for (let i = activeBirds.length - 1; i >= 0; i--) {
        let bird = activeBirds[i];
        bird.think(pipes);
        bird.update();

        for (let j = 0; j < pipes.length; j++) {
          if (pipes[j].hits(activeBirds[i])) {
            activeBirds.splice(i, 1);
            break;
          }
        }

        if (bird.bottomTop()) {
          activeBirds.splice(i, 1);
        }

      }
    }

    if (counter % 75 == 0) {
      pipes.push(new Pipe());
    }
    counter++;
  }

  let tempHighScore = 0;
  if (!runBest) {
    let tempBestBird = null;
    for (let i = 0; i < activeBirds.length; i++) {
      let s = activeBirds[i].score;
      if (s > tempHighScore) {
        tempHighScore = s;
        tempBestBird = activeBirds[i];
      }
    }

    if (tempHighScore > highScore) {
      highScore = tempHighScore;
      bestBird = tempBestBird;
    }
  } else {
    tempHighScore = bestBird.score;
    if (tempHighScore > highScore) {
      highScore = tempHighScore;
    }
  }

  // Update DOM Elements
  highScoreSpan.html(tempHighScore);
  allTimeHighScoreSpan.html(highScore);

  for (let i = 0; i < pipes.length; i++) {
    pipes[i].show();
  }

  if (runBest) {
    bestBird.show();
  } else {
    for (let i = 0; i < activeBirds.length; i++) {
      activeBirds[i].show();
    }
    // If we're out of birds go to the next generation
    if (activeBirds.length == 0) {
      nextGeneration();
    }
  }
}