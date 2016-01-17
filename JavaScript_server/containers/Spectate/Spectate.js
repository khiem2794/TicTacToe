import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import connectData from 'helpers/connectData';
import * as spectateActions from 'redux/modules/spectate';
import config from '../../config';
import range from 'helpers/range';

import Avatar from 'material-ui/lib/avatar';
import Paper from 'material-ui/lib/paper';
import RaisedButton from 'material-ui/lib/raised-button';
import AppBar from 'material-ui/lib/app-bar';

const style = {
  cell: {
    height: 40,
    width: 40,
    backgroundColor: 'black',
    margin: 1,
    rounded: false,
    display: 'table',
    textAlign: 'center'
  },
  symbol: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 'x-large',
    display: 'table-cell',
    verticalAlign: 'middle'
  },
  container: {
  },
  left: {
    textAlign: 'center',
    paddingTop: 100
  },
  right: {
    textAlign: 'center',
    paddingTop: 100
  },
  boardContainer: {
    textAlign: 'center',
    marginBottom: 25
  }
};
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
    roomid: state.spectate.roomid,
    board: state.spectate.board,
    finish: state.spectate.finish,
    player: state.spectate.player
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
    closeSpectate: PropTypes.func.isRequired,
    roomid: PropTypes.string,
    board: PropTypes.object,
    finish: PropTypes.bool,
    player: PropTypes.array
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
  handleCloseSpectate() {
    this.props.closeSpectate();
    this.props.getMatch();
  }
  render() {
    const { spectating, matches, board, player, finish } = this.props;
    const spectateStyle = require('./Spectate.scss');
    if (spectating && board) {
      const cells =  range(0, board.size - 1).map(() =>  range(0, board.size - 1).map(() => ({ char: '' })));
      if (board.x) {
        for (let count = 0; count < board.x.length; count++) {
          const px = board.x[count].x;
          const py = board.x[count].y;
          cells[px][py].char = 'X';
        }
      }
      if (board.o) {
        for (let count = 0; count < board.o.length; count++) {
          const px = board.o[count].x;
          const py = board.o[count].y;
          cells[px][py].char = 'O';
        }
      }
      return (
    		<div>
    			<Paper className="row" zDepth={3} style={{ textAlign: 'center' }}>
            <div>
              <div style={style.container}>
                <div style={style.left} className="col-lg-2 col-md-2 col-sm-12 col-xs-12">
                  <Avatar size={80} src={`https://graph.facebook.com/${player[0].id}/picture?type=large`} />
                  <h3>{player[0].name}</h3>
                  <h3>{player[0].symbol}</h3>
                </div>
      					<div style={style.boardContainer} className="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                    {finish ? <div>
                        <h3>
                          {player[0].win && <p>{player[0].name + ' WIN'}</p>}
                          {player[1].win && <p>{player[0].name + ' WIN'}</p>}
                          {!player[0].win && !player[1].win && <p>{'DRAW'}</p>}
                        </h3>
                      </div>
                            : <div>
                                <h2>{player[0].isturn ? player[0].name + "'s turn" : player[1].name + "'s turn"}</h2>
                                <h3>Turn {board.turn}</h3>
                              </div>}
                <p><RaisedButton onClick={ () => this.handleCloseSpectate() }  primary={true} label="End Spectating"></RaisedButton></p>
                <div className="col-lg-offset-1" style={style.boardContainer}>
                  <table>
                    <tbody>
                      {
                        range(0, board.size - 1).map((row, py) => (
                          <tr>
                          {
                            range(0, board.size - 1).map((col, px) => (
                              <td>
                                  <Paper style={style.cell} zDepth={1}><span style={style.symbol}>{cells[px][py].char}</span></Paper>
                              </td>
                            ))
                          }
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
                </div>
                <div style={style.right} className="col-lg-2 col-md-2 col-sm-12 col-xs-12">
                  <Avatar size={80} src={`https://graph.facebook.com/${player[1].id}/picture?type=large`} />
                  <h3>{player[1].name}</h3>
                  <h3>{player[1].symbol}</h3>
                </div>
              </div>
            </div>
    			</Paper>
    		</div>
    	);
    } else return (
  		<div>
  			<Paper className="row" zDepth={3} style={{ textAlign: 'center', marginBottom: 50, paddingBottom: 50 }}>
          <AppBar
           title="SPECTATE PAGE"
           titleStyle={{ textAlign: 'left'}}/>
           <div>
             {matches && spectating === false && <div>
               {matches.map( (m) => <div className="col-lg-3 col-md-3 col-sm-4 col-xs-6" style={{ textAlign : 'center' }}>
                    <Paper onClick={() => this.handleStartSpectate(m.id)} zDepth={1} className={spectateStyle.match}>
                      <h4>{m.player[0].name}</h4>
                      VS
                      <h4>{m.player[1].name}</h4>
                    </Paper>
                 </div> )}
               </div>}
          </div>
  			</Paper>
  		</div>
  	);
  }
}
