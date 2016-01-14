package Caro

import (
	"API_server/domain"
	"encoding/json"
	"sync"

	"github.com/gorilla/websocket"
)

type Room struct {
	Id        string
	A         *Player
	B         *Player
	Winner    *Player
	Board     *Board
	Match     *domain.Match
	Complete  chan *Room
	Subcriber map[*websocket.Conn]bool
	Lock      *sync.Mutex
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

func Subcribe(r *Room, conn *websocket.Conn) {
	r.Subcriber[conn] = true
}

func UnSubcribe(r *Room, conn *websocket.Conn) {
	r.Lock.Lock()
	defer r.Lock.Unlock()
	delete(r.Subcriber, conn)
}

func (this *Room) Notify(isATurn, isBTurn, isEnd bool, winner string) {
	type PlayerResponse struct {
		Id     string `json:"id"`
		Name   string `json:"name"`
		IsTurn bool   `json:"isturn"`
		Win    bool   `json:"win"`
	}
	type SubcriberResponse struct {
		RoomId string             `json:"roomid"`
		Finish bool               `json:"finish"`
		Player [2]*PlayerResponse `json:"player"`
		Board  *Board             `json:"board"`
	}
	if len(this.Subcriber) > 1 {
		var player [2]*PlayerResponse
		var response *SubcriberResponse
		player[0] = &PlayerResponse{
			Id:     this.A.FbId,
			Name:   this.A.Name,
			IsTurn: isATurn,
			Win:    isEnd && winner == this.A.FbId,
		}
		player[1] = &PlayerResponse{
			Id:     this.B.FbId,
			Name:   this.B.Name,
			IsTurn: isBTurn,
			Win:    isEnd && winner == this.B.FbId,
		}
		response = &SubcriberResponse{
			RoomId: this.Id,
			Finish: isEnd,
			Player: player,
			Board:  this.Board,
		}
		resjs, err := json.Marshal(response)
		if err != nil {
			panic(err)
		}
		for conn, _ := range this.Subcriber {
			conn.WriteMessage(1, resjs)
		}
	}
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
		go this.Notify(false, false, true, "")
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
		go this.Notify(false, false, true, this.Winner.FbId)
		this.Complete <- this
		return
	}
	go this.Notify(isATurn, !isATurn, false, "")
	this.A.AddResponse(CreateBoardResponse(isATurn, this.Board))
	this.B.AddResponse(CreateBoardResponse(!isATurn, this.Board))
}
