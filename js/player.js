function Player(audioContext) {
  this.lookAhead = 25.0;
  this.audioLookAheadTime = 0.1;
  this.tempo = 60.0;
  this.current16thNote = 0;
  this.isPlaying = false;
  this.audioContext = audioContext;
  this.startTime = null;
  this.nextNoteTime = 0.0;
  this.noteResolution = 0;
  this.noteLength = 0.05;
  this.canvas = null;
  this.canvasContext = null;
  this.last16thNoteDrawn = -1;
  this.notesQueue = [];
  this.n = 0;
}

Player.prototype.secondsPerBeat = function() { return 60.0 / this.tempo; }

Player.prototype.scheduleNote = function() {
  this.n++;
  this.notesQueue.push({note:this.current16thNote, time:this.nextNoteTime});
  var oscillatorNode = this.audioContext.createOscillator();
  oscillatorNode.connect(this.audioContext.destination);
  oscillatorNode.frequency.value = (function() {
    if (this.current16thNote === 0) return 980.0
    if (this.current16thNote % 4 === 0)  return 440.0
    return 220.0
  }.bind(this)());
  if (this.n < 10) {
  console.log("--------------------------------------------------------------------------------")
  console.log("current16thNote: ", this.current16thNote);
  console.log("nextNoteTime: ", this.nextNoteTime);
  console.log("audioContext.currentTime: ", this.audioContext.currentTime);
  console.log("audioLookAheadTime: ", this.audioLookAheadTime);
  console.log("secondsPerBeat: ", this.secondsPerBeat());
  console.log("frequency val: ", oscillatorNode.frequency.value);
  }
  oscillatorNode.start(this.nextNoteTime);
  oscillatorNode.stop(this.nextNoteTime + this.noteLength);
}

Player.prototype.scheduleNotes = function() {
  if (!this.isPlaying) return;
  if (this.n < 10) {
    console.log(";;;;before while loop");
    console.log(";;;;this.nextNoteTime: ", this.nextNoteTime)
    console.log(";;;;cntx.currentTime + lookahead: ", this.audioContext.currentTime + this.audioLookAheadTime)
  }
  while (this.nextNoteTime < this.audioContext.currentTime + this.audioLookAheadTime) {
    if (this.n < 10)
      console.log("    in while loop");
    this.scheduleNote()
    this.nextNoteTime += 0.25 * this.secondsPerBeat();
    this.current16thNote = (this.current16thNote + 1) % 16;
  }
}

Player.prototype.addPlayToggle = function(playButtonEl) {
  playButtonEl.addEventListener('click', function() {
    this.isPlaying = !this.isPlaying;
    playButtonEl.innerText = this.isPlaying ? "Stop Playback" : "Play";
  }.bind(this));
}
