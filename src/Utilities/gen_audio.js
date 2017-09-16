class AudioGenerator {
  constructor(audioContext = new (window.AudioContext || window.AudioContext)()) {
    this.isConnected = false;
    this.audioContext = audioContext;
    this.gainNode = this.audioContext.createGain();
    this.oscillator = this.audioContext.createOscillator();
    this.oscillator.connect(this.gainNode);
    this.oscillator.start();
    this.gainNode.gain.value = 0;
    this.gainNode.connect(this.audioContext.destination);
    this.freq = 1000;
    this.oscillator.frequency.value = this.freq;
    this.queue = 0;
  }
  setFrequency(freq) {
    this.oscillator.frequency.value = freq;
    this.freq = freq;
  }
  start() {
    this.gainNode.gain.value = 0.1;
  }
  stop() {
    this.gainNode.gain.value = 0;
  }
  sweep(offset, parts) {
    this.start();
    this.queue += 1;
    const increments = offset / parts;
    const loop = (i, inc) => {
      window.setTimeout(() => {
        const newFreq = this.freq + (i * inc);
        this.oscillator.frequency.value = newFreq;
        if ((offset < 0 && newFreq < (this.freq + offset))
        || ((offset > 0) && newFreq > (this.freq + offset))) {
          this.queue -= 1;
          if (this.queue === 0) {
            this.oscillator.frequency.value = this.freq;
            this.stop();
          }
        } else {
          loop(i + 1, inc);
        }
      }, 5);
    };
    loop(0, increments, this.oscillator.frequency.value);
  }
  play(timeOut) {
    this.start();
    window.setTimeout(() => {
      this.stop();
    }, timeOut);
  }
}
export default AudioGenerator;
