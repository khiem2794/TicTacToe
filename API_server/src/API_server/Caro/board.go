package Caro

const (
	BOARD_SIZE = 9
)

type Board struct {
	X    []Cell `json:"x"`
	O    []Cell `json:"o"`
	Turn int    `json:"turn"`
	Size int    `json:"size"`
}

type Cell struct {
	X int `json:"x"`
	Y int `json:"y"`
}

func CreateBoard(x, o []Cell, t int) *Board {
	return &Board{
		X:    x,
		O:    o,
		Turn: t,
		Size: BOARD_SIZE,
	}
}

func (this *Board) Move(symbol string, pos Cell) {
	this.Turn++
	if symbol == SYMBOL_X {
		this.X = append(this.X, pos)
	}
	if symbol == SYMBOL_O {
		this.O = append(this.O, pos)
	}
}
