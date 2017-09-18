import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';
import AudioGenerator from './Utilities/gen_audio';
import ButtonFrame from './Components/button_frame';
import ControlPanel from './Components/panel_control';

// import logo from './logo.svg';
// import './App.css';

const styles = StyleSheet.create({
  app: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    margin: '10px',
    textAlign: 'center',
  },
});

class App extends Component {
  constructor() {
    super();
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.state = {
      inProgress: false,
      level: 2,
      isPlayerTurn: false,
      playerAt: 0,
      playerMessups: 0,
      timeline: [...Array(100).fill(0).map(() => Math.floor(Math.random() * 4))],
      timingSet: 'medium',
      trial: {
        easy: {
          track: [...Array(20).fill(0).map((v, i) => (
            { upto: (i * 3), time: 750 - Math.floor(Math.log(1 + (i ** 100))) }
          ))],
          redos: 3,
          step: 1,
        },
        medium: {
          track: Array(100).fill({}).map((v, i) => (
            { upto: (i * 3), time: 750 - Math.floor(Math.log(1 + (i ** 100))) }
          )),
          redos: 1,
          step: 1,
        },
        hard: {
          track: Array(100).fill({}).map((v, i) => (
            { upto: (i * 3), time: 600 - Math.floor(Math.log(1 + (i ** 150))) }
          )),
          redos: 1,
          step: 3,
        },
      },
      currTrial: {},
      delay: 600,
      mainButtons: [
        { class: 'topLeft', isActive: 0, freq: 250 },
        { class: 'topRight', isActive: 0, freq: 300 },
        { class: 'botLeft', isActive: 0, freq: 400 },
        { class: 'botRight', isActive: 0, freq: 500 },
      ],
      houseMouseUp: true,
      queue: 0,
      sound: {
        roundOver: new AudioGenerator(this.audioContext),
        start: new AudioGenerator(this.audioContext),
        bad: new AudioGenerator(this.audioContext),
        reset: new AudioGenerator(this.audioContext),
      },
    };
    this.baseState = { ...this.state };
  }
  componentDidMount() {
    this.setFreqs();
  }
  setFreqs() {
    // set frequencies for sounds
    const freqs = {
      roundOver: 777, start: 261.626, bad: 200, reset: 1000,
    };
    Object.keys(this.state.sound).forEach(key => (
      this.state.sound[key].setFrequency(freqs[key])
    ));
  }
  execTimelineInterval(index, level, isNotRepeat, isInit = true) {
    if (this.state.playerMessups === this.state.currTrial.redos
      || !this.state.inProgress) {
      return;
    }
    if (index === 0 && isInit && isNotRepeat) {
      this.setState({ delay: this.nextDelay() }, () => {
        this.execTimelineInterval(index, level, isNotRepeat, false);
      });
    } else if (index <= level) {
      const delay = this.state.delay;
      const btn = this.state.timeline[index];
      setTimeout(() => {
        this.activateBtn(btn, delay);
        const nextPress = index + 1;
        this.execTimelineInterval(nextPress, level, isNotRepeat);
      }, delay);
    } else {
      let at = this.state.level;
      at += isNotRepeat ? this.state.currTrial.step : 0;
      this.setState({ level: at, isPlayerTurn: true });
    }
    // has reached number of presses in level
  }
  nextDelay(i = this.state.level) {
    let ind = 0;
    while (this.state.currTrial.track[ind].upto < i) {
      ind += 1;
    }
    return this.state.currTrial.track[ind].time;
    // return this.state.currTrial.track.reduce((acc, v) => {
    //   if (acc) { return acc; }
    //   if (v.upto > i) { return v.time; }
    //   return false;
    // }, false);
  }
  startGame(trialSelect) {
    if (trialSelect === 'reset') {
      this.setState(this.baseState);
      return;
    }
    if (trialSelect) {
      const timeline = Array(100).fill(0).map(() => (
        Math.floor(Math.random() * 4)
      ));
      const currTrial = this.state.trial[trialSelect];
      this.setState({ timeline, trialSelect, currTrial }, () => {
        this.startGame(false);
      });
      return;
    }
    if (this.state.inProgress) {
      return;
    }
    if (this.state.playerMessups === this.state.currTrial.redos) {
      this.setState(this.baseState);
      return;
    }
    this.state.sound.start.sweep(1, 75);
    this.state.sound.start.sweep(100, 75);
    this.setState({ inProgress: true }, () => {
      setTimeout(() => {
        this.execTimelineInterval(0, this.state.level, true);
      }, 1000);
    });
  }
  activateBtn(index, delay, autoDeactivate = true) {
    if (!this.state.inProgress) { return; }
    const mainButtons = [...this.state.mainButtons];
    if (mainButtons[index].isActive) { return; }
    mainButtons[index].isActive = autoDeactivate ? 2 : 1;
    this.setState({ mainButtons }, () => {
      if (autoDeactivate) {
        // follow up toggle off;
        setTimeout(() => {
          this.deactivateBtn(index);
        }, delay * 0.25);
      }
    });
  }
  deactivateBtn(index) {
    const mainButtons = [...this.state.mainButtons];
    mainButtons[index].isActive = 0;
    this.setState({ mainButtons });
    if (this.state.queue > 0) {
      const playerAt = this.state.playerAt + 1;
      const queue = this.state.queue - 1;
      this.setState({ playerAt, queue }, () => {
        // player finished level
        const currPos = (this.state.playerAt + (this.state.currTrial.step - 1));
        if (currPos === this.state.level) {
          this.setState({ playerAt: 0, isPlayerTurn: false, playerMessups: 0 }, () => {
            this.execTimelineInterval(0, this.state.level, true);
          });
        }
      });
    }
  }
  mainButtonOnClick(i) {
    if (this.state.playerMessups === this.state.currTrial.redos
      || (!this.state.isPlayerTurn && this.state.inProgress)) { return; }
    if (i === this.state.timeline[this.state.playerAt]
      || !this.state.inProgress) {
      const nextDelay = this.state.delay || 100;
      this.setState({ queue: this.state.queue + 1 }, () => {
        this.activateBtn(i, nextDelay, false);
      });
    } else {
      // player has messed up
      this.setState(_ => ({
        playerMessups: _.playerMessups + 1,
        playerAt: 0,
        isPlayerTurn: false,
      }), () => {
        if (this.state.playerMessups < this.state.currTrial.redos) {
          const swUp = (25 * this.state.playerMessups);
          this.state.sound.bad.sweep(-200 + swUp, 10 + swUp);
          this.execTimelineInterval(0, this.state.level - this.state.currTrial.step, false);
        } else {
          // game over
          this.setState({ inProgress: false });
          this.state.sound.bad.sweep(-100, 245);
        }
      });
    }
  }
  hasMouseUp() {
    this.setState({ hasMouseUp: true });
    console.log('MOUSEUP YO');
  }
  render() {
    const isRightButton = this.state.timeline[this.state.playerAt];
    return (
      <div className={css(styles.app)}>
        <div className={css(styles.buttonsFrame)}>
          <ButtonFrame
            mainButtons={() => this.state.mainButtons}
            onClick={i => this.mainButtonOnClick(i)}
            onMouseUp={i => this.deactivateBtn(i)}
            audioContext={() => this.audioContext}
            isRightButton={isRightButton}
            isPlayerTurn={this.state.isPlayerTurn}
            inProgress={this.state.inProgress}
            isReset={this.state.playerMessups === this.state.currTrial.redos}
            playerMessups={this.state.playerMessups}
            level={this.state.level}
            step={this.state.currTrial.step || 1}
          />
        </div>
        <ControlPanel
          start={v => this.startGame(v)}
          isReset={this.state.playerMessups === this.state.currTrial.redos}
          playerMessups={this.state.playerMessups}
          level={this.state.level}
          isPlayerTurn={this.state.isPlayerTurn}
          inProgress={this.state.inProgress}
          step={this.state.currTrial.step || 1}
        />
      </div>
    );
  }
}
export default App;
