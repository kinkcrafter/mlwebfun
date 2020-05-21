let featureExtractor;
let classifier;
let video;
let loss;
let imagesOfA = 0;
let imagesOfB = 0;
let classificationResult;
let confidence = 0;

let videoOverlay;
var videoNode;
var filePicker;
var peekVideoBody;

var URL = window.URL || window.webkitURL

function playSelectedFile(event) {
    var file = event.srcElement.files[0]
    var fileURL = URL.createObjectURL(file)
    videoNode.src = fileURL
}

function setup() {
    createCanvas(320, 240);
    // Create a video element
    video = createCapture(VIDEO);
    video.size(320, 240);
    video.hide();
    var canvas = document.querySelector('canvas');
    canvas.style.position = 'fixed';
    canvas.style.zIndex = 300000;
    canvas.style.bottom = 0;
    canvas.style.border = '3px solid #73AD21';
    canvas.style.right = 0;
    // Extract the already learned features from MobileNet
    featureExtractor = ml5.featureExtractor('MobileNet', modelReady);
    // Create a new classifier using those features and give the video we want to use
    const options = { numLabels: 2 }; //Specify the number of classes/labels
    classifier = featureExtractor.classification(video, options);

    // Set up the UI buttons
    setupButtons();

    videoOverlay = document.querySelector('#videoOverlay');
    videoNode = document.querySelector('video')
    filePicker = select('#filePicker')

    filePicker.changed(playSelectedFile)

    textAlign(CENTER);
    textSize(64);
    fill(0, 255, 0);
}

function draw() {
    image(video, 0, 0);
    if (classificationResult == 'A') {
        text("Good", width / 2, height / 2);
        fill(0, 255, 0);
        //rect(100,100,100,100);
        videoOverlay.style.opacity = 0;
        videoNode.volume = 1;
    } else if (classificationResult == 'B') {
        text("BAD!", width / 2, height / 2);
        fill(255, 0, 0);
        //ellipse(100,100,100,100);
        videoOverlay.style.opacity = 1;
        videoNode.volume = 0;
    }
}

// A function to be called when the model has been loaded
function modelReady() {
    select('#modelStatus').html('Base Model (MobileNet) loaded!');
}


// Classify the current frame.
function classify() {
    classifier.classify(gotResults);
}

// A util function to create UI buttons
function setupButtons() {
    // When the A button is pressed, add the current frame
    // from the video with a label of "A" to the classifier
    buttonA = select('#ButtonA');
    buttonA.mousePressed(function () {
        classifier.addImage('A');
        select('#amountOfAImages').html(imagesOfA++);
    });

    // When the B button is pressed, add the current frame
    // from the video with a label of "B" to the classifier
    buttonB = select('#ButtonB');
    buttonB.mousePressed(function () {
        classifier.addImage('B');
        select('#amountOfBImages').html(imagesOfB++);
    });

    // Train Button
    train = select('#train');
    train.mousePressed(function () {
        classifier.train(function (lossValue) {
            if (lossValue) {
                loss = lossValue;
                select('#loss').html('Loss: ' + loss);
            } else {
                select('#loss').html('Done Training! Final Loss: ' + loss);
            }
        });
    });

    // Predict Button
    buttonPredict = select('#buttonPredict');
    buttonPredict.mousePressed(classify);

    // Save model
    saveBtn = select('#save');
    saveBtn.mousePressed(function () {
        classifier.save();
    });

    // Load model
    loadBtn = select('#load');
    loadBtn.changed(function () {
        classifier.load(loadBtn.elt.files, function () {
            select('#modelStatus').html('Custom Model Loaded!');
        });
    });
}

// Show the results
function gotResults(err, result) {
    // Display any error
    if (err) {
        console.error(err);
    }
    select('#result').html(result[0].label);
    select('#confidence').html(result[0].confidence);

    classificationResult = result[0].label;
    confidence = result[0].confidence;

    classify();
}