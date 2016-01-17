package Caro

import (
	"API_server/domain"
	"encoding/json"
	"log"
	"math/rand"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

type Room struct {
	Id        string
	A         *Player
	B         *Player
	WhoseTurn string
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
	Afirst := true
	rand.Seed(time.Now().UnixNano())
	if rand.Intn(2) == 0 {
		this.A.Symbol = SYMBOL_X
		this.B.Symbol = SYMBOL_O
		this.WhoseTurn = this.A.FbId
	} else {
		this.A.Symbol = SYMBOL_O
		this.B.Symbol = SYMBOL_X
		Afirst = false
		this.WhoseTurn = this.B.FbId
	}
	log.Println("first", this.WhoseTurn)
	this.A.AddResponse(CreateReadyResopnse(this.B, this.Board, Afirst, this.A.Symbol))
	this.B.AddResponse(CreateReadyResopnse(this.A, this.Board, !Afirst, this.B.Symbol))
}

func Subcribe(r *Room, conn *websocket.Conn) {
	r.Subcriber[conn] = true
	r.Notify(false, conn)
}

func UnSubcribe(r *Room, conn *websocket.Conn) {
	r.Lock.Lock()
	defer r.Lock.Unlock()
	delete(r.Subcriber, conn)
}

func (this *Room) Notify(isEnd bool, subcribers ...*websocket.Conn) {
	type PlayerResponse struct {
		Id     string `json:"id"`
		Name   string `json:"name"`
		Symbol string `json:"symbol"`
		IsTurn bool   `json:"isturn"`
		Win    bool   `json:"win"`
	}
	type SubcriberResponse struct {
		RoomId string             `json:"roomid"`
		Finish bool               `json:"finish"`
		Player [2]*PlayerResponse `json:"player"`
		Board  *Board             `json:"board"`
	}
	if len(this.Subcriber) > 0 {
		var player [2]*PlayerResponse
		var response *SubcriberResponse
		player[0] = &PlayerResponse{
			Id:     this.A.FbId,
			Name:   this.A.Name,
			Symbol: this.A.Symbol,
			IsTurn: this.A.FbId == this.WhoseTurn,
			Win:    isEnd && this.Winner.FbId == this.A.FbId,
		}
		player[1] = &PlayerResponse{
			Id:     this.B.FbId,
			Name:   this.B.Name,
			Symbol: this.B.Symbol,
			IsTurn: this.B.FbId == this.WhoseTurn,
			Win:    isEnd && this.Winner.FbId == this.B.FbId,
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
		if len(subcribers) > 0 {
			for _, conn := range subcribers {
				conn.WriteMessage(1, resjs)
			}
		} else {
			log.Println("this.WhoseTurn", this.WhoseTurn)
			for conn, _ := range this.Subcriber {
				conn.WriteMessage(1, resjs)
			}
		}
	}
}

func (this *Room) BroadcastMove(player *Player) {
	Aturn := player.FbId == this.B.FbId
	if Aturn {
		this.WhoseTurn = this.A.FbId
	} else {
		this.WhoseTurn = this.B.FbId
	}
	if draw := this.Board.IsDraw(); draw {
		this.A.AddResponse(CreateEndResponse(false, this.Board))
		this.B.AddResponse(CreateEndResponse(false, this.Board))
		this.Winner = &Player{}
		go this.Notify(true)
		this.Complete <- this
		return
	}
	if end := this.Board.IsWin(player.Symbol); end {
		Awin := player == this.A
		this.A.AddResponse(CreateEndResponse(Awin, this.Board))
		this.B.AddResponse(CreateEndResponse(!Awin, this.Board))
		this.WhoseTurn = ""
		if Awin {
			this.Winner = this.A
		} else {
			this.Winner = this.B
		}
		go this.Notify(true)
		this.Complete <- this
		return
	}
	go this.Notify(false)
	this.A.AddResponse(CreateBoardResponse(Aturn, this.Board))
	this.B.AddResponse(CreateBoardResponse(!Aturn, this.Board))
}
