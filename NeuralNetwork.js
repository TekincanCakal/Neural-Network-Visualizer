var PerceptronRadius = 32;
var PerceptronEmptyPixel = PerceptronRadius;//nodelar arası boşluk
var LayerEmptyPixel = PerceptronRadius * 4;//layerlar arası boşluk

var InputPerceptronBackColor = "lime";
var HiddenPerceptronBackColor = "cyan";
var OutputPerceptronBackColor = "red";
var BiasPerceptronBackColor = "yellow"

var PerceptronLineColor = "black";
var SelectedPerceptronLineColor = "orange";
var BiasPerceptronLineColor = "black";

var PerceptronLineWeight = 3;
var ConnectionLineWeight = 3;

var PerceptronTextColor = "black";
var BiasPerceptronTextColor = "black";
var ConnectionTextColor = "black";
var SelectedPerceptronTextColor = "black";

class NeuralNetwork
{
    constructor(inputLayer, outputLayer, hiddenLayers)
    {
        if(arguments.length === 2 || arguments.length === 3)
        {
            if(arguments.length === 2)
            {
                let layerCount = 2;
                let layerEmptyPixel = (width - ((2 * PerceptronRadius) * (layerCount + 1))) / (layerCount - 1);
                this.Layers = [new Layer(inputLayer.PerceptronCount, 0, layerEmptyPixel, true)];
                this.Layers.push(new Layer(outputLayer.PerceptronCount, 1, layerEmptyPixel, false, outputLayer.ActivationFunctionName));
            }
            else if(arguments.length === 3)
            {
                let layerCount = 2 + hiddenLayers.length;
                let layerEmptyPixel = (width - ((2 * PerceptronRadius) * (layerCount + 1))) / (layerCount - 1);
                let layerIndex = 0;
                this.Layers = [new Layer(inputLayer.PerceptronCount, layerIndex++, layerEmptyPixel, true)];
                for(let i = 0; i < hiddenLayers.length; i++)
                {
                    this.Layers.push(new Layer(hiddenLayers[i].PerceptronCount, layerIndex++, layerEmptyPixel, true, hiddenLayers[i].ActivationFunctionName));
                }
                this.Layers.push(new Layer(outputLayer.PerceptronCount, layerIndex++, layerEmptyPixel, false, outputLayer.ActivationFunctionName));
            }
            
            this.LearningRate = 0.01;

            //init weights
            for(let i = 0; i < this.Layers.length - 1; i++)
            {
                this.Layers[i].Perceptrons.forEach(perceptron => 
                {
                    perceptron.initWeights(this.Layers[i + 1].Perceptrons.length);
                }); 
                this.Layers[i].Bias.initWeights(this.Layers[i + 1].Perceptrons.length);
            }
        }
    }  
    draw() 
    {
        for(let layerIndex = 0; layerIndex < this.Layers.length; layerIndex++)
        {
            let currentLayer = this.Layers[layerIndex];
            if(currentLayer.Bias)
            {
                currentLayer.Bias.draw(BiasPerceptronBackColor, BiasPerceptronLineColor, BiasPerceptronTextColor, "Bias");
            }
            for(let i = 0; i < currentLayer.Perceptrons.length; i++)
            {
                let currentLayerPerceptron = currentLayer.Perceptrons[i];
                if(this.SelectedPerceptron)
                {
                    if(currentLayerPerceptron.Selected)
                    {
                        let backColor = layerIndex === 0 ? InputPerceptronBackColor : (layerIndex === this.Layers.length - 1) ? OutputPerceptronBackColor : HiddenPerceptronBackColor;
                        currentLayerPerceptron.draw(backColor, SelectedPerceptronLineColor, SelectedPerceptronTextColor, currentLayerPerceptron.Input);
                        if(layerIndex !== 0)
                        {
                            let prevLayer = this.Layers[layerIndex - 1];
                            for(let j = 0; j < prevLayer.Perceptrons.length; j++)
                            {
                                //draw connection line
                                let x = prevLayer.Perceptrons[j].X + PerceptronRadius + PerceptronLineWeight;
                                let y = prevLayer.Perceptrons[j].Y;
                                let x2 = currentLayerPerceptron.X - PerceptronRadius - PerceptronLineWeight;
                                let y2 = currentLayerPerceptron.Y;
                                this.drawConnection({X: x, Y: y}, {X: x2, Y: y2}, prevLayer.Perceptrons[j].Weights[i], true);  
                            }
                            if(prevLayer.Bias)
                            {
                                //draw bias connection line
                                let biasX = prevLayer.Bias.X + PerceptronRadius + PerceptronLineWeight;
                                let biasY = prevLayer.Bias.Y;
                                let biasX2 = currentLayer.Perceptrons[i].X - PerceptronRadius - PerceptronLineWeight;
                                let biasY2 = currentLayer.Perceptrons[i].Y;
                                this.drawConnection({X: biasX, Y: biasY}, {X: biasX2, Y: biasY2}, prevLayer.Bias.Weights[i], true);
                            }
                        } 
                    }
                    else
                    {
                        let backColor = layerIndex === 0 ? InputPerceptronBackColor : (layerIndex === this.Layers.length - 1) ? OutputPerceptronBackColor : HiddenPerceptronBackColor;
                        currentLayerPerceptron.draw(backColor, PerceptronLineColor, PerceptronTextColor, currentLayerPerceptron.Input);
                    }
                }
                else
                {
                    let backColor = layerIndex === 0 ? InputPerceptronBackColor : (layerIndex === this.Layers.length - 1) ? OutputPerceptronBackColor : HiddenPerceptronBackColor;
                    currentLayerPerceptron.draw(backColor, PerceptronLineColor, PerceptronTextColor, currentLayerPerceptron.Input);
                    if(layerIndex !== this.Layers.length - 1)
                    {
                        let nextLayer = this.Layers[layerIndex + 1];
                        for(let j = 0; j < nextLayer.Perceptrons.length; j++)
                        {
                            //draw connection line
                            let x = currentLayerPerceptron.X + PerceptronRadius + PerceptronLineWeight;
                            let y = currentLayerPerceptron.Y;
                            let x2 = nextLayer.Perceptrons[j].X - PerceptronRadius - PerceptronLineWeight;
                            let y2 = nextLayer.Perceptrons[j].Y;
                            this.drawConnection({X: x, Y: y}, {X: x2, Y: y2}, currentLayerPerceptron.Weights[j], false);

                            //draw bias connection line
                            if(currentLayer.Bias)
                            {
                                let biasX = currentLayer.Bias.X + PerceptronRadius + PerceptronLineWeight;
                                let biasY = currentLayer.Bias.Y;
                                let biasX2 = nextLayer.Perceptrons[j].X - PerceptronRadius - PerceptronLineWeight;
                                let biasY2 = nextLayer.Perceptrons[j].Y;
                                this.drawConnection({X: biasX, Y: biasY}, {X: biasX2, Y: biasY2}, currentLayer.Bias.Weights[i], false);
                            }
                        }
                    } 
                }      
            }  
        }
    } 
    drawConnection(point1, point2, weight, showWeight)
    {
        let lineColor = weight >= 0 ? color(0,0,255) : color(255, 0, 0);
        lineColor.setAlpha(Math.abs(weight) * 255);
        stroke(lineColor);
        strokeWeight(ConnectionLineWeight);
        line(point1.X, point1.Y, point2.X, point2.Y);  
        noStroke();
        strokeWeight(1);
        if(showWeight === true)
        {
            stroke("black")
            fill("black");
            textSize(16);
            textAlign(CENTER, CENTER);
            let num = Number(weight);
            text(num.toFixed(2), (point1.X + point2.X) / 2, (point1.Y + point2.Y) / 2);
            noStroke();
            noFill();
            /*
            push();
            let s = color(0,0,0);
            s.setAlpha(255);
            strokeWeight(1);
            stroke(s)
            fill(s);
            textSize(16);
            textAlign(CENTER, CENTER);
            translate((point1.X + point2.X) / 2, (point1.Y + point2.Y) / 2)
            let m = (point2.Y - point1.Y) / (point2.X - point1.X);
            let num = Number(weight);
            rotate(m);
            text(num.toFixed(2), 0, 0);
            pop();      
            */  
        }                    
    }
    predict(input)
    {
        if(this.Layers)
        {
            if(input.length === this.Layers[0].Perceptrons.length)
            {
                for(let i = 0; i < input.length; i++)
                {
                    this.Layers[0].Perceptrons[i].Input = input[i];
                }
                for(let layerIndex = 0; layerIndex < this.Layers.length - 1; layerIndex++)
                {
                    let currentLayer = this.Layers[layerIndex];
                    let nextLayer = this.Layers[layerIndex + 1];;
                    for(let i = 0; i < nextLayer.Perceptrons.length; i++)
                    {
                        let sum = 0;
                        currentLayer.Perceptrons.forEach(perceptron => 
                        {
                            sum += perceptron.Weights[i] * perceptron.Input;
                        });
                        if(currentLayer.Bias)
                        {
                            sum += currentLayer.Bias.Weights[i];   
                        }
                        //nextLayer.Perceptrons[i].InputNotActivation = sum;
                        nextLayer.Perceptrons[i].Input = nextLayer.ActivationFunction(sum)
                    }
                }
                let output = [];
                this.Layers[this.Layers.length - 1].Perceptrons.forEach(perceptron => 
                {
                    output.push(perceptron.Input);
                });
                return output;
            }
            else
            {
                console.log("Input length overflow the input layer");
            }
        }
        else
        {
            console.log("Can't feedForward not generated neural network");
        }
    }
    train(input, desired)
    {
        if(input.length === this.Layers[0].Perceptrons.length)
        {
            if(desired.length === this.Layers[this.Layers.length - 1].Perceptrons.length)
            {
                /*
                In output layer:
                consider w1(0.87) => d(ErrorTotal) / d(w1);
                d(ErrorTotal)/d(w1) = d(ErrorTotal) / d(Output(0).Input) * 
                                      d(Output(0).Input) / d(Output(0) but not applyied activation func) *
                                      d(Output(0) but not applyied activation func) / d(w1) 
                d(ErrorTotal)/d(Output(0).Input) = Output(0).Input - desired[0]
                d(Output(0).Input)/d(Output(0) but not applyied activation func) = Output[0].Input * (1 - Output[0].Input)
                d(Output(0) but not applyied activation func) / d(w1) = Hidden[0].Input;
                d(ErrorTotal)/d(w1) = (Output(0).Input - desired[0]) * (Output[0].Input * (1 - Output[0].Input)) * Hidden[0].Input
                newWeight = w1 - LearningRate * d(ErrorTotal)/d(w1)

                let error = currentLayer.Perceptrons[k].Input - desired[k];
                let gradient = currentLayer.Perceptrons[k].Input * (1 - currentLayer.Perceptrons[k].Input);
                let input = prevLayer.Perceptrons[i].Input;
                let delta = error * gradient * input;
                prevLayer.Perceptrons[i].Weights[k] = prevLayer.Perceptrons[i].Weights[k] - this.LearningRate * delta;
                if(prevLayer.Bias)
                {
                    let xd = parameter1 * parameter2;
                    prevLayer.Bias.Weights[k] = prevLayer.Bias.Weights[k] - this.LearningRate * xd;
                }
                                      */
                this.predict(input);
                let OutputLayer = this.Layers[this.Layers.length - 1];
                for(let i = 0; i < OutputLayer.Perceptrons.length; i++)
                {
                    OutputLayer.Perceptrons[i].Error = OutputLayer.Perceptrons[i].Input - desired[i];
                }
                let perceptronNewWeights = [];
                let biasNewWeights = [];

                //Finding New Weights
                for(let layerIndex = this.Layers.length - 1; layerIndex > 0; layerIndex--)
                {
                    let currentLayer = this.Layers[layerIndex];
                    let prevLayer = this.Layers[layerIndex - 1];
                    for(let i = 0; i < prevLayer.Perceptrons.length; i++)
                    {
                        let prevLayerError = 0;
                        for(let k = 0; k < currentLayer.Perceptrons.length; k++)
                        {
                            let error = currentLayer.Perceptrons[k].Error;
                            let garadient = currentLayer.ActivationFunctionDerative(currentLayer.Perceptrons[k].Input);//currentLayer.Perceptrons[k].Input * (1 - currentLayer.Perceptrons[k].Input)
                            let input = prevLayer.Perceptrons[i].Input
                            let perceptronDelta = error * garadient * input;
                            let perceptronNewWeight = prevLayer.Perceptrons[i].Weights[k] - this.LearningRate * perceptronDelta;
                            prevLayerError += error * prevLayer.Perceptrons[i].Weights[k];
                            perceptronNewWeights.push({LayerIndex: layerIndex - 1, PerceptronIndex: i, WeightIndex: k, NewWeight: perceptronNewWeight});
                            if(prevLayer.Bias)
                            {
                                let biasDelta = error * garadient;
                                let biasNewWeight = prevLayer.Bias.Weights[k] - this.LearningRate * biasDelta;
                                biasNewWeights.push({LayerIndex: layerIndex - 1, WeightIndex: k, NewWeight: biasNewWeight});
                            }
                        }
                        prevLayer.Perceptrons[i].Error = prevLayerError;
                    }
                }
                //Applying New Weights
                for(let i = 0; i < perceptronNewWeights.length; i++)
                {   
                    let currentPerceptron = perceptronNewWeights[i];
                    this.Layers[currentPerceptron.LayerIndex].Perceptrons[currentPerceptron.PerceptronIndex].Weights[currentPerceptron.WeightIndex] = currentPerceptron.NewWeight;
                }
                for(let i = 0; i < biasNewWeights.length; i++)
                {
                    let currentBias = biasNewWeights[i];
                    this.Layers[currentBias.LayerIndex].Bias.Weights[currentBias.WeightIndex] = currentBias.NewWeight;
                }
            }
            else
            {
                console.log("desired length overflow the output layer");
            }
        }
        else
        {
            console.log("input length overflow the input layer");
        }
    }
    selectPerceptron(point)
    {
        let isEmptyPoint = true;
        this.Layers.forEach(layer => 
        {
            layer.Perceptrons.forEach(perceptron => 
            {
                if(sqrt(pow((point.X - perceptron.X), 2) + pow((point.Y - perceptron.Y), 2)) < PerceptronRadius)
                {
                    perceptron.Selected = true;
                    this.SelectedPerceptron = perceptron; 
                    isEmptyPoint = false;
                }
                else
                {
                    perceptron.Selected = false;
                }
            })
        })
        if(isEmptyPoint)
        {
            this.SelectedPerceptron = undefined;
        }
    }
    brain2Json()
    {
        return JSON.stringify(this,  null, "\t");
    }
    clone()
    {
        return NeuralNetwork.json2Brain(this.brain2Json());
    }
    mutate(mutateRate)
    {
        for(let layerIndex = 0; layerIndex < this.Layers.length - 1; layerIndex++)
        {
            let currentLayer = this.Layers[layerIndex];
            let nextLayer = this.Layers[layerIndex + 1];
            for(let i = 0; i < currentLayer.Perceptrons.length; i++)
            {
                for(let j = 0; j < nextLayer.Perceptrons.length; j++)
                {
                    if(random(1) < mutateRate)
                    {
                        let isMines = (Math.random() < 0.5);
                        let randomWeight = random(0.01, 1.0);
                        currentLayer.Perceptrons[i].Weights[k] = isMines ? -randomWeight : randomWeight;
                    }
                }
            }
        }
    }
    saveBrain()
    {
        downloadString(this.brain2Json(), "text/txt", "Brain.txt");
    }
    static json2Brain(json)
    {
        let obj = JSON.parse(json);
        let layerCount = obj.Layers.length;
        let learningRate = obj.LearningRate;
        let nn;
        if(layerCount === 2)
        {
            let inputLayer = {PerceptronCount: obj.Layers[0].Perceptrons.length};
            let outputLayer = {PerceptronCount: obj.Layers[1].Perceptrons.length, ActivationFunctionName: obj.Layers[1].ActivationFunctionName};
            nn = new NeuralNetwork(inputLayer, outputLayer);
        }
        else
        {
            let inputLayer = {PerceptronCount: obj.Layers[0].Perceptrons.length};
            let hiddenLayers = [];
            for(let i = 1; i < layerCount - 1; i++)
            {
                hiddenLayers.push({PerceptronCount: obj.Layers[i].Perceptrons.length, ActivationFunctionName: obj.Layers[i].ActivationFunctionName});
            }
            let outputLayer = {PerceptronCount: obj.Layers[layerCount - 1].Perceptrons.length, ActivationFunctionName: obj.Layers[layerCount - 1].ActivationFunctionName};
            nn = new NeuralNetwork(inputLayer, outputLayer, hiddenLayers);
        }
        for(let layerIndex = 0; layerIndex < layerCount; layerIndex++)
        {
            let currentLayer = nn.Layers[layerIndex];
            for(let i = 0; i < currentLayer.Perceptrons.length; i++)
            {
                //currentLayer.Perceptrons[i].Input = obj.Layers[layerIndex].Perceptrons[i].Input;
                if(layerIndex !== layerCount - 1)
                {
                    let nextLayer = nn.Layers[layerIndex + 1];
                    for(let k = 0; k < nextLayer.Perceptrons.length; k++)
                    {
                        currentLayer.Perceptrons[i].Weights[k] = obj.Layers[layerIndex].Perceptrons[i].Weights[k];
                    }
                }
            }
        }
        nn.LearningRate = learningRate;
        return nn;
    }
    static getActivationFunction(name)
    {
        if(name === "Sigmoid")
        {
            return [NeuralNetwork.sigmoid, NeuralNetwork.dsigmoid];
        }
    } 
    //Activation Funcs
    static sigmoid(n) 
    {
        return 1 / ( 1 + Math.pow(Math.E, -n));
    }
    static dsigmoid(n)
    {
        return sigmoid(n) * (1 - sigmoid(n));
    }
}
class Layer
{
    constructor(perceptronCount, layerIndex, layerEmptyPixel, hasBias, activationFuncName)
    {
        this.Perceptrons = [];

        let offset;
        if(hasBias)
        {
            offset = (height - ((perceptronCount + 1) * PerceptronRadius * 2 + (perceptronCount * PerceptronRadius))) / 2;
        }
        else
        {
            offset = (height - (perceptronCount * PerceptronRadius * 2 + ((perceptronCount - 1) * PerceptronRadius))) / 2;
        }

        for(let perceptronIndex = 0; perceptronIndex < perceptronCount; perceptronIndex++)
        {
            let x = 2 * PerceptronRadius + (layerIndex * (2 * PerceptronRadius + layerEmptyPixel));
            let y = PerceptronRadius + offset + ((perceptronIndex * PerceptronRadius * 2) + (perceptronIndex * PerceptronEmptyPixel));
            let newPerceptron = new Perceptron(x, y);
            this.Perceptrons.push(newPerceptron);
        }

        if(activationFuncName)
        {
            this.ActivationFunctionName = activationFuncName;
            let funcs = NeuralNetwork.getActivationFunction(activationFuncName);
            this.ActivationFunction = funcs[0];
            this.ActivationFunctionDerative = funcs[1];
        }

        if(hasBias === true)
        {
            let x = 2 * PerceptronRadius + (layerIndex * (2 * PerceptronRadius + layerEmptyPixel));
            let y = PerceptronRadius + offset + ((perceptronCount * PerceptronRadius * 2) + (perceptronCount * PerceptronEmptyPixel));
            this.Bias = new Perceptron(x, y);
            this.Bias.Input = 1;    
        }
    }
}
class Perceptron
{
    constructor(x, y)
    {
        this.X = x;
        this.Y = y;
    }
    initWeights(perceptronCount)
    {
        this.Weights = [];
        for(let i = 0; i < perceptronCount; i++)
        {
            let isMines = (Math.random() < 0.5);
            let randomWeight = random(0.01, 1.0);
            this.Weights.push(isMines ? -randomWeight : randomWeight);
        } 
    }
    draw(backColor, lineColor, textColor, input)
    {
        stroke(lineColor);
        strokeWeight(PerceptronLineWeight);
        let colorBack = color(backColor);
        colorBack.setAlpha((this.Input ?  Math.abs(this.Input) : 0) * 255);
        fill(colorBack);
        ellipse(this.X, this.Y, 2 * PerceptronRadius);
        noStroke();
        strokeWeight(1);
        noFill();

        stroke(textColor);
        textSize(16);
        textAlign(CENTER, CENTER);
        if(input)
        {
            let number = Number(input);
            if(number)
            {
                text(number.toFixed(2), this.X, this.Y);
            }
            else
            {
                text(input, this.X, this.Y);
            }   
        }
        else
        {
            text("0.00", this.X, this.Y);
        }
        noStroke();
        textSize(1);
    }
}


