var CanvasSize = 900.0;
var neuralNetwork;
function setup() 
{
    let cns = createCanvas(CanvasSize, CanvasSize);
    cns.parent("canvas");
    let inputLayer = {PerceptronCount: 2};
    let hiddenLayer1 = {PerceptronCount: 8, ActivationFunctionName: "Sigmoid"};
    let hiddenLayer2 = {PerceptronCount: 8, ActivationFunctionName: "Sigmoid"};
    let outputLayer = {PerceptronCount: 4, ActivationFunctionName: "Sigmoid"};
    this.neuralNetwork = new NeuralNetwork(inputLayer, outputLayer, [hiddenLayer1, hiddenLayer2]);
}
function mouseMoved()
{
    this.neuralNetwork.selectPerceptron({X: mouseX, Y: mouseY});
}
function draw() 
{
    background("white");
    this.neuralNetwork.draw();
}
function downloadString(text, fileType, fileName) 
{
    var blob = new Blob([text], { type: fileType });
    var a = document.createElement('a');
    a.download = fileName;
    a.href = URL.createObjectURL(blob);
    a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1500);
}
function getRandomNumber(min, max) 
{
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}