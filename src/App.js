import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';
import MainButton from './Components/button_main';
import ControlPanel from './Components/panel_control';
import AudioGenerator from './Utilities/gen_audio';
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
  buttonsFrame: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    width: '520px',
    transform:
    'matrix3d(1,0,0.00,0,0.00,0.71,0.71,-0.0007,0,-0.71,0.71,0,0,0,0,1)',
    '@media (max-width: 550px)': {
      width: '360px',
    },
    minWidth: '360px',
  },
});

class App extends Component {
  constructor() {
    super();
    this.audioContext = new (window.AudioContext || window.AudioContext)();
    this.state = {
      inProgress: false,
      isTimelinePlaying: false,
      level: 2,
      isPlayerTurn: false,
      playerAt: 0,
      playerMessups: 0,
      timeline: Array(100).fill(0).map(() => Math.floor(Math.random() * 4)),
      timingsSet: 'default',
      timings: {
        default: Array(100).fill({}).map((v, i) => ({
          upto: i + 3, time: 600 - (i * i),
        })),
      },
      delay: 600,
      mainButtons: [
        { class: 'topLeft', highlight: false, freq: 110.000 },
        { class: 'topRight', highlight: false, freq: 130.813 },
        { class: 'botLeft', highlight: false, freq: 164.814 },
        { class: 'botRight', highlight: false, freq: 220.000 },
      ],
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
  execTimelineInterval(index, level, toNext, isInit = true) {
    if (this.state.playerMessups === 3) {
      return;
    }
    if (index === 0 && !isInit) {
      const getDelay = this.nextDelay();
      this.setState({ isTimelinePlaying: true, delay: getDelay }, () => {
        this.execTimelineInterval(index, level, toNext, false);
      });
      return;
    }
    if (index <= level) {
      const delay = this.state.delay;
      const buttonTodo = this.state.timeline[index];
      setTimeout(() => {
        this.doHighlight(buttonTodo, delay, true);
        const ind = index + 1;
        this.execTimelineInterval(ind, level, toNext);
      }, delay);
    } else {
      let at = this.state.level;
      at += toNext ? 1 : 0;
      console.log(at, this.state.level);
      this.setState({ level: at, isPlayerTurn: true, isTimelinePlaying: false });
    }
  }
  doHighlight(index, delay, active) {
    const mainButtons = this.state.mainButtons.slice();
    mainButtons[index].highlight = active;
    console.log(index, mainButtons[index].highlight);
    this.setState({ mainButtons }, () => {
      if (active) {
      // follow up toggle off;
        setTimeout(() => {
          this.doHighlight(index, false, false);
        }, delay * 0.25);
      }
    });
  }
  startGame(difficulty) {
    if (this.state.inProgress) {
      return;
    }
    if (this.state.playerMessups === 3) {
      this.setState(this.baseState);
      return;
    }
    this.state.sound.start.sweep(1, 75);
    this.state.sound.start.sweep(100, 75);
    this.setState({ inProgress: true });
    const onTimelineComplete = () => {
      setTimeout(() => {
        this.execTimelineInterval(0, this.state.level, true);
      }, 1000);
    };
    if (this.state.timingSet === 'default') {
      const timeline = Array(100).fill(0).map(() => (
        Math.floor(Math.random() * 4)
      ));
      this.setState({ timeline }, onTimelineComplete);
    } else {
      onTimelineComplete();
    }
  }
  nextDelay(i = this.state.level) {
    const timeOuts = this.state.timings[this.state.timingsSet];
    return timeOuts.reduce((acc, v) => {
      if (acc) { return acc; }
      if (v.upto > i) { return v.time; }
      return false;
    }, false);
  }
  mainButtonOnClick(i) {
    if (this.state.playerMessups === 3 || !this.state.isPlayerTurn) { return; }
    const playerAt = this.state.playerAt;
    if (i === this.state.timeline[playerAt] && !this.state.isTimelinePlaying) {
      const nextDelay = this.state.delay;
      this.doHighlight(i, nextDelay, true);
      this.setState({ playerAt: playerAt + 1 }, () => {
        // player finished level
        if (this.state.playerAt === this.state.level) {
          this.setState({ playerAt: 0, isPlayerTurn: false, playerMessups: 0 }, () => {
            this.execTimelineInterval(0, this.state.level, true);
          });
        }
      });
      // messed up
    } else {
      this.setState(_ => ({
        playerMessups: _.playerMessups + 1,
        playerAt: 0,
        isPlayerTurn: false,
      }), () => {
        if (this.state.playerMessups < 3) {
          const swUp = (25 * this.state.playerMessups);
          this.state.sound.bad.sweep(-200 + swUp, 10 + swUp);
          if (!this.state.isTimelinePlaying) {
            this.execTimelineInterval(0, this.state.level - 1, false);
          }
        } else {
          // game over
          this.setState({ inProgress: false });
          this.state.sound.bad.sweep(-100, 245);
        }
      });
    }
  }
  render() {
    const isRightButton = this.state.timeline[this.state.playerAt];
    return (
      <div className={css(styles.app)}>
        <div className={css(styles.buttonsFrame)}>
          {this.state.mainButtons.map((v, i) => (
            <MainButton
              key={v.class}
              cornerClass={v.class}
              doHighlight={v.highlight}
              freq={v.freq}
              onClick={() => this.mainButtonOnClick(i)}
              index={i}
              audioContext={() => this.audioContext}
              isRightButton={isRightButton === i || !this.state.inProgress}
              isPlayerTurn={this.state.isPlayerTurn}
            />
          ))}
        </div>
        <ControlPanel
          start={() => this.startGame()}
          isReset={this.state.playerMessups === 3}
          playerMessups={this.state.playerMessups}
          level={this.state.level}
          isPlayerTurn={this.state.isPlayerTurn}
          inProgress={this.state.inProgress}
        />
      </div>
    );
  }
}
export default App;
