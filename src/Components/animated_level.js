import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';
import PropTypes from 'prop-types';

const animations = {
  expandLevel: {
    '0%': {
      transform: 'scale(1) translate(0, 0)',
      background: 'rgba(255,255,255,0.0)',
    },
    '100%': {
      transform: 'scale(2) translate(0, -200%)',
      background: 'rgba(255,255,255,1)',
    },
  },
};
const styles = StyleSheet.create({
  expandLevel: {
    width: '75px',
    padding: '10px',
    height: '30px',
    animationName: animations.expandLevel,
    animationDuration: '1s',
    transform: 'scale(2) translate(0, -200%)',
    background: 'rgba(255,255,255,1)',
  },
});
class LevelDisplay extends Component {
  constructor() {
    super();
    this.state = {
      hasExpanded: false,
    };
  }
  render() {
    const expandLevel = this.props.isReset ? 'expandLevel' : 'backDown';
    // if (expandLevel === 'backDown') { setTimeout}
    return (
      <div className={css(styles.statusSpacer)}>
        <div className={css(styles.statusBar)}>
          <span className={css(styles.statusChild, styles[expandLevel])}>
            {(this.props.inProgress || this.props.isReset) &&
              // level advances before player's turn,
              // also replays outside of players turn before next level as well
              `${this.props.isReset ? 'level ' : ''}
              ${(this.props.level + 1) -
                (this.props.isPlayerTurn + this.props.playerMessups !== 0)}`}
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
};
export default LevelDisplay;
