var Slider;
var SliderText;
var Start;
var CanvasSize = 800.0;
var Timer = [0, 0, 0];
var TimerText;
var neuralNetwork;
function setup() 
{
    let cns = createCanvas(CanvasSize, CanvasSize);
    cns.parent("canvas");
    background("255");
    color("black");
    rect(0, 0, CanvasSize, CanvasSize);
    Start = false;
    Slider = document.getElementById("frameRateSlider");
    SliderText = document.getElementById("frameRateSliderText");
    TimerText = document.getElementById("timerText");
    SliderText.innerHTML = "FrameRate: " + this.Slider.value
    Slider.oninput = function () 
    {
        SliderText.innerHTML = "FrameRate: " + this.value;
    }
    this.neuralNetwork = new NeuralNetwork(6, 2, 0.01);
    this.neuralNetwork.addHiddenLayer(4);  
    this.neuralNetwork.addHiddenLayer(8); 
    this.neuralNetwork.generate();
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
    neuralNetwork.resetSelectedPerceptron();
    let selectedPerceptron = this.neuralNetwork.isPixelContains({X: mouseX, Y: mouseY});
    if(selectedPerceptron)
    {
        selectedPerceptron.Selected = true;
        neuralNetwork.HasSelectedPerceptron = true;
    }
    else
    {
        neuralNetwork.HasSelectedPerceptron = false;
    }
}
function draw() 
{
    parseInt(Slider.value);
    background("white");
    rect(0, 0, width, height);
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