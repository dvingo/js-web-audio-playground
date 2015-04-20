function RecordingHelper(audioStream, Recorder, audioContext) {
  this.audioStream = audioStream;
  this.isRecording = false;
  this.audioContext = audioContext;
  var streamSource = this.audioContext.createMediaStreamSource(audioStream);
  var analyserNode = audioContext.createAnalyser();
  analyserNode.fftSize = 2048;
  streamSource.connect(analyserNode);
  this.recorder = new Recorder(streamSource);
}

RecordingHelper.prototype.addRecordingToggle = function(recordingButton) {
  recordingButton.addEventListener('click', function() {
    if (this.isRecording) {
      recordingButton.innerText = "Record";
      this.recorder.stop();
      this.recorder.getBuffers(RecordingHelper.prototype.setupPlayback.bind(this));
    } else {
      this.recorder.record();
      recordingButton.innerText = "Stop Recording";
    }

    this.isRecording = !this.isRecording;
  }.bind(this));
}

RecordingHelper.prototype.setupPlayback = function(buffers) {
  var bufferSource = this.audioContext.createBufferSource();
  var buffer = this.audioContext.createBuffer(1, buffers[0].length, this.audioContext.sampleRate);
  buffer.getChannelData(0).set(buffers[0]);
  bufferSource.buffer = buffer;
  bufferSource.connect(this.audioContext.destination);
  bufferSource.start(0);
}

