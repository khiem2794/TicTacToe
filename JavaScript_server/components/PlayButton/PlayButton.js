import React, {Component} from 'react';

export default class PlayButton extends Component {
  state = {
    ws: null
  };
  sendSS = () => {
    if (this.state.ws) {
      console.log('sending');
      this.state.ws.onmessage = (msg) => console.log(msg);
      this.state.ws.send('hello server');
    } else {
      const socket = new window.WebSocket('ws://localhost:3030/ws/test');
      socket.onopen = console.log('open');
      this.setState({ ws: socket });
    }
  }
  render() {
    return (
  		<div>
  			<button className="btn btn-primary" onClick={this.sendSS}>Play</button>
  		</div>
  	);
  }
}
