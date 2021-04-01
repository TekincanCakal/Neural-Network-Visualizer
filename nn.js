
function sign(n)
{
    if(n >= 0)
    {
        return 1;
    }
    else
    {
        return -1;
    }
}
function sigmoid(n) 
{
    return 1 / ( 1 + Math.pow(Math.E, -n));
}
class NeuralNetwork
{
    constructor(layers, learningRate)
    {
        let layerEmptyPixel = (width - ((2 * nodeRadius) * (layers.length + 1))) / (layers.length - 1);
        this.LearningRate = learningRate;

        //creating layers
        this.Layers = [];
        for(let i = 0; i < layers.length; i++)
        {
            this.Layers.push(new Layer(layers[i].PerceptronCount, i, layerEmptyPixel, layers[i].ActivationFunction));
        }

        //init weights
        for(let i = 0; i < this.Layers.length - 1; i++)
        {
            this.Layers[i].Perceptrons.forEach(perceptron => 
            {
                perceptron.initWeights(this.Layers[i + 1].Perceptrons.length);
            }); 
        }
    }
    draw()
    {
        if(this.Layers)
        {
            for(let layerIndex = 0; layerIndex < this.Layers.length; layerIndex++)
            {
                let currentLayer = this.Layers[layerIndex];
                currentLayer.Perceptrons.forEach(perceptron => 
                {
                    perceptron.draw();
                    
                    //draw connections
                    if(layerIndex !== this.Layers.length - 1)
                    {
                        let nextLayer = this.Layers[layerIndex + 1];
                        for(let i = 0; i < nextLayer.Perceptrons.length; i++)
                        {
                            //draw connection line
                            stroke(perceptron.Weights[i] >= 0 ? "blue" : "red");
                            strokeWeight(lineWidth);
                            let x = perceptron.X + nodeRadius;
                            let y = perceptron.Y;
                            let x2 = nextLayer.Perceptrons[i].X - nodeRadius;
                            let y2 = nextLayer.Perceptrons[i].Y;
                            line(x, y, x2, y2);
                            noStroke();
                            strokeWeight(1);
        
                            
                            //draw text connection line weight
                            fill("black");
                            stroke("black")
                            let number = Number(perceptron.Weights[i]);
                            text(number.toFixed(2), (x + x2) / 2, (y2 + y) / 2); 
                            noFill();
                            noStroke();
                            
                        }
                    }
                });
            }
        }
        else
        {
            console.log("Can't draw not generated neural network");
        }
    }
    feedForward(input)
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
                    for(let i = 0; i < this.Layers[layerIndex + 1].Perceptrons.length; i++)
                    {
                        let sum = 0;
                        this.Layers[layerIndex].Perceptrons.forEach(perceptron => 
                        {
                            sum += perceptron.Weights[i] * perceptron.Input;
                        });
                        if(this.Layers[layerIndex + 1].Perceptrons[i].Bias)
                        {
                            sum += this.Layers[layerIndex + 1].Perceptrons[i].Bias;   
                        }
                        this.Layers[layerIndex + 1].Perceptrons[i].Input = this.Layers[layerIndex + 1].ActivationFunction(sum)
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
                var guess = this.feedForward(input);
                for(let i = 0; i < desired.length; i++)
                {
                    this.Layers[this.Layers.length - 1].Perceptrons[i].Error = desired[i] - guess[i];
                }
                for(let layerIndex = this.Layers.length - 1; layerIndex > 0; layerIndex--)
                {
                    let sum = 0;
                    for(let i = 0; i < this.Layers[layerIndex].Perceptrons.length; i++)
                    {
                        for(let j = 0; j < this.Layers[layerIndex - 1].Perceptrons.length; j++)
                        {
                            sum += this.Layers[layerIndex - 1].Perceptrons[j].Weights[i];
                        }
                    }
                    for(let i = 0; i < this.Layers[layerIndex].Perceptrons.length; i++)
                    {
                        for(let j = 0; j < this.Layers[layerIndex - 1].Perceptrons.length; j++)
                        {
                            this.Layers[layerIndex - 1].Perceptrons[j].Error = (this.Layers[layerIndex - 1].Perceptrons[j].Weights[i] / sum) * this.Layers[layerIndex].Perceptrons[i].Error;
                            console.log("(" + this.Layers[layerIndex - 1].Perceptrons[j].Weights[i]  + " / " + sum + ") * " + this.Layers[layerIndex].Perceptrons[i].Error);
                            let deltaWeight = this.LearningRate * this.Layers[layerIndex - 1].Perceptrons[j].Error * this.Layers[layerIndex - 1].Perceptrons[j].Input;
                            let deltaBias = this.LearningRate * this.Layers[layerIndex - 1].Perceptrons[j].Error;
                            this.Layers[layerIndex - 1].Perceptrons[j].Weights[i] += deltaWeight;
                            this.Layers[layerIndex - 1].Perceptrons[j].Bias += deltaBias;
                        }
                    }  
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
                if(sqrt(pow((point.X - perceptron.X), 2) + pow((point.Y - perceptron.Y), 2)) < nodeRadius)
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
}
class Layer
{
    constructor(perceptronCount, layerIndex, layerEmptyPixel, activationFunction)
    {
        this.Perceptrons = [];
        let offset = (height - (perceptronCount * nodeRadius * 2 + ((perceptronCount - 1) * nodeRadius))) / 2;
        for(let perceptronIndex = 0; perceptronIndex < perceptronCount; perceptronIndex++)
        {
            let x = 2 * nodeRadius + (layerIndex * (2 * nodeRadius + layerEmptyPixel));
            let y = nodeRadius + offset + ((perceptronIndex * nodeRadius * 2) + (perceptronIndex * nodeEmptyPixel));
            this.Perceptrons.push(new Perceptron(x, y));
        }
        if(activationFunction)
        {
            this.ActivationFunction = activationFunction;
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
            this.Weights.push(random(-1, 1));
        } 
    }
    draw()
    {
        stroke(this.Selected ? "blue" : "black");
        strokeWeight(lineWidth);
        fill("white");
        ellipse(this.X, this.Y, 2 * nodeRadius);
        noFill();
        noStroke();
        strokeWeight(1);

        if(this.Input)
        {
            stroke("black");
            fill("black");
            textAlign(CENTER);
            let number = Number(this.Input);
            text(number.toFixed(2), this.X, this.Y);
            noFill();
            noStroke();
        }
    }
}
