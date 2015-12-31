import React, {Component, PropTypes} from 'react';
import {PlayButton, CaroBoard} from 'components';
import {connect} from 'react-redux';
import * as caroActions from 'redux/modules/caro';
import config from '../../config';
import * as MessageClient from 'helpers/MessageClient';
import ResponseClient from 'helpers/ResponseClient';

@connect( 
  state => ({
    playing: state.caro.playing,
    waiting: state.caro.waiting,
    fbid: state.facebookauth.user.fbid,
    socket: state.caro.socket,
  })
  ,{...caroActions})

export default class Caro extends Component {
  constructor(props) {
  	super(props);
  }
  static propTypes = {
  	playing: PropTypes.bool.isRequired,
  	waiting: PropTypes.bool.isRequired,
  	fbid: PropTypes.string.isRequired,
  	socket: PropTypes.object,
  	initSocket: PropTypes.func.isRequired,
  }
  componentDidMount() {
  	if (!this.props.socket){
  	  const ws = new window.WebSocket('ws://' + config.apiHost + ':' + config.apiPort + '/ws/caro');
  	  ws.onmessage = (res) => ResponseClient(JSON.parse(res.data), this.props);
  	  this.props.initSocket(ws);
  	}
  }
  startPlaying = () => {
  	this.props.socket.send(JSON.stringify(MessageClient.startMSG(this.props.fbid)));
  }
  render() {
  	const { waiting, playing } = this.props;
  	return (
  		<div>
  			{waiting && <PlayButton startPlaying={this.startPlaying} waiting={true}/> }
  			{!playing && !waiting && <PlayButton startPlaying={this.startPlaying} waiting={false}/> }
  			{playing && !waiting && <CaroBoard /> }
  		</div>
  	)
  }
}
