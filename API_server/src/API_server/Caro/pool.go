package Caro

import (
	"log"
	"sync"
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
