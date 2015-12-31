package Caro

type Symbol struct {
}
type Board struct {
	A    []Cell
	B    []Cell
	Turn int
}

type Cell struct {
	X int `json:"x"`
	Y int `json:"y"`
}
