package Caro

type Room struct {
	A     *Player
	B     *Player
	Board *Board
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
	this.A.AddResponse(CreateBoardResponse(isATurn, this.Board))
	this.B.AddResponse(CreateBoardResponse(!isATurn, this.Board))
}
