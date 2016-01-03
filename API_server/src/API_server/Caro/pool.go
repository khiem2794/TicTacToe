package Caro

import (
	"encoding/json"
	"log"
	"sync"

	"github.com/gorilla/websocket"
)

type Pool struct {
	Pleb    map[*Player]bool
	Fighter map[*Player]bool
	Field   chan *Room
	Lock    *sync.Mutex
}

func NewPool() *Pool {
	return &Pool{
		Pleb:    make(map[*Player]bool),
		Fighter: make(map[*Player]bool),
		Field:   make(chan *Room),
		Lock:    &sync.Mutex{},
	}
}

type Player struct {
	Conn     *websocket.Conn `json:"-"`
	Name     string          `json:"name"`
	FbId     string          `json:"fbid"`
	Response chan Response   `json:"-"`
	Symbol   string          `json:"symbol"`
	Room     *Room           `json:"-"`
}

type Room struct {
	A     *Player
	B     *Player
	Board *Board
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

func (this *Room) BroadcastMove(player *Player) {
	isATurn := false
	if player != this.A {
		isATurn = true
	}
	this.A.AddResponse(CreateBoardResponse(isATurn, this.Board))
	this.B.AddResponse(CreateBoardResponse(!isATurn, this.Board))
}

func (this *Pool) AddPleb(pleb *Player) {
	this.Pleb[pleb] = true
}

func (this *Pool) RemovePleb(pleb *Player) {
	delete(this.Pleb, pleb)
}

func (this *Pool) AddFighter(fighter *Player) {
	this.Fighter[fighter] = false
}

func (this *Pool) RemoveFighter(fighter *Player) {
	delete(this.Fighter, fighter)
}

func (this *Pool) RegisterRoom(a *Player, b *Player) bool {
	this.Lock.Lock()
	defer this.Lock.Unlock()
	if _, ok := this.Fighter[b]; ok && this.Fighter[b] == false {
		this.Fighter[b] = true
	} else {
		return false
	}
	this.Fighter[a] = true
	r := &Room{
		A:     a,
		B:     b,
		Board: CreateBoard(nil, nil, 0),
	}
	a.Room = r
	b.Room = r
	this.Field <- r
	return true
}

func (this *Pool) FieldManager() {
	for {
		select {
		case r := <-this.Field:
			log.Println("New room Registered", r.A.Name, r.B.Name)
			r.Start()
		default:
		}
	}
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
			panic(err)
		}
		log.Println(this.Name, move.Pos)
		this.Room.Board.Move(this.Symbol, move.Pos)
		this.Room.BroadcastMove(this)
	default:
		log.Println("Unknown message")
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
