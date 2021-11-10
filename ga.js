// Start the game over
function resetGame() {
  counter = 0;
  // Resetting best bird score to 0
  if (bestBird) {
    bestBird.score = 0;
  }
  pipes = [];
}

// Create the next generation
function nextGeneration() {
  resetGame();
  // Normalize the fitness values 0-1
  normalizeFitness(allBirds);
  activeBirds = generate(allBirds);
  allBirds = activeBirds.slice();
}

// Generate a new population of birds
function generate(oldBirds) {
  let newBirds = [];
  for (let i = 0; i < oldBirds.length; i++) {
    // Select a bird based on fitness
    let bird = poolSelection(oldBirds);
    newBirds[i] = bird;
  }
  return newBirds;
}

// Normalize the fitness of all birds
function normalizeFitness(birds) {
  for (let i = 0; i < birds.length; i++) {
    birds[i].score = pow(birds[i].score, 2);
  }

  let sum = 0;
  for (let i = 0; i < birds.length; i++) {
    sum += birds[i].score;
  }
  for (let i = 0; i < birds.length; i++) {
    birds[i].fitness = birds[i].score / sum;
  }
}


function poolSelection(birds) {
  let index = 0;

  let r = random(1);

  
  while (r > 0) {
    r -= birds[index].fitness;
    // And move on to the next
    index += 1;
  }

  // Go back one
  index -= 1;

  return birds[index].copy();
}