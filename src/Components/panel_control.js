import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';
import PropTypes from 'prop-types';
import LevelDisplay from './animated_level';

const styles = StyleSheet.create({
  main: {
    width: '25%',
    display: 'absolute',
    fontWeight: 'bold',
    borderRadius: '8px',
    padding: '7px',
    cursor: 'pointer',
    transition: 'box-shadow 0.1s transform 0.1',
    ':hover': {
      boxShadow: '0 2px 2px 1px #eee',
    },
    ':active': {

      boxShadow: '0 4px 4px 1px #ddd',
    },
  },
  start: {
    color: '#56d72b',
    border: '2px solid #56d72b',
  },
  easy: {
    color: '#fdf200',
    border: '2px solid #fdf200',
  },
  hard: {
    color: '#fc0107',
    border: '2px solid #fc0107',
  },
  reset: {
    color: '#fc2125',
    border: '2px solid #fc2125',
  },
  spacer: {
    width: '100%',
    padding: '7px',
    '.span': {
      cursor: 'pointer',
    },
  },
  statusSpacer: {
    width: '100%',
    height: '50px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBar: {
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    justifyContent: 'space-around',
  },
  statusChild: {
    width: '25%',
  },

  wrong: {
    color: '#fc2125',
  },
  clear: {
    color: '#e3e3e3',
  },
});

class ControlPanel extends Component {
  contructor() {
    this.state = {
      showAll: true,
    };
  }
  messUpIconSet() {
    const keys = ['one', 'two', 'three'];
    const amount = this.props.playerMessups;
    if (amount === 0) {
      return false;
    }
    return Array(3).fill(amount).map((v, i) => (
      <span
        key={keys[i]}
        className={css(styles[(v > i ? 'wrong' : 'clear')])}
      >
        X
      </span>
    ));
  }
  animateOut() {
    this.setState({  })
    setTimeout(() => { this.setState({ showAll: false }); }, 200);
  }
  handleStart(difficulty) {
    this.props.start(difficulty);
  }
  render() {
    const isReset = this.props.isReset;
    return (
      <div className={css(styles.spacer)}>
        <LevelDisplay
          isReset={this.props.isReset}
          playerMessups={this.props.playerMessups}
          level={this.props.level}
          isPlayerTurn={this.props.isPlayerTurn}
          inProgress={this.props.inProgress}
        />
        { !this.props.inProgress &&
          <span className={css(styles.statusSpacer)}>
            <span className={css(styles.statusBar)}>
              { !isReset &&
                <span
                  className={css(styles.main, styles.easy)}
                  onClick={() => this.handleStart(0)}
                  role="button"
                  tabIndex="0"
                >
                  Easy
                </span> }
              <span
                className={css(styles.main, styles[(!isReset ? 'start' : 'reset')])}
                onClick={() => this.handleStart(1)}
                role="button"
                tabIndex="0"
              >
                {isReset ? 'Reset' : 'Medium'}
              </span>
              { !isReset &&
                <span
                  className={css(styles.main, styles.hard)}
                  onClick={() => this.handleStart(2)}
                  role="button"
                  tabIndex="0"
                >
                  Hard
                </span> }
            </span>
          </span> }
      </div>
    );
  }
}
ControlPanel.propTypes = {
  start: PropTypes.func.isRequired,
  isReset: PropTypes.bool.isRequired,
  playerMessups: PropTypes.number.isRequired,
  level: PropTypes.number.isRequired,
  isPlayerTurn: PropTypes.bool.isRequired,
  inProgress: PropTypes.bool.isRequired,
};
export default ControlPanel;
