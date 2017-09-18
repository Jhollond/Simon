import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';
import PropTypes from 'prop-types';
import MainButton from './button_main';
import LevelDisplay from './animated_level';

const animations = {
  matrix: {
    '0%': {
      transform: 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)',
    },
    '100%': {
      transform:
      'matrix3d(1,0,0.00,0,0.00,0.71,0.71,-0.0007,0,-0.71,0.71,0,0,0,0,1)',
    },
  },
};
const styles = StyleSheet.create({
  app: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    margin: '10px',
    textAlign: 'center',
  },
  buttonFrame: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    width: '520px',
    '@media (max-width: 550px)': {
      width: '360px',
    },
    minWidth: '360px',
    animationDuration: '3s',
    animation: animations.matrix,
  },
  matrixHold: {
    transform:
    'matrix3d(1,0,0.00,0,0.00,0.71,0.71,-0.0007,0,-0.71,0.71,0,0,0,0,1)',
  },
  matrixRotate: {
    animationName: animations.matrix,
  },
  matrixReset: {
    animationName: animations.matrix,
    animationDirection: 'reverse',
  },
});

class ButtonFrame extends Component {
  constructor() {
    super();
    this.state = {
      isRotated: false,
      animate: false,
      inProgress: false,
    };
  }
  componentDidUpdate() {
    this.checkInProgress();
  }
  getAnimState() {
    if (this.state.animate) {
      if (this.state.isRotated) {
        return 'matrixReset';
      }
      return 'matrixRotate';
    } else if (this.state.isRotated) {
      return 'matrixHold';
    }
    return '';
  }
  triggerMatrix() {
    if (this.state.isRotated) {
      this.setState({ animate: true }, () => {
        setTimeout(() => this.setState({ animate: false, isRotate: true }));
      }, 3000);
    } else {
      this.setState({ animate: true }, () => {
        setTimeout(() => this.setState({ animate: false, isRotate: false }));
      }, 3000);
    }
  }
  checkInProgress() {
    if (this.props.inProgress !== this.state.inProgress) {
      this.setState({ inProgress: this.props.inProgress }, () => {
        this.triggerMatrix();
      });
    }
  }
  render() {
    const mainButtons = this.props.mainButtons();
    const isRightButton = this.props.isRightButton;
    const animState = this.getAnimState();
    return (
      <div className={css(styles.app)}>
        <div className={css(styles.buttonFrame, styles[animState])}>
          {mainButtons.map((v, i) => (
            <MainButton
              key={v.class}
              cornerClass={v.class}
              isActive={v.isActive}
              freq={v.freq}
              onClick={() => this.props.onClick(i)}
              onMouseUp={() => this.props.onMouseUp(i)}
              audioContext={() => this.props.audioContext()}
              canGo={isRightButton === i && this.props.isPlayerTurn}
              isPlayerTurn={this.props.isPlayerTurn}
            />
          ))}
          <LevelDisplay
            isReset={this.props.isReset}
            playerMessups={this.props.playerMessups}
            level={this.props.level}
            isPlayerTurn={this.props.isPlayerTurn}
            inProgress={this.props.inProgress}
            step={this.props.step}
          />
        </div>
      </div>
    );
  }
}
ButtonFrame.propTypes = {
  mainButtons: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  audioContext: PropTypes.func.isRequired,
  isRightButton: PropTypes.number.isRequired,
  isPlayerTurn: PropTypes.bool.isRequired,
  inProgress: PropTypes.bool.isRequired,
  isReset: PropTypes.bool.isRequired,
  playerMessups: PropTypes.number.isRequired,
  level: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  onMouseUp: PropTypes.func.isRequired,
};
export default ButtonFrame;
