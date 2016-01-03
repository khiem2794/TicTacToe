package Caro

import (
	"encoding/json"

	"github.com/gorilla/websocket"
)

type Player struct {
	Conn     *websocket.Conn `json:"-"`
	Name     string          `json:"name"`
	FbId     string          `json:"fbid"`
	Response chan Response   `json:"-"`
	Symbol   string          `json:"symbol"`
	Room     *Room           `json:"-"`
}

func (this *Player) HandleMessage(msg []byte, pool *Pool) error {
	var m Message
	if err := json.Unmarshal(msg, &m); err != nil {
		return err
	}
	mType := getType(m)
	switch mType {
	case START_MSG:
		this.AddResponse(CreateWaitResponse())
		if opponent := this.FindOpponent(pool); opponent != nil {
			success := pool.RegisterRoom(this, opponent)
			if !success {
				pool.AddFighter(this)
			}
		} else {
			pool.AddFighter(this)
		}
	case MOVE_MSG:
		var move Message
		err := json.Unmarshal(msg, &move)
		if err != nil {
			this.AddResponse(CreateErrorResponse())
		} else {
			this.Room.Board.Move(this.Symbol, move.Pos)
			this.Room.BroadcastMove(this)
		}
	default:
		this.AddResponse(CreateErrorResponse())
	}
	return nil
}

func (this *Player) FindOpponent(pool *Pool) *Player {
	for fighter := range pool.Fighter {
		if pool.Fighter[fighter] == false {
			return fighter
		}
	}
	return nil
}

func (this *Player) AddResponse(r Response) {
	this.Response <- r
}

func (this *Player) HandleResponse() {
	for res := range this.Response {
		this.SendResponse(res)
	}
}

func (this *Player) SendResponse(res Response) {
	resjs, err := json.Marshal(res)
	if err != nil {
		panic(err)
	}
	if err := this.Conn.WriteMessage(1, resjs); err != nil {
		panic(err)
	}
}
