import React, {Component, PropTypes} from 'react';
import {PlayButton, CaroBoard, CaroResult} from 'components';
import {connect} from 'react-redux';
import * as caroActions from 'redux/modules/caro';
import config from '../../config';
import * as MessageClient from 'helpers/MessageClient';
import responseClient from 'helpers/ResponseClient';

import Paper from 'material-ui/lib/paper';

@connect(
  state => ({
    playing: state.caro.playing,
    waiting: state.caro.waiting,
    user: state.facebookauth.user,
    opponent: state.caro.opponent,
    symbol: state.caro.symbol,
    result: state.caro.result,
    win: state.caro.win,
    board: state.caro.board,
    yourturn: state.caro.yourturn,
    socket: state.caro.socket,
  })
  , {...caroActions})

export default class Caro extends Component {
  static propTypes = {
    playing: PropTypes.bool.isRequired,
    waiting: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired,
    opponent: PropTypes.object,
    symbol: PropTypes.string,
    socket: PropTypes.object,
    result: PropTypes.bool.isRequired,
    board: PropTypes.object,
    yourturn: PropTypes.bool,
    win: PropTypes.bool,
    restart: PropTypes.func.isRequired,
    initSocket: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    if (!this.props.socket) {
      const ws = new window.WebSocket('ws://' + config.apiHost + ':' + config.apiPort + '/ws/caro');
      ws.onmessage = (res) => {
  	  	// console.log(JSON.parse(res.data));
        responseClient(JSON.parse(res.data), this.props);
      };
      this.props.initSocket(ws);
    }
  }
  startPlaying = () => {
    this.props.socket.send(JSON.stringify(MessageClient.startMSG()));
  }
  render() {
    const { waiting, playing, result, win, restart, yourturn, board } = this.props;
    return (
  		<div>
        <Paper zDepth={3} style={{ textAlign: 'center' }}>
    			{waiting && <PlayButton startPlaying={this.startPlaying} waiting={waiting}/> }
    			{!playing && !waiting && <PlayButton startPlaying={this.startPlaying} waiting={false}/> }
    			{playing && !waiting &&
    				<div>
              {result ? <CaroResult win={win} restart={restart}/>
                      : <div>
                          <p>Play against {this.props.opponent.name}</p>
                          <p>You: {this.props.symbol}</p>
                          <p>{this.props.opponent.name}: {this.props.opponent.symbol}</p>
                          <div>{yourturn ? 'Your turn' : this.props.opponent.name + "'s turn"}<br /> Turn: {board.turn}</div>
                        </div>}
    					<CaroBoard moveMSG={MessageClient.moveMSG} board={board} yourturn={yourturn}/>
    				</div>
    			}
        </Paper>
  		</div>
  	);
  }
}
