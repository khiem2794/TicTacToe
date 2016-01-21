import React, {Component, PropTypes} from 'react';
import RaisedButton from 'material-ui/lib/raised-button';

export default class PlayButton extends Component {
  static propTypes = {
    reset: PropTypes.func.isRequired,
    startPlaying: PropTypes.func.isRequired,
    waiting: PropTypes.bool
  }
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
    		<div style={{ paddingTop: 25 }} className="col-lg-3 col-lg-offset-2 col-md-3 col-md-offset-2">
    			{!this.props.waiting && <RaisedButton primary={true} label="Play Rank" onClick={this.props.startPlaying} backgroundColor='green' fullWidth={true}></RaisedButton> }
          {this.props.waiting && <RaisedButton primary={true} label="Waiting..." onClick={this.props.reset} backgroundColor='orange' fullWidth={true}></RaisedButton> }
    		</div>
        <div style={{ paddingTop: 25 }} className="col-lg-3 col-lg-offset-2 col-md-3 col-md-offset-2">
    			{!this.props.waiting && <RaisedButton primary={true} label="Play vs BOT" backgroundColor='green' fullWidth={true}></RaisedButton> }
    		</div>
      </div>
  	);
  }
}
