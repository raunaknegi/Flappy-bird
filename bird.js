// Mutation function to be passed into bird.brain
function mutate(x) {
  if (random(1) < 0.1) {
    let offset = randomGaussian() * 0.5;
    let newx = x + offset;
    return newx;
  } else {
    return x;
  }
}

class Bird {
  constructor(brain) {
    this.x = 64;
    this.y = height / 2;
    this.r = 12;

    this.gravity = 0.8;
    this.lift = -12;
    this.velocity = 0;

    if (brain instanceof NeuralNetwork) {
      this.brain = brain.copy();
      this.brain.mutate(mutate);
    } else {
      this.brain = new NeuralNetwork(5, 8, 2);
    }

    // Score is how many frames it's been alive
    this.score = 0;
    // Fitness is normalized version of score
    this.fitness = 0;
  }

  // Create a copy of this bird
  copy() {
    return new Bird(this.brain);
  }

  // Display the bird
  show() {
    fill(255, 100);
    stroke(255);
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
  }

  think(pipes) {
    let closest = null;
    let record = Infinity;
    for (let i = 0; i < pipes.length; i++) {
      let diff = pipes[i].x - this.x;
      if (diff > 0 && diff < record) {
        record = diff;
        closest = pipes[i];
      }
    }

    if (closest != null) {
      // Now create the inputs to the neural network
      let inputs = [];
      inputs.push(map(closest.x, this.x, width, 0, 1))
      
      inputs.push(map(closest.top, 0, height, 0, 1));
      inputs.push(map(closest.bottom, 0, height, 0, 1))
      inputs.push(map(this.y, 0, height, 0, 1));
      inputs.push(map(this.velocity, -5, 5, 0, 1));

      let action = this.brain.predict(inputs);
      if (action[1] > action[0]) {
        this.up();
      }
    }
  }

  up() {
    this.velocity += this.lift;
  }

  bottomTop() {
    return (this.y > height || this.y < 0);
  }

  // Update bird's position based on velocity, gravity, etc.
  update() {
    this.velocity += this.gravity;
    this.y += this.velocity;

    // Every frame it is alive increases the score
    this.score++;
  }
}