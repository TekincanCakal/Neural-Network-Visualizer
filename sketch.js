var Slider;
var SliderText;
var Start;
var CanvasSize = 900.0;
var Timer = [0, 0, 0];
var TimerText;
var neuralNetwork;
var nodeRadius = 32;//çember yarıçapı
var nodeEmptyPixel = nodeRadius;//nodelar arası boşluk
var layerEmptyPixel = nodeRadius * 4;//layerlar arası boşluk
var lineWidth = 2;
function setup() 
{
    let cns = createCanvas(CanvasSize, CanvasSize);
    cns.parent("canvas");
    background("255");
    color("black");
    Start = false;
    Slider = document.getElementById("frameRateSlider");
    SliderText = document.getElementById("frameRateSliderText");
    TimerText = document.getElementById("timerText");
    SliderText.innerHTML = "FrameRate: " + this.Slider.value
    Slider.oninput = function () 
    {
        SliderText.innerHTML = "FrameRate: " + this.value;
    }
    this.neuralNetwork = new NeuralNetwork([{PerceptronCount: 3}, {PerceptronCount: 2, ActivationFunction: sigmoid}, {PerceptronCount: 4, ActivationFunction: sigmoid}, {PerceptronCount: 2, ActivationFunction: sigmoid}], 0.01); 
}
function startStop() 
{
    Start = !Start;
    if (Start) 
    {
        document.getElementById("startButton").innerHTML = "Stop"
    }
    else 
    {
        document.getElementById("startButton").innerHTML = "Start";
    }
}
function mousePressed()
{
    this.neuralNetwork.selectPerceptron({X: mouseX, Y: mouseY});
}
function draw() 
{
    parseInt(Slider.value);
    background("white");
    rect(0, 0, width,  height)
    this.neuralNetwork.draw();
    if (Start) 
    {
        if (frameCount % 60 == 0) 
        {
            Timer[0]++;
            if (Timer[0] == 60) 
            {
                Timer[0] = 0;
                Timer[1]++;
            }
            if (Timer[1] == 60) 
            {
                Timer[1] = 0;
                Timer[2]++;
            }
            let temp = "Time: ";
            if (Timer[2] <= 9) 
            {
                temp = temp.concat("0" + Timer[2] + ":");
            }
            else 
            {
                temp = temp.concat(Timer[2] + ":");
            }
            if (Timer[1] <= 9) 
            {
                temp = temp.concat("0" + Timer[1] + ":");
            }
            else 
            {
                temp = temp.concat(Timer[1] + ":");
            }
            if (Timer[0] <= 9) 
            {
                temp = temp.concat("0" + Timer[0]);
            }
            else 
            {
                temp = temp.concat(Timer[0]);
            }
            TimerText.innerHTML = temp;
        }
    }
}