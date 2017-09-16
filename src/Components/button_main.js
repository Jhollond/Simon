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
  },
  topLeft: {
    zIndex: '1',
    borderRadius: '75% 0 25% 0',
    background: '#02be04',
  },
  topRight: {
    zIndex: '1',
    borderRadius: '0 75% 0 25%',
    background: '#c50b09',
  },
  botLeft: {
    zIndex: '2',
    borderRadius: '0 25% 0 75%',
    background: '#b7ac07',
  },
  botRight: {
    zIndex: '2',
    borderRadius: '25% 0 75% 0',
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
      audio: {},
    };
  }
  componentDidMount() {
    this.mountAudioGenerator();
  }
  mountAudioGenerator() {
    this.setState({ audio: new AudioGenerator(this.props.audioContext()) }, () => {
      this.state.audio.setFrequency(this.props.freq);
    });
  }
  handleClick() {
    if (this.props.isRightButton && this.props.isPlayerTurn) {
      this.state.audio.play(100);
    }
    this.props.onClick();
  }
  animateButton() {
    this.setState({ isPressed: true }, () => {
      setTimeout(() => { this.setState({ isPressed: false }); }, 50);
    });
  }
  render() {
    const cornerClass = styles[this.props.cornerClass];
    const highlightClass = this.props.doHighlight ? styles.highlight : '';
    const toAnimate = this.props.doHighlight ? styles[`${this.props.cornerClass}Down`] : '';
    if (this.props.doHighlight) { this.state.audio.play(100); }
    return (
      <div
        role="button"
        tabIndex={this.props.index + 1}
        onMouseDown={() => this.handleClick()}
        className={css(styles.buttonMain, cornerClass, highlightClass, toAnimate)}
      />
    );
  }
}
MainButton.propTypes = {
  cornerClass: PropTypes.string.isRequired,
  doHighlight: PropTypes.bool.isRequired,
  freq: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  audioContext: PropTypes.func.isRequired,
  isRightButton: PropTypes.bool.isRequired,
  isPlayerTurn: PropTypes.bool.isRequired,
};
export default MainButton;
