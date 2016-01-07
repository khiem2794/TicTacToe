import React, {Component, PropTypes} from 'react';

export default class PlayButton extends Component {
  static propTypes = {
    startPlaying: PropTypes.func.isRequired,
    waiting: PropTypes.bool,
  }
  constructor(props) {
    super(props);
  }
  render() {
    return (
  		<div>
  			{!this.props.waiting && <button className="btn btn-primary" onClick={this.props.startPlaying}>Play</button>}
        {this.props.waiting && <button className="btn btn-warning" >Waiting</button>}
  		</div>
  	);
  }
}
