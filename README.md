# DISCLAIMER
**This Repository does NOT contain any adult content.**  However it DOES contain some graphic descriptions and code in this project is meant to provide interesting learning and entertainment opportunities for consenting adults.

# ML Model classifier and regression examples/toys for Adult consumption
Machine-learning webapps delivered via an embedded C# Console Application.  Use javascript based ML for interesting adult activities

Made with [p5js](https://p5js.org/)

## Setup
BYOAV - Bring your own Adult Videos

Run/Build this with Visual Studio.  It's built in VS 2019 however it will likely build in VSCode and earlier versions of Visual Studio.

When using VS or once compiled, the service must be ran in administrator mode so OWIN can interface with the ports.

Once running, browse to  [HERE](http://127.0.0.1:12346/)

- This can run on your LAN, you will need the private IP address as well as to allow the app's Port to accept inbound connections from local devices in Windows Firewall.

## Usage
I recommend trying the classifier first.

- Take a bunch of pictures of "BAD" behavior that you expect the video to be hidden/mute for. 
- Take a bunch of pictures of "Good" behavior that you expect the video to show for.
- Hit the Train button
- Hit the "Be Good!" button and the video will show if the application believes you're being good and it will hid the video if it believes you're being BAD!

`An example of this: _Bad behavior is classified as the submissive is outside of the video, or in the video with clothes on.  Good behavior is classified as the submissive with no clothes on.  Once the model is trained and running, the video will be blacked out if the submissive is not in the frame or in the frame with clothes on.  The video will show if the submissive is seen with no clothes on in the video._`

Regression works similar to the Classification app; instead of a Good/BAD boolean, it generates a number between 1 and 100.

- Take many pictures of very desirable behavior
- Take pictures of fairly desirable behavior
- Take pictures of somewhat desireable behavior
- Take pictures of not very desirable behavior
- Take pictures of not desirable behavior
- Hit Train

`An example of this: _Bad behavior is classified as the submissive is outside of the video, or in the video but not touching or sucking a dildo in front of the camera. Good behavior is the submissive kissing the top of the dildo. Great behavior is the submissive with the dildo far into their mouth.  After the model is trained, the video will be black if the submissive is not in the frame or not handling the dildo.  As the submissive desirably interacts with the dildo, the video will start to show.  If the submissive deepthroats the dildo, the video will play at full clarity_`

The Smart Camera works like the classifier but it will take a photo whenever "trained" behavior is observed.  The photos will be saved into appdata, a button in the app will open the folder on the host.

## Customization
Currently, the Binary, Linear, and Image controller are set up.  The Binary and Linear controllers simply recieve a value (true/false or 1-100).  I have left comments to "do something interesting here" in these controllers.  Feel free to implement your own code here!  You can... run a batch file, send a text, have the computer speak, use your imagination!

The Image controller recieves the current camera image when the Smart Camera page takes a photo.  It saves it locally but you could ALSO do whatever you want with the image at this point.

Go nuts!

## Binaries

I've included mlfun.zip which is a release "any cpu" build that I've included for folks who have trouble building this project.  It can be found [here](https://github.com/kinkcrafter/mlwebfun/blob/master/mlfun.zip)

## Contributions

Feel free to PR, I won't check this often, so you can reach me as /u/kink_crafter.  I'll be posting updates to this on /r/bdsmdiy

Thanks!
