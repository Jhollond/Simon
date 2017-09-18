import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';
import PropTypes from 'prop-types';

const animations = {
  expandLevel: {
    '0%': {
      transform: 'translate(0, 0)',
      background: 'rgba(255,255,255,0.0)',
    },
    '100%': {
      transform: 'translate(0, -200px)',
      background: 'rgba(255,255,255,1)',
    },
  },
  fadeOut: {
    '0%': {
      opacity: '1.0',
    },
    '100%': {
      opacity: '0.0',
    },
  },
};
const styles = StyleSheet.create({
  spacer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  main: {
    zIndex: '3',
    // width: '100%',
    maxWidth: '400px',
    transform: 'translate(0, -265px)',
    fontSize: '40px',
    height: '100px',
    width: '100px',
    borderRadius: '100%',
    '@media (max-width: 550px)': {
      transform: 'translate(0, -169px)',
      fontSize: '30px',
    },
  },
  expandLevel: {
    width: '75px',
    padding: '10px',
    height: '30px',
    animationDuration: '1s',
    background: 'rgba(255,255,255,1)',
    animationName: animations.expandLevel,
  },
  fadeOut: {
    background: 'rgba(255,255,255,1)',
    animationName: animations.fadeOut,
  },
});
class LevelDisplay extends Component {
  constructor() {
    super();
    this.state = {
      animate: false,
      fadeOut: false,
      keepLevel: false,
    };
  }
  componentDidUpdate() {
    this.onUpdate();
  }
  onUpdate() {
    setTimeout(() => {
      if (this.props.isReset === true && this.state.animate === false) {
        this.setState({ animate: true, keepLevel: this.props.level });
      }
      if (this.props.isReset === false && this.state.animate === true) {
        this.setState({ fadeOut: true });
        setTimeout(() => this.setState({ animate: false, fadeOut: false }), 990);
      }
    }, 1);
  }
  render() {
    const expand = this.state.animate ? 'expandLevel' : '';
    const fadeOut = this.state.fadeOut ? 'fadeOut' : '';
    // if (expandLevel === 'backDown') { setTimeout}
    const actualLevel = (this.props.level + 1) -
    (this.props.step *
    (this.props.isPlayerTurn + this.props.playerMessups !== 0));
    return (
      <div className={css(styles.spacer)}>
        <div className={css(styles.main)}>
          <span className={css(styles[expand], styles[fadeOut])}>
            {(this.props.inProgress || expand) &&
              // level advances before player's turn,
              // also replays outside of players turn before next level as well
              `${expand ? 'level ' : ''}${expand ? this.state.keepLevel : actualLevel}`}
          </span>
        </div>
      </div>
    );
  }
}
LevelDisplay.propTypes = {
  isReset: PropTypes.bool.isRequired,
  playerMessups: PropTypes.number.isRequired,
  level: PropTypes.number.isRequired,
  isPlayerTurn: PropTypes.bool.isRequired,
  inProgress: PropTypes.bool.isRequired,
  step: PropTypes.number.isRequired,
};
export default LevelDisplay;
