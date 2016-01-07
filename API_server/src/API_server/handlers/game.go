package handlers

import (
	"API_server/Caro"
	"API_server/OAuth"
	"API_server/store"
	"API_server/utils/logs"
	"net/http"

	"github.com/gorilla/context"
	"github.com/gorilla/websocket"
)

var (
	upgrader = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}

	gameLogger = logs.New("GameCtrl")
)

type GameCtrl struct {
	*Caro.Pool
	*store.Store
}

func NewGameCtrl(store *store.Store) *GameCtrl {
	p := Caro.NewPool()
	go p.FieldManager()
	return &GameCtrl{
		Pool:  p,
		Store: store,
	}
}

func (this *GameCtrl) CaroHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		gameLogger.Println(err)
		w.WriteHeader(404)
		w.Write([]byte("Cant established  connection"))
		return
	}
	profile, _ := context.Get(r, "PROFILE").(*OAuth.ProfileFB)
	player := &Caro.Player{
		Conn:     conn,
		Name:     profile.Name,
		FbId:     profile.Id,
		Response: make(chan Caro.Response),
	}
	this.Pool.AddPleb(player)
	defer func() {
		this.Pool.RemovePleb(player)
		conn.Close()
	}()

	for p, _ := range this.Pool.Pleb {
		gameLogger.Println(p.Name, "online")
	}

	go player.HandleResponse()

	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			gameLogger.Println(err)
			return
		}
		if err = player.HandleMessage(message, this.Pool); err != nil {
			gameLogger.Println(err)
			return
		}
	}
}
