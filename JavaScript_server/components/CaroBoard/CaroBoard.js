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
`;
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
      numbers: range(0, this.props.board.size - 1),
      cells: this.getInitBoard(),
      lastMove: {x: null, y: null}
    };
  }
  getInitBoard = () => {
    const numbers = range(0, this.props.board.size - 1);
    return numbers.map(() =>
      numbers.map(() => ({ char: '' })));
  }
  playAtCell(px, py) {
    if (this.props.yourturn && !this.state.cells[px][py].char) {
      const { cells } = this.state;
      this.props.socket.send(JSON.stringify(this.props.moveMSG(px, py)));
      this.setState({ cells, lastMove: {px, py} });
    }
  }
  render() {
    const { cells } = this.state;
    const lX = this.state.lastMove.x;
    const lY = this.state.lastMove.y;
    console.log(this.props.board);
    if (this.props.board.x) {
      for (let count = 0; count < this.props.board.x.length; count++) {
        const px = this.props.board.x[count].x;
        const py = this.props.board.x[count].y;
        cells[px][py].char = 'X';
      }
    }
    if (this.props.board.o) {
      for (let count = 0; count < this.props.board.o.length; count++) {
        const px = this.props.board.o[count].x;
        const py = this.props.board.o[count].y;
        cells[px][py].char = 'O';
      }
    }
    return (
      <div>
        <style dangerouslySetInnerHTML={{__html: style}}/>
        <table>
          <tbody>
            {
              this.state.numbers.map((row, py) => (
                <tr>
                {
                  this.state.numbers.map((col, px) => (
                    <td
                      className={lX === px && lY === py ? 'lastmove' : ''}
                      onClick={() => this.playAtCell(px, py)}>
                        {cells[px][py].char || '.'}
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

