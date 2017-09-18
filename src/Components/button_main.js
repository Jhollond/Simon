import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';
import PropTypes from 'prop-types';
import AudioGenerator from '../Utilities/gen_audio';

const styles = StyleSheet.create({
  buttonMain: {
    opacity: '1.0',
    width: '250px',
    height: '250px',
    background: 'black',
    border: '5px solid white',
    transition: 'transform 0.1s',
    '@media (max-width: 550px)': {
      width: '160px',
      height: '160px',
    },
    ':focus': {
      outline: '0',
    },
  },
  topLeft: {
    zIndex: '1',
    borderRadius: '100% 0 25% 0',
    background: '#02be04',
  },
  topRight: {
    zIndex: '1',
    borderRadius: '0 100% 0 25%',
    background: '#c50b09',
  },
  botLeft: {
    zIndex: '2',
    borderRadius: '0 25% 0 100%',
    background: '#b7ac07',
  },
  botRight: {
    zIndex: '2',
    borderRadius: '25% 0 100% 0',
    background: '#0748bc',
  },
  topLeftDown: {
    background: '#00ff00',
    transform: 'translate3d(1.33px, 10px, 0) scale(0.99)',
  },
  topRightDown: {
    background: '#ff0404',
    transform: 'translate3d(-1.33px, 10px, 0) scale(0.99)',
  },
  botLeftDown: {
    background: '#fff300',
    transform: 'translate3d(1.33px, 10px, 0) scale(0.99)',
  },
  botRightDown: {
    background: '#0064ff',
    transform: 'translate3d(-1.33px, 10px, 0) scale(0.99)',
  },
});
class MainButton extends Component {
  constructor() {
    super();
    this.state = {
      isPressed: false,
      clickFlag: 0,
      audio: {},
    };
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }
  componentWillMount() {
    document.addEventListener('mouseup', this.handleMouseUp, false);
  }
  componentDidMount() {
    this.mountAudioGenerator();
  }
  mountAudioGenerator() {
    this.setState({ audio: new AudioGenerator(this.props.audioContext()) }, () => {
      this.state.audio.setFrequency(this.props.freq);
    });
  }
  handleMouseDown() {
    if (this.props.canGo) {
      this.state.audio.start();
      this.setState({ isPressed: true, clickFlag: performance.now() });
    }
    this.props.onClick();
  }
  handleMouseUp() {
    const deactivate = () => {
      this.props.onMouseUp();
      this.state.audio.stop();
    };
    if (this.state.isPressed) {
      if (performance.now() - this.state.clickFlag > 90) {
        deactivate();
      } else {
        setTimeout(deactivate, 90);
      }
    }
  }
  render() {
    const cornerClass = styles[this.props.cornerClass];
    const highlightClass = this.props.isActive ? styles.isActive : '';
    const toAnimate = this.props.isActive ? styles[`${this.props.cornerClass}Down`] : '';
    if (this.props.isActive === 2) { this.state.audio.play(100); }
    return (
      <div
        ref={(e) => { this.btnRef = e; }}
        role="button"
        tabIndex={this.props.cornerClass}
        onMouseDown={() => this.handleMouseDown()}
        className={css(styles.buttonMain, cornerClass, highlightClass, toAnimate)}
      />
    );
  }
}
MainButton.propTypes = {
  cornerClass: PropTypes.string.isRequired,
  isActive: PropTypes.number.isRequired,
  freq: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  audioContext: PropTypes.func.isRequired,
  canGo: PropTypes.bool.isRequired,
  onMouseUp: PropTypes.func.isRequired,
};
export default MainButton;
