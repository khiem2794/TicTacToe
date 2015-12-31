import React, {Component, PropTypes} from 'react';

export default class PlayButton extends Component {
  constructor(props) {
    super(props);
  }
  static propTypes = {
    startPlaying: PropTypes.func.isRequired,
    waiting: PropTypes.bool,
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
