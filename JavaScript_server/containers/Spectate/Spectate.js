import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import connectData from 'helpers/connectData';
import * as spectateActions from 'redux/modules/spectate';
import config from '../../config';

import Paper from 'material-ui/lib/paper';
import RaisedButton from 'material-ui/lib/raised-button';

function fetchData(getState, dispatch) {
  const promises = [];
  promises.push(dispatch(spectateActions.getMatch()));
  return Promise.all(promises);
}

@connectData(fetchData)
@connect(
  state => ({
    socket: state.spectate.socket,
    matches: state.spectate.matches,
    spectating: state.spectate.spectating,
    board: state.spectate.board
  })
  ,{...spectateActions})
export default class Spectate extends Component {
  static propTypes = {
    socket: PropTypes.object,
    matches: PropTypes.array,
    spectating: PropTypes.bool.isRequired,
    initSocket: PropTypes.func.isRequired,
    responseHandle: PropTypes.func.isRequired,
    startSpectate: PropTypes.func.isRequired,
    board: PropTypes.object
  }
  componentDidMount() {
    if (!this.props.socket) {
      const ws = new window.WebSocket('ws://' + config.apiHost + ':' + config.apiPort + '/ws/spectate');
      ws.onmessage = (res) => {
        console.log('spectate', JSON.parse(res.data));
        this.props.responseHandle(JSON.parse(res.data));
      };
      this.props.initSocket(ws);
    }
  }
  handleStartSpectate(id) {
    this.props.startSpectate();
    this.props.socket.send(JSON.stringify({roomid: id}));
  }
  render() {
    const { spectating, matches } = this.props;
    return (
  		<div>
  			<Paper zDepth={3} style={{ textAlign: 'center' }}>
  			   <p>SPECTATE PAGE</p>
           {matches && spectating === false && <div>
             {matches.map( (m) => <div><RaisedButton onClick={() => this.handleStartSpectate(m.id)} primary={true} label={m.player[0].name + ' vs ' + m.player[1].name} /></div> )}
             </div>}
           {spectating === true && <div>START SPECTATE</div>}
  			</Paper>
  		</div>
  	);
  }
}
