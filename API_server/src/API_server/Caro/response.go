package Caro

type ResponseType string

const (
	RES_WAIT  = ResponseType("wait")
	RES_READY = ResponseType("ready")
	RES_BOARD = ResponseType("board")
	RES_ERROR = ResponseType("error")
	RES_END   = ResponseType("end")

	SYMBOL_X = "X"
	SYMBOL_O = "O"
)

type Response struct {
	Res      ResponseType `json:"response"`
	Opponent *Player      `json:"opponent,omitempty"`
	YourTurn bool         `json:"yourturn"`
	Symbol   string       `json:"symbol,omitempty"`
	Board    *Board       `json:"board,omitempty"`
	Result   string       `json:"result,omitempty"`
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

func CreateEndResponse(win bool, b *Board) Response {
	if win {
		return Response{
			Res:    RES_END,
			Result: "win",
			Board:  b,
		}
	}
	return Response{
		Res:    RES_END,
		Result: "lost",
		Board:  b,
	}
}

func CreateErrorResponse() Response {
	return Response{
		Res: RES_ERROR,
	}
}
