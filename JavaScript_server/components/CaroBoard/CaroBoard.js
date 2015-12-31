import React, {Component} from 'react';

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

const numbers = [0,1,2,3,4,5,6,7,8,9];

export default class CaroBoard extends Component {
  constructor() {
    super();
    this.state = {
      cells: this.getInitBoard(),
      currentPlayer: 'X',
      lastMove: {x: null, y: null},
      moves:[]
    }
  }
  getInitBoard() {
    return numbers.map(() => 
      numbers.map(() => ({ char: '' })));
  }
  playAtCell(x, y) {
    let { cells, currentPlayer,moves} = this.state;
    if (cells[x][y].char) return;
    cells[x][y].char = currentPlayer;
    moves.push({x,y});
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    this.setState({ cells, currentPlayer, lastMove: {x, y}, moves });
  }
  resetBoard() {
    this.setState({
      cells: this.getInitBoard(),
      currentPlayer: 'X'
    });
  }
  render() {
  	const { cells } = this.state;
    const lX = this.state.lastMove.x;
    const lY = this.state.lastMove.y;
    return (
      <div>
        <style dangerouslySetInnerHTML={{__html: style}}/>
        <div>Current player: {this.state.currentPlayer}</div>
        <table>
          <tbody>
            {
              numbers.map((row, y) => (
                <tr>
                {
                  numbers.map((col, x) => (
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

