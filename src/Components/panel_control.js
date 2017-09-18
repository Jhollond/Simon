import React, { Component } from 'react';
import { StyleSheet, css } from 'aphrodite';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  main: {
    width: '25%',
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
    ':focus': {
      outline: '0',
    },
  },
  easy: {
    color: '#0f80ff',
    border: '2px solid #0f80ff',
  },
  medium: {
    color: '#fc0107',
    border: '2px solid #fc0107',
  },
  hard: {
    color: '#800002',
    border: '2px solid #800002',
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
  handleStart(difficulty) {
    this.props.start(difficulty);
  }
  render() {
    const isReset = this.props.isReset;
    const showReset = isReset || this.props.inProgress ? 'reset' : 'medium';
    return (
      <div className={css(styles.spacer)}>
        <span className={css(styles.statusSpacer)}>
          <span className={css(styles.statusBar)}>
            { (!this.props.inProgress && !isReset) &&
              <span
                className={css(styles.main, styles.easy)}
                onClick={() => this.handleStart('easy')}
                role="button"
                tabIndex="0"
              >
                Normal
              </span>
            }
            <span
              className={css(styles.main, styles[(showReset)])}
              onClick={() => this.handleStart(showReset)}
              role="button"
              tabIndex="0"
            >
              {showReset === 'reset' ? 'Reset' : 'Strict'}
            </span>
            { (!this.props.inProgress && !isReset) &&
              <span
                className={css(styles.main, styles.hard)}
                onClick={() => this.handleStart('hard')}
                role="button"
                tabIndex="0"
              >
                Impossible
              </span>
            }
          </span>
        </span>
      </div>
    );
  }
}
ControlPanel.propTypes = {
  start: PropTypes.func.isRequired,
  isReset: PropTypes.bool.isRequired,
  playerMessups: PropTypes.number.isRequired,
  inProgress: PropTypes.bool.isRequired,
};
export default ControlPanel;
