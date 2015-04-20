window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function( callback ){
        window.setTimeout(callback, 1000 / 60);
    };
})();
navigator.getUserMedia = (navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia);

var player = null;

function runIt() {
  //var container = document.createElement('div');
  //container.className = "container";
  //canvas = document.createElement('canvas');
  //canvasContext = canvas.getContext('2d');
  //canvas.width = window.innerWidth;
  //canvas.height = window.innerHeight;
  //document.body.appendChild(container);
  //container.appendChild(canvas);
  //canvasContext.strokeStyle = "#ffffff";
  //canvasContext.lineWidth = 2;

  // if we wanted to load audio files, etc., this is where we should do it.
  //window.onorientationchange = resetCanvas;
  //window.onresize = resetCanvas;
  //requestAnimFrame(draw);
  navigator.getUserMedia({audio:true}, gotMediaStream, gotMediaStreamError);
}

function gotMediaStream(stream) {
  var audioContext = new AudioContext();
  player = new Player(audioContext);
  player.addPlayToggle(document.getElementById("play"));

  var recordingHelper = new RecordingHelper(stream, Recorder, audioContext);
  recordingHelper.addRecordingToggle(document.getElementById("record"));

  console.log("Here");
  console.log("player.last16thNoteDrawn: ", player.last16thNoteDrawn);
  loop();
}

function gotMediaStreamError() {
  console.log("media stream not supported");
}

function loop() {
  player.scheduleNotes();
  requestAnimFrame(loop);
}
