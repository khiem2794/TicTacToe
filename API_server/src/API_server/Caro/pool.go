package Caro

import (
	"API_server/domain"
	"API_server/store"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

type Pool struct {
	Pleb     map[*Player]bool
	Fighter  map[*Player]bool
	Rooms    map[*Room]bool
	Complete chan *Room
	Lock     *sync.Mutex
	Store    *store.Store
}

func NewPool(s *store.Store) *Pool {
	return &Pool{
		Pleb:     make(map[*Player]bool),
		Fighter:  make(map[*Player]bool),
		Rooms:    make(map[*Room]bool),
		Complete: make(chan *Room),
		Lock:     &sync.Mutex{},
		Store:    s,
	}
}

func (this *Pool) AddPleb(pleb *Player) {
	this.Pleb[pleb] = true
}

func (this *Pool) RemovePleb(pleb *Player) {
	this.RemoveFighter(pleb)
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
	match := &domain.Match{
		Status:      domain.STATUS_PLAYING,
		Player:      [2]string{a.FbId, b.FbId},
		Turn:        0,
		CreatedTime: time.Now(),
	}
	r := &Room{
		A:         a,
		B:         b,
		Board:     CreateBoard(nil, nil, 0),
		Complete:  this.Complete,
		Match:     match,
		Subcriber: make(map[*websocket.Conn]bool),
		Lock:      &sync.Mutex{},
	}
	a.Room = r
	b.Room = r
	if err := this.Store.CreateMatch(match); err != nil {
		panic(err)
	}
	r.Id = match.Id
	this.Store.StartMatch([2]string{a.FbId, b.FbId}, match.Id)
	this.Rooms[r] = true
	go r.Start()
	return true
}

func (this *Pool) CloseRoom(r *Room) {
	this.Lock.Lock()
	defer this.Lock.Unlock()
	delete(this.Fighter, r.A)
	delete(this.Fighter, r.B)
	delete(this.Rooms, r)
	r.Match.Turn = r.Board.Turn
	if r.Winner.FbId != "" {
		r.Match.Winner = r.Winner.FbId
		this.Store.UpdateWin(r.Winner.FbId)
	}
	r.Match.Status = domain.STATUS_FINISHED
	err := this.Store.UpdateMatch(r.Match)
	if err != nil {
		panic(err)
	}
}

func (this *Pool) RoomManager() {
	for {
		select {
		case r := <-this.Complete:
			this.CloseRoom(r)
		default:
		}
	}
}
