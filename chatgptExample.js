// Define sigmoid activation function
function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

// Define derivative of sigmoid function
function sigmoidDerivative(x) {
  return x * (1 - x);
}

// Define neural network architecture
const inputSize = 2;
const hiddenSize = 3;
const outputSize = 1;

// Initialize weights and biases
let inputLayer = new Array(inputSize);
let hiddenLayer = new Array(hiddenSize);
let outputLayer = new Array(outputSize);

let weightsIH = new Array(inputSize);
let weightsHO = new Array(hiddenSize);

for (let i = 0; i < inputSize; i++) {
  weightsIH[i] = new Array(hiddenSize);
  for (let j = 0; j < hiddenSize; j++) {
    weightsIH[i][j] = Math.random();
  }
}

for (let i = 0; i < hiddenSize; i++) {
  weightsHO[i] = new Array(outputSize);
  for (let j = 0; j < outputSize; j++) {
    weightsHO[i][j] = Math.random();
  }
}

// Training data (example inputs and corresponding target outputs)
const trainingData = [
  { input: [0, 0], output: [0] },
  { input: [0, 1], output: [1] },
  { input: [1, 0], output: [1] },
  { input: [1, 1], output: [0] },
];

// Training parameters
const learningRate = 0.1;
const epochs = 10000;

// Training loop
for (let epoch = 0; epoch < epochs; epoch++) {
  for (const data of trainingData) {
    // Forward pass
    inputLayer = data.input;
    for (let j = 0; j < hiddenSize; j++) {
      let sum = 0;
      for (let i = 0; i < inputSize; i++) {
        sum += inputLayer[i] * weightsIH[i][j];
      }
      hiddenLayer[j] = sigmoid(sum);
    }

    for (let j = 0; j < outputSize; j++) {
      let sum = 0;
      for (let i = 0; i < hiddenSize; i++) {
        sum += hiddenLayer[i] * weightsHO[i][j];
      }
      outputLayer[j] = sigmoid(sum);
    }

    // Calculate error
    const error = data.output[0] - outputLayer[0];

    // Backpropagation
    const deltaOutput = error * sigmoidDerivative(outputLayer[0]);
    const deltaHidden = new Array(hiddenSize);

    for (let i = 0; i < hiddenSize; i++) {
      deltaHidden[i] = deltaOutput * weightsHO[i][0] * sigmoidDerivative(hiddenLayer[i]);
    }

    // Update weights
    for (let i = 0; i < inputSize; i++) {
      for (let j = 0; j < hiddenSize; j++) {
        weightsIH[i][j] += learningRate * deltaHidden[j] * inputLayer[i];
      }
    }

    for (let i = 0; i < hiddenSize; i++) {
      for (let j = 0; j < outputSize; j++) {
        weightsHO[i][j] += learningRate * deltaOutput * hiddenLayer[i];
      }
    }
  }
}

// Test the trained network
console.log(outputLayer[0]);

