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
    user: state.facebookauth.user,
    opponent: state.caro.opponent,
    symbol: state.caro.symbol,
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
  	user: PropTypes.object.isRequired,
  	opponent: PropTypes.object,
  	symbol: PropTypes.string,
  	socket: PropTypes.object,
  	initSocket: PropTypes.func.isRequired,
  }
  componentDidMount() {
  	if (!this.props.socket){
  	  const ws = new window.WebSocket('ws://' + config.apiHost + ':' + config.apiPort + '/ws/caro');
  	  ws.onmessage = (res) => {
  	  	// console.log(JSON.parse(res.data));
  	  	ResponseClient(JSON.parse(res.data), this.props);
  	  }
  	  this.props.initSocket(ws);
  	}
  }
  startPlaying = () => {
  	this.props.socket.send(JSON.stringify(MessageClient.startMSG()));
  }
  render() {
  	const { waiting, playing } = this.props;
  	return (
  		<div>
  			{waiting && <PlayButton startPlaying={this.startPlaying} waiting={true}/> }
  			{!playing && !waiting && <PlayButton startPlaying={this.startPlaying} waiting={false}/> }
  			{playing && !waiting && 
  				<div>
  					<p>Play against {this.props.opponent.name}</p>
  					<p>You: {this.props.symbol}</p>
  					<p>{this.props.opponent.name}: {this.props.opponent.symbol}</p>
  					<CaroBoard moveMSG={MessageClient.moveMSG}/> 
  				</div>
  			}
  		</div>
  	)
  }
}
