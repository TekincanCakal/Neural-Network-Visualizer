var nodeRadius = 16;//çember yarıçapı
var nodeEmptyPixel = nodeRadius;//nodelar arası boşluk
var layerEmptyPixel = nodeRadius * 4;//layerlar arası boşluk
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
class NeuralNetwork
{
    constructor(inputPerceptronCount, outputPerceptronCount, learningRate = 0.01)
    {
        this.InputPerceptronCount = inputPerceptronCount;
        this.OutputPerceptronCount = outputPerceptronCount;
        this.HiddenPerceptronCounts = [];
        this.LearningRate = learningRate;
    }
    generate()
    {
        this.OutputLayer = new Layer(this.OutputPerceptronCount, undefined, sign);
        if(this.HiddenPerceptronCounts.length === 0)
        {
            this.InputLayer = new Layer(this.InputPerceptronCount, this.OutputLayer, sign);
        }
        else
        {
            this.HiddenLayers = [];
            for(let i = 0; i < this.HiddenPerceptronCounts.length; i++)
            {
                if(i === 0)
                {
                    this.HiddenLayers.push(new Layer(this.HiddenPerceptronCounts[i], undefined, sign));
                }
                else if(i === (this.HiddenPerceptronCounts.length - 1))
                {
                    this.HiddenLayers.push(new Layer(this.HiddenPerceptronCounts[i], this.OutputLayer, sign));
                    this.HiddenLayers[this.HiddenLayers.length - 2].setNextLayer(this.HiddenLayers[this.HiddenLayers.length - 1]);
                }
                else
                {
                    this.HiddenLayers.push(new Layer(this.HiddenPerceptronCounts[i], undefined, sign));
                    this.HiddenLayers[this.HiddenLayers.length - 2].setNextLayer(this.HiddenLayers[this.HiddenLayers.length - 1]);
                }
            }
            this.InputLayer = new Layer(this.InputPerceptronCount, this.HiddenLayers[0], sign);
        }
    }
    addHiddenLayer(hiddenPerceptronCount)
    {
        this.HiddenPerceptronCounts.push(hiddenPerceptronCount);
    }
    draw()
    {
        let Layers = this.getLayers();
        let layerEmptyPixel = (width - ((2 * nodeRadius) * (Layers.length + 1))) / (Layers.length - 1);
        for(let layerIndex = 0; layerIndex < Layers.length; layerIndex++)
        {
            Layers[layerIndex].draw(layerIndex, layerEmptyPixel, this.HasSelectedPerceptron);
        }
    }
    getLayers()
    {
        let Layers = [this.InputLayer];
        this.HiddenLayers.forEach(hiddenLayer => 
        {
            Layers.push(hiddenLayer);
        });
        Layers.push(this.OutputLayer);
        return Layers;
    }
    isPixelContains(point)
    {
        let Layers = this.getLayers();
        let layerEmptyPixel = (width - ((2 * nodeRadius) * (Layers.length + 1))) / (Layers.length - 1);
        for(let layerIndex = 0; layerIndex < Layers.length; layerIndex++)
        {
            let selected = Layers[layerIndex].isPixelContains(point, layerIndex, layerEmptyPixel);
            if(selected)
            {
                return selected;
            }
        }
        return undefined;
    }
    resetSelectedPerceptron()
    {
        this.getLayers().forEach(layer => 
        {
            layer.resetSelectedPerceptron();
        });
    }
}
class Perceptron
{
    constructor(activationFunction)
    {
        this.Inputs = [];
        this.ActivationFunction = activationFunction;  
    }
    setConnection(connectedPerceptrons)
    {
        if(connectedPerceptrons.length > 0)
        {
            this.ConnectedPerceptrons = connectedPerceptrons;
            this.Weights = [];
            for(let i = 0; i < connectedPerceptrons.length; i++)
            {
                this.Weights.push(random(-1, 1));
            }
        }
    }
    draw(layerIndex, layerEmptyPixel, perceptronIndex, offset, hasSelectedPerceptron)
    {
        stroke("black");
        let x = 2 * nodeRadius + (layerIndex * (2 * nodeRadius + layerEmptyPixel));
        let y = nodeRadius + offset + ((perceptronIndex * nodeRadius * 2) + (perceptronIndex * nodeEmptyPixel));
        if(this.Selected)
        {
            fill("orange");
        }
        else
        {
            fill("white");
        }
        ellipse(x, y, 2 * nodeRadius);
        if((hasSelectedPerceptron && this.Selected) || (!hasSelectedPerceptron))
        {
            if(this.ConnectedPerceptrons)
            {
                let offset2 = (height - (this.ConnectedPerceptrons.length * nodeRadius * 2 + ((this.ConnectedPerceptrons.length- 1) * nodeRadius))) / 2;
                for(let j = 0; j < this.ConnectedPerceptrons.length; j++)
                {
                    stroke("blue");
                    let x2 = 2 * nodeRadius + ((layerIndex + 1) * (2 * nodeRadius + layerEmptyPixel));
                    let y2 = nodeRadius + offset2 + ((j * nodeRadius * 2) + (j * nodeEmptyPixel));
                    line(x + nodeRadius, y, x2 - nodeRadius, y2);
                    if(hasSelectedPerceptron)
                    {
                        let number = Number(this.Weights[j]);
                        fill("black");
                        stroke("black")
                        text(number.toFixed(2), (x + x2) / 2, (y2 + y) / 2); 
                    }
                }
            }
        }
        else if(hasSelectedPerceptron)
        {
            if(this.ConnectedPerceptrons)
            {
                let offset2 = (height - (this.ConnectedPerceptrons.length * nodeRadius * 2 + ((this.ConnectedPerceptrons.length- 1) * nodeRadius))) / 2;
                for(let j = 0; j < this.ConnectedPerceptrons.length; j++)
                {
                    if(this.ConnectedPerceptrons[j].Selected)
                    {
                        stroke("blue");
                        let x2 = 2 * nodeRadius + ((layerIndex + 1) * (2 * nodeRadius + layerEmptyPixel));
                        let y2 = nodeRadius + offset2 + ((j * nodeRadius * 2) + (j * nodeEmptyPixel));
                        line(x + nodeRadius, y, x2 - nodeRadius, y2);
                        let number = Number(this.Weights[j]);
                        fill("black");
                        stroke("black")
                        let m = y2 - y / x2-x;
                        //console.log("m: " + m);
                        text(number.toFixed(2), (x + x2) / 2, (y2 + y) / 2); 
                        //textObject.rotate(m);
                    }
                }
            }
        }
    }
    isPixelContains(point, layerIndex, layerEmptyPixel, perceptronIndex, offset)
    {
        let x = 2 * nodeRadius + (layerIndex * (2 * nodeRadius + layerEmptyPixel));
        let y = nodeRadius + offset + ((perceptronIndex * nodeRadius * 2) + (perceptronIndex * nodeEmptyPixel));
        if(sqrt(pow((point.X - x), 2) + pow((point.Y - y), 2)) < nodeRadius)
        {
            return this;
        }
        else
        {
            return undefined;
        }
    }
}
class Layer
{
    constructor(perceptronCount, nextLayer = undefined, activationFunction)
    {
        this.PerceptronCount = perceptronCount;
        this.ActivationFunction = activationFunction;
        this.Perceptrons = [];
        for(let i = 0; i < this.PerceptronCount; i++)
        {
            this.Perceptrons.push(new Perceptron(this.ActivationFunction));
        }
        this.setNextLayer(nextLayer);
    }
    setNextLayer(nextLayer)
    {
        if(nextLayer)
        {
            this.Perceptrons = [];
            for(let i = 0; i < this.PerceptronCount; i++)
            {
                let arr = [];
                if(nextLayer)
                {
                    for(let j = 0; j < nextLayer.PerceptronCount; j++)
                    {
                        arr.push(nextLayer.Perceptrons[j]);
                    }
                }
                let newPerceptron = new Perceptron(this.ActivationFunction);
                newPerceptron.setConnection(arr);
                this.Perceptrons.push(newPerceptron);
            }  
        }
        this.NextLayer = nextLayer;
    }
    draw(layerIndex, layerEmptyPixel, hasSelectedPerceptron)
    {
        let offset = (height - (this.PerceptronCount * nodeRadius * 2 + ((this.PerceptronCount - 1) * nodeRadius))) / 2;
        for(let i = 0; i < this.PerceptronCount; i++)
        {
            this.Perceptrons[i].draw(layerIndex, layerEmptyPixel, i, offset, hasSelectedPerceptron);
        }
    }
    isPixelContains(point, layerIndex, layerEmptyPixel)
    {
        let offset = (height - (this.PerceptronCount * nodeRadius * 2 + ((this.PerceptronCount - 1) * nodeRadius))) / 2;
        for(let i = 0; i < this.PerceptronCount; i++)
        {
            let back = this.Perceptrons[i].isPixelContains(point, layerIndex, layerEmptyPixel, i, offset);
            if(back)
            {
                return back;
            }
        }
    }
    resetSelectedPerceptron()
    {
        for(let i = 0; i < this.PerceptronCount; i++)
        {
            this.Perceptrons[i].Selected = false;
        }
    }
}