package Caro

const (
	RES_WAIT  = "wait"
	RES_READY = "ready"
	RES_BOARD = "board"

	SYMBOL_X = "X"
	SYMBOL_O = "O"
)

type Response struct {
	Res      string  `json:"response"`
	Opponent *Player `json:"opponent,omitempty"`
	YourTurn bool    `json:"yourturn"`
	Symbol   string  `json:"symbol,omitempty"`
	Board    *Board  `json:"board,omitempty"`
}

func CreateWaitResponse() Response {
	return Response{
		Res: RES_WAIT,
	}
}

func CreateReadyResopnse(op *Player, b *Board, first bool, symbol string) Response {
	return Response{
		Res:      RES_READY,
		Opponent: op,
		YourTurn: first,
		Symbol:   symbol,
		Board:    b,
	}
}

func CreateBoardResponse(yourTurn bool, b *Board) Response {
	return Response{
		Res:      RES_BOARD,
		YourTurn: yourTurn,
		Board:    b,
	}
}
