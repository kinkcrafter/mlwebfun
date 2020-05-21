let featureExtractor;
let regressor;
let video;
let loss;
let slider;
let samples = 0;

let lerpedResult = 0.5;
let allowedToPredict = true;
//let song;
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
    canvas.style.border= '3px solid #73AD21';
    canvas.style.right = 0;
    // Extract the features from MobileNet
    featureExtractor = ml5.featureExtractor('MobileNet', modelReady);
    // Create a new regressor using those features and give the video we want to use
    regressor = featureExtractor.regression(video, videoReady);
    // Create the UI buttons
    setupButtons();
    //song.loop();

    videoOverlay = document.querySelector('#videoOverlay');
    videoNode = document.querySelector('video')
    filePicker = select('#filePicker')

    filePicker.changed(playSelectedFile)
}

function draw() {
    image(video, 0, 0, width, height);

    var regressionControl = slider.value()

    if (regressionControl < .2) {
        regressionControl = 0
    }
    else if (regressionControl > .8) {
        regressionControl = 1
    }

    videoOverlay.style.opacity = regressionControl;
    videoNode.volume = (1 - regressionControl);
}

// A function to be called when the model has been loaded
function modelReady() {
    select('#modelStatus').html('Model loaded!');
}

// A function to be called when the video has loaded
function videoReady() {
    select('#videoStatus').html('Video ready!');
}

// Classify the current frame.
function predict() {
    allowedToPredict = true;
    regressor.predict(gotResults);
}

function stopPredicting() {
    allowedToPredict = false;
}

// A util function to create UI buttons
function setupButtons() {
    slider = select('#slider');
    select('#addSample').mousePressed(function () {
        regressor.addImage(slider.value());
        select('#amountOfSamples').html(samples++);
    });

    // Train Button
    select('#train').mousePressed(function () {
        regressor.train(function (lossValue) {
            if (lossValue) {
                loss = lossValue;
                select('#loss').html('Loss: ' + loss);
            } else {
                select('#loss').html('Done Training! Final Loss: ' + loss);
            }
        });
    });

    // Predict Button
    select('#buttonPredict').mousePressed(predict);
    select('#buttonStopPredict').mousePressed(stopPredicting);

    // Save model
    saveBtn = select('#save');
    saveBtn.mousePressed(function () {
        regressor.save();
    });

    // Load model
    loadBtn = select('#load');
    loadBtn.changed(function () {
        regressor.load(loadBtn.elt.files, function () {
            select('#modelStatus').html('Custom Model Loaded!');
        });
    });

}

// Show the results
function gotResults(err, result) {
    if (err) {
        console.error(err);
    }
    if (result && result.value && allowedToPredict) {
        lerpedResult = lerp(lerpedResult, result.value, 0.15);
        slider.value(lerpedResult);
        predict();
    }
}