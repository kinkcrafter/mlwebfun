/*
Built with featureExtractor model from ml5js and p5js
*/

let featureExtractor;
let classifier;
let video;
let loss;
let imagesOfA = 0;
let imagesOfB = 0;
let classificationResult;
let confidence = 0;

let pg;
let lastSnapShot;

let timer = 0;
let showLatestPhoto = false;

let nCurrentClass = 0;
let shutter;

function setup() {
    createCanvas(640, 480);
    pixelDensity(1);

    video = createCapture(VIDEO);
    video.size(640, 480);
    video.hide();

    // Extract the already learned features from MobileNet
    featureExtractor = ml5.featureExtractor('MobileNet', modelReady);

    //Specify the number of classes/labels
    const options = { numLabels: 2 };
    classifier = featureExtractor.classification(video, options);

    shutter = loadSound('shutter.wav');
    pg = createGraphics(width, height);
    setupButtons();
}

function draw() {
    background(122);
    image(video, 0, 0);
    if (classificationResult == 'A') {
        nCurrentClass = 0;
    } else if (classificationResult == 'B') {
        nCurrentClass++;
    }

    //Show the last image taken for a short period
    if (showLatestPhoto) {
        image(pg, 0, 0);
    }

    //Flash effect
    if (timer < 5) {
        background(timer * 25 + 130);
    } else if (timer < 8) {
        background(255);
    }

    if (timer > 100) {
        showLatestPhoto = false;
    }
    timer++;

    // We enter code here when B state is occuring for a few seconds.  shutter.play() is moved out of take picture
    if (classificationResult == 'B' && nCurrentClass > 50) {
        takePicture();
    }
}

function takePicture() {
    // play the shutter sound
    shutter.play();

    // This line will save an image thru the browser.  In this case we want to post it to the C# controller however!
    //save('myCanvas.jpg'); //Does not work in iFrames, but should work if you run the code locally outside of the p5js web editor

    pg.image(video, 0, 0);    
    timer = 0;
    showLatestPhoto = true;
    nCurrentClass = 0;

    postPicture();
}

// This function is seperate so it can be triggered via buttons or via other javascript triggers like in takePicture()
function postPicture() {
    var imagebase64data = pg.canvas.toDataURL("image/png");
    imagebase64data = imagebase64data.replace('data:image/png;base64,', '');

    let xhr = new XMLHttpRequest();
    let url = "/api/image/smartcam";

    // open a connection 
    xhr.open("POST", url, true);

    // Set the request header i.e. which type of content you are sending 
    xhr.setRequestHeader("Content-Type", "application/json");

    // Converting JSON data to string
    var data = JSON.stringify({ "imageData": imagebase64data });

    // This will be called after the response is received
    xhr.onload = function () {
        if (xhr.status != 200) { // analyze HTTP status of the response
            alert(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
        } else { // show the result
            var fileMessage = document.getElementById("fileMessage");

            fileMessage.innerHTML = xhr.response.substring(1, xhr.response.length - 1);
            fileMessage.style.display = "block";
        }
    };

    // Sending data with the request 
    xhr.send(data);
}

function openPhotos() {
    let xhr = new XMLHttpRequest();
    let url = "/api/image/smartcam";

    // open a connection 
    xhr.open("GET", url, true);

    // executing xhr 
    xhr.send();
}

// A function to be called when the model has been loaded
function modelReady() {
    select('#modelStatus').html('Base Model (MobileNet) loaded!');
}

// A function to be called when the video has loaded
function videoReady() {
    select('#videoStatus').html('Video ready!');
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
        modelStatusChanged();
    });

    // When the B button is pressed, add the current frame
    // from the video with a label of "B" to the classifier
    buttonB = select('#ButtonB');
    buttonB.mousePressed(function () {
        classifier.addImage('B');
        select('#amountOfBImages').html(imagesOfB++);
        modelStatusChanged();
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
            modelStatusChanged('load');
        });
    });
}

function modelStatusChanged(override) {
    if (override != null || (imagesOfA > 5 && imagesOfB > 5)) {
        var bt = document.getElementById('buttonPredict');
        bt.disabled = false;
        bt = document.getElementById('train');
        bt.disabled = false;
    }
}

// Show the results
function gotResults(err, result) {
    // Display any error
    if (err) {
        console.error(err);
    }
    select('#result').html(result[0].label);
    select('#confidence').html(nf(result[0].confidence, 0, 2));

    classificationResult = result[0].label;
    confidence = result[0].confidence;

    classify();
}