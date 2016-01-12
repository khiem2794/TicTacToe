package Caro

import (
	"API_server/domain"
)

type Room struct {
	A        *Player
	B        *Player
	Winner   *Player
	Board    *Board
	Match    *domain.Match
	Complete chan *Room
}

func (this *Room) Start() {
	this.Ready()
}

func (this *Room) Ready() {
	this.A.Symbol = SYMBOL_X
	this.B.Symbol = SYMBOL_O
	this.A.AddResponse(CreateReadyResopnse(this.B, this.Board, true, this.A.Symbol))
	this.B.AddResponse(CreateReadyResopnse(this.A, this.Board, false, this.B.Symbol))
}

func (this *Room) BroadcastMove(player *Player) {
	isATurn := false
	if player != this.A {
		isATurn = true
	}
	if draw := this.Board.IsDraw(); draw {
		this.A.AddResponse(CreateEndResponse(false, this.Board))
		this.B.AddResponse(CreateEndResponse(false, this.Board))
		this.Winner = &Player{}
		this.Complete <- this
		return
	}
	if end := this.Board.IsWin(player.Symbol); end {
		this.A.AddResponse(CreateEndResponse(!isATurn, this.Board))
		this.B.AddResponse(CreateEndResponse(isATurn, this.Board))
		if isATurn {
			this.Winner = this.B
		} else {
			this.Winner = this.A
		}
		this.Complete <- this
		return
	}
	this.A.AddResponse(CreateBoardResponse(isATurn, this.Board))
	this.B.AddResponse(CreateBoardResponse(!isATurn, this.Board))
}
