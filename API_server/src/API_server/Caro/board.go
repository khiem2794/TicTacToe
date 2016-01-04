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

func Contains(s []Cell, c Cell) bool {
	for _, v := range s {
		if c == v {
			return true
		}
	}
	return false
}

func Have5Cells(s []Cell, cells [5]Cell) bool {
	for _, c := range cells {
		if !Contains(s, c) {
			return false
		}
	}
	return true
}

func HaveRow(s []Cell, c Cell) bool {
	if Have5Cells(s, [5]Cell{c, Cell{c.X - 4, c.Y}, Cell{c.X - 3, c.Y}, Cell{c.X - 2, c.Y}, Cell{c.X - 1, c.Y}}) || Have5Cells(s, [5]Cell{c, Cell{c.X - 3, c.Y}, Cell{c.X - 2, c.Y}, Cell{c.X - 1, c.Y}, Cell{c.X + 1, c.Y}}) || Have5Cells(s, [5]Cell{c, Cell{c.X - 2, c.Y}, Cell{c.X - 1, c.Y}, Cell{c.X + 1, c.Y}, Cell{c.X + 2, c.Y}}) || Have5Cells(s, [5]Cell{c, Cell{c.X - 1, c.Y}, Cell{c.X + 1, c.Y}, Cell{c.X + 2, c.Y}, Cell{c.X + 3, c.Y}}) || Have5Cells(s, [5]Cell{c, Cell{c.X + 1, c.Y}, Cell{c.X + 2, c.Y}, Cell{c.X + 3, c.Y}, Cell{c.X + 4, c.Y}}) {
		return true
	}
	return false
}

func HaveCol(s []Cell, c Cell) bool {
	if Have5Cells(s, [5]Cell{c, Cell{c.X, c.Y - 4}, Cell{c.X, c.Y - 3}, Cell{c.X, c.Y - 2}, Cell{c.X, c.Y - 1}}) || Have5Cells(s, [5]Cell{c, Cell{c.X, c.Y - 3}, Cell{c.X, c.Y - 2}, Cell{c.X, c.Y - 1}, Cell{c.X, c.Y + 1}}) || Have5Cells(s, [5]Cell{c, Cell{c.X, c.Y - 2}, Cell{c.X, c.Y - 1}, Cell{c.X, c.Y + 1}, Cell{c.X, c.Y + 2}}) || Have5Cells(s, [5]Cell{c, Cell{c.X, c.Y - 1}, Cell{c.X, c.Y + 1}, Cell{c.X, c.Y + 2}, Cell{c.X, c.Y + 3}}) || Have5Cells(s, [5]Cell{c, Cell{c.X, c.Y + 1}, Cell{c.X, c.Y + 2}, Cell{c.X, c.Y + 3}, Cell{c.X, c.Y + 4}}) {
		return true
	}
	return false
}

func HaveCross(s []Cell, c Cell) bool {
	if Have5Cells(s, [5]Cell{c, Cell{c.X - 4, c.Y - 4}, Cell{c.X - 3, c.Y - 3}, Cell{c.X - 2, c.Y - 2}, Cell{c.X - 1, c.Y - 1}}) || Have5Cells(s, [5]Cell{c, Cell{c.X - 3, c.Y - 3}, Cell{c.X - 2, c.Y - 2}, Cell{c.X - 1, c.Y - 1}, Cell{c.X + 1, c.Y + 1}}) || Have5Cells(s, [5]Cell{c, Cell{c.X - 2, c.Y - 2}, Cell{c.X - 1, c.Y - 1}, Cell{c.X + 1, c.Y + 1}, Cell{c.X + 2, c.Y + 2}}) || Have5Cells(s, [5]Cell{c, Cell{c.X - 1, c.Y - 1}, Cell{c.X + 1, c.Y + 1}, Cell{c.X + 2, c.Y + 2}, Cell{c.X + 3, c.Y + 3}}) || Have5Cells(s, [5]Cell{c, Cell{c.X + 1, c.Y + 1}, Cell{c.X + 2, c.Y + 2}, Cell{c.X + 3, c.Y + 3}, Cell{c.X + 4, c.Y + 4}}) || Have5Cells(s, [5]Cell{c, Cell{c.X - 4, c.Y + 4}, Cell{c.X - 3, c.Y + 3}, Cell{c.X - 2, c.Y + 2}, Cell{c.X - 1, c.Y + 1}}) || Have5Cells(s, [5]Cell{c, Cell{c.X - 3, c.Y + 3}, Cell{c.X - 2, c.Y + 2}, Cell{c.X - 1, c.Y + 1}, Cell{c.X + 1, c.Y - 1}}) || Have5Cells(s, [5]Cell{c, Cell{c.X - 2, c.Y + 2}, Cell{c.X - 1, c.Y + 1}, Cell{c.X + 1, c.Y - 1}, Cell{c.X + 2, c.Y - 2}}) || Have5Cells(s, [5]Cell{c, Cell{c.X - 1, c.Y + 1}, Cell{c.X + 1, c.Y - 1}, Cell{c.X + 2, c.Y - 2}, Cell{c.X + 3, c.Y - 3}}) || Have5Cells(s, [5]Cell{c, Cell{c.X + 1, c.Y - 1}, Cell{c.X + 2, c.Y - 2}, Cell{c.X + 3, c.Y - 3}, Cell{c.X + 4, c.Y - 4}}) {
		return true
	}
	return false
}

func (this *Board) CheckWin(symbol string) bool {
	if symbol == SYMBOL_O {
		lastMove := this.O[len(this.O)-1]
		if HaveRow(this.O, lastMove) || HaveCol(this.O, lastMove) || HaveCross(this.O, lastMove) {
			return true
		}
	}
	if symbol == SYMBOL_X {
		lastMove := this.X[len(this.X)-1]
		if HaveRow(this.X, lastMove) || HaveCol(this.X, lastMove) || HaveCross(this.X, lastMove) {
			return true
		}
	}
	return false
}
