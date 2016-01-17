import React, {Component, PropTypes} from 'react';
import {PlayButton, CaroBoard, CaroResult} from 'components';
import {connect} from 'react-redux';
import * as caroActions from 'redux/modules/caro';
import config from '../../config';
import * as MessageClient from 'helpers/MessageClient';
import responseClient from 'helpers/ResponseClient';

import Paper from 'material-ui/lib/paper';
import Avatar from 'material-ui/lib/avatar';

const style = {
  left: {
    textAlign: 'center',
  },
  right: {
    textAlign: 'center',
  },
  boardContainer: {
    textAlign: 'center',
  }
};

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
    reset: PropTypes.func.isRequired
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
    if (!this.props.socket) {
      const ws = new window.WebSocket('ws://' + config.apiHost + ':' + config.apiPort + '/ws/caro');
      ws.onmessage = (res) => {
  	  	// console.log(JSON.parse(res.data));
        responseClient(JSON.parse(res.data), this.props);
      };
      this.props.initSocket(ws);
    }
    this.props.socket.send(JSON.stringify(MessageClient.startMSG()));
  }
  resetSocket() {
    this.props.socket.close();
    this.props.reset();
    const ws = new window.WebSocket('ws://' + config.apiHost + ':' + config.apiPort + '/ws/caro');
    ws.onmessage = (res) => {
      // console.log(JSON.parse(res.data));
      responseClient(JSON.parse(res.data), this.props);
    };
    this.props.initSocket(ws);
  }
  render() {
    const { waiting, playing, result, win, restart, yourturn, board } = this.props;
    return (
  		<div>
        <Paper zDepth={3} className="row" style={{ textAlign: 'center', marginBottom: 50, paddingBottom: 50 }}>
    			{waiting && <PlayButton reset={() => this.resetSocket() } startPlaying={this.startPlaying} waiting={waiting}/> }
    			{!playing && !waiting && <PlayButton reset={() => this.resetSocket() } startPlaying={this.startPlaying} waiting={false} /> }
    			{playing && !waiting &&
    				<div style={{ paddingTop: 25 }}>
              <div style={style.left} className="col-lg-2 col-md-2 col-sm-12">
                <Avatar size={80} src={`https://graph.facebook.com/${this.props.user.fbid}/picture?type=large`} />
                <h3>{this.props.user.name}</h3>
                <h3>{this.props.symbol}</h3>
              </div>
    					<div style={style.boardContainer} className="col-lg-8 col-md-8 col-sm-12">
                <div>
                  {result ? <CaroResult win={win} restart={restart} />
                          : <div>
                              <h2>{yourturn ? 'Your turn' : this.props.opponent.name + "'s turn"}</h2>
                              <h3>Turn {board.turn}</h3>
                            </div>}
                </div>
                <CaroBoard moveMSG={MessageClient.moveMSG} board={board} yourturn={yourturn}/>
              </div>
              <div style={style.right} className="col-lg-2 col-md-2 col-sm-12">
                <Avatar size={80} src={`https://graph.facebook.com/${this.props.opponent.fbid}/picture?type=large`} />
                <h3>{this.props.opponent.name}</h3>
                <h3>{this.props.opponent.symbol}</h3>
              </div>
            </div>
    			}
        </Paper>
  		</div>
  	);
  }
}
