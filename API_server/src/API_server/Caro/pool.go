package Caro

import (
	"API_server/store"
	"log"
	"sync"
	"time"
)

type Pool struct {
	Pleb     map[*Player]bool
	Fighter  map[*Player]bool
	Complete chan *Room
	Lock     *sync.Mutex
	Store    *store.Store
}

func NewPool(s *store.Store) *Pool {
	return &Pool{
		Pleb:     make(map[*Player]bool),
		Fighter:  make(map[*Player]bool),
		Complete: make(chan *Room),
		Lock:     &sync.Mutex{},
		Store:    s,
	}
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
	match := &store.Match{
		Status:      store.STATUS_PLAYING,
		Player:      [2]string{a.FbId, b.FbId},
		Turn:        0,
		CreatedTime: time.Now(),
	}
	r := &Room{
		A:        a,
		B:        b,
		Board:    CreateBoard(nil, nil, 0),
		Complete: this.Complete,
		Match:    match,
	}
	a.Room = r
	b.Room = r
	if err := this.Store.CreateMatch(match); err != nil {
		panic(err)
	}
	this.Store.StartMatch([2]string{a.FbId, b.FbId}, match.Id)
	go r.Start()
	return true
}

func (this *Pool) CloseRoom(r *Room) {
	this.Lock.Lock()
	defer this.Lock.Unlock()
	delete(this.Fighter, r.A)
	delete(this.Fighter, r.B)
	r.Match.Turn = r.Board.Turn
	if r.Winner.FbId != "" {
		log.Println("WIN/LOSE")
		r.Match.Winner = r.Winner.FbId
		this.Store.UpdateWin(r.Winner.FbId)
	}
	r.Match.Status = store.STATUS_FINISHED
	err := this.Store.UpdateMatch(r.Match)
	if err != nil {
		panic(err)
	}
}

func (this *Pool) FieldManager() {
	for {
		select {
		case r := <-this.Complete:
			this.CloseRoom(r)
		default:
		}
	}
}
