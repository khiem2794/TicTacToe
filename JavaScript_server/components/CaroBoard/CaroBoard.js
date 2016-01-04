import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import range from 'helpers/range';
const style = `
table {
  border-collapse: collapse;
}

td {
  border: solid 1px;
  width: 30px;
  padding: 5px;
  text-align: center;
  cursor: pointer;
}

td.lastmove {
  color: #a00;
}
`
@connect(
  state => ({
    socket: state.caro.socket
  }))
export default class CaroBoard extends Component {
  static propTypes = {
    socket: PropTypes.object.isRequired,
    moveMSG: PropTypes.func.isRequired,
    yourturn: PropTypes.bool.isRequired,
    board: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props);
    this.state = {
      numbers: range(0, this.props.board.size-1),
      cells: this.getInitBoard(),
      lastMove: {x: null, y: null}
    }
  }
  getInitBoard = () => {
    const numbers = range(0, this.props.board.size - 1);
    return numbers.map(() => 
      numbers.map(() => ({ char: '' })));
  }
  playAtCell(x, y) {
    if (this.props.yourturn && !this.state.cells[x][y].char){
      let { cells, moves } = this.state;
      this.props.socket.send(JSON.stringify(this.props.moveMSG(x, y)));
      this.setState({ cells, lastMove: {x, y} });
    }
  }
  render() {
  	const { cells } = this.state;
    const lX = this.state.lastMove.x;
    const lY = this.state.lastMove.y;
    console.log(this.props.board);
    if (this.props.board.x) {
      for (let i = 0; i < this.props.board.x.length; i++) {
        const x = this.props.board.x[i].x;
        const y = this.props.board.x[i].y;
        cells[x][y].char = 'X'
      }
    }
    if (this.props.board.o) {
      for (let i = 0; i < this.props.board.o.length; i++) {
        const x = this.props.board.o[i].x;
        const y = this.props.board.o[i].y;
        cells[x][y].char = 'O'
      }
    }
    return (
      <div>
        <style dangerouslySetInnerHTML={{__html: style}}/>
        <table>
          <tbody>
            {
              this.state.numbers.map((row, y) => (
                <tr>
                {
                  this.state.numbers.map((col, x) => (
                    <td
                      className={lX===x && lY===y? 'lastmove': ''}
                      onClick={() => this.playAtCell(x, y)}>
                        {cells[x][y].char || '.'}
                    </td>
                  ))
                }
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    );
  }
}

