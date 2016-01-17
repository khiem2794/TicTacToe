import React, { Component, PropTypes } from 'react';
import RaisedButton from 'material-ui/lib/raised-button';

export default class CaroResult extends Component {
  static propTypes = {
    win: PropTypes.bool.isRequired,
    restart: PropTypes.func.isRequired
  }
  render() {
    const {win, restart} = this.props;
    return (
  		<div>
        <h3>
          <p>
        		{win && <div>You win</div>}
        		{!win && <div>You lose</div>}
          </p>
      		<RaisedButton onClick={restart} primary={true} label="END GAME"></RaisedButton>
        </h3>
  		</div>
    );
  }
}
