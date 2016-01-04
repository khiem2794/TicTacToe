import React, { Component, PropTypes } from 'react';

export default class CaroResult extends Component {
  static propTypes = {
  	win: PropTypes.bool.isRequired,
  	restart: PropTypes.func.isRequired
  }
  render() {
  	const {win, restart} = this.props;
  	return (
  		<div>
  		{win && <div>You win</div>}
  		{!win && <div>You lose</div>}
  		<button onClick={restart} className="btn btn-success">Restart</button>
  		</div>
  	)
  }
}