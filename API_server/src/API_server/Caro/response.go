package Caro

const (
	RES_WAIT  = "wait"
	RES_READY = "ready"
	RES_BOARD = "board"
)

type Response struct {
	Res string `json:"response"`
}

func CreateWaitResponse() Response {
	return Response{
		Res: RES_WAIT,
	}
}
