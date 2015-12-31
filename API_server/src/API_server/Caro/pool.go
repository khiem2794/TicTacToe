package Caro

import (
	"encoding/json"
	"log"

	"github.com/gorilla/websocket"
)

type Pool struct {
	Pleb    map[*Player]bool
	Fighter map[*Player]bool
	Field   chan Room
}

func NewPool() *Pool {
	return &Pool{
		Pleb:    make(map[*Player]bool),
		Fighter: make(map[*Player]bool),
		Field:   make(chan Room),
	}
}

type Player struct {
	Conn     *websocket.Conn
	Name     string
	FbId     string
	Response chan Response
}

type Room struct {
	A     Player
	B     Player
	Board *Board
}

func (this *Pool) AddPleb(pleb *Player) {
	this.Pleb[pleb] = true
}

func (this *Pool) RemovePleb(pleb *Player) {
	delete(this.Pleb, pleb)
}

func (this *Pool) AddFighter(fighter *Player) {
	this.Fighter[fighter] = true
}

func (this *Pool) RemoveFighter(fighter *Player) {
	delete(this.Fighter, fighter)
}

func (this *Pool) RegisterRoom(a *Player, b *Player) {

}

func (this *Pool) MatchMaker() {

}

func (this *Player) HandleMessage(msg []byte, pool *Pool) error {
	var m Message
	if err := json.Unmarshal(msg, &m); err != nil {
		return err
	}
	mType := getType(m)
	log.Println(m)
	switch mType {
	case START_MSG:
		pool.AddFighter(this)
		this.AddResponse(CreateWaitResponse())
	case MOVE_MSG:
		return nil
	default:
		log.Println("Unknown message")
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
	if err := this.Conn.WriteJSON(res); err != nil {
		panic(err)
	}
}
