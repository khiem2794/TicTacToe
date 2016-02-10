package handlers

import (
	"API_server/Caro"
	"API_server/OAuth"
	"API_server/store"
	"API_server/utils/logs"
	"encoding/json"
	"log"
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
	p := Caro.NewPool(store)
	go p.RoomManager()
	return &GameCtrl{
		Pool:  p,
		Store: store,
	}
}

func (this *GameCtrl) CaroHandler(w http.ResponseWriter, r *http.Request) {
	profile, _ := context.Get(r, "PROFILE").(*OAuth.ProfileFB)
	if profile == nil {
		log.Println("req", r)
		gameLogger.Println("Cant get Profile")
		return
	}
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		gameLogger.Println(err)
		w.WriteHeader(404)
		w.Write([]byte("Cant established  connection"))
		return
	}

	player := &Caro.Player{
		Conn:     conn,
		Name:     profile.Name,
		FbId:     profile.Id,
		Response: make(chan Caro.Response),
	}
	this.Pool.AddPleb(player)
	defer func() {
		close(player.Response)
		this.Pool.RemovePleb(player)
		conn.Close()
	}()
	go player.HandleResponse()
	for {
		_, message, err := conn.ReadMessage()
		log.Println(string(message))
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

func (this *GameCtrl) GetMatchesHandler(w http.ResponseWriter, r *http.Request) {
	type Player struct {
		Id   string `json:"id"`
		Name string `json:"name"`
	}
	type Match struct {
		Id     string     `json:"id"`
		Player [2]*Player `json:"player"`
	}
	type MatchesReponse struct {
		Matches []*Match `json:"matches"`
	}
	var matchesResponse = &MatchesReponse{}
	for r, _ := range this.Pool.Rooms {
		var player [2]*Player
		player[0] = &Player{Id: r.A.FbId, Name: r.A.Name}
		player[1] = &Player{Id: r.B.FbId, Name: r.B.Name}
		m := &Match{
			Id:     r.Id,
			Player: player,
		}
		matchesResponse.Matches = append(matchesResponse.Matches, m)
	}
	res, err := json.Marshal(matchesResponse)
	if err != nil {
		gameLogger.Println(err)
		w.WriteHeader(404)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(res)
}

func (this *GameCtrl) SpectateHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		gameLogger.Println(err)
		w.WriteHeader(404)
		return
	}
	defer conn.Close()
	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			gameLogger.Println(err)
			w.WriteHeader(404)
			return
		}
		type Subcribe struct {
			RoomId string `json:"roomid"`
		}
		var s Subcribe
		err = json.Unmarshal(message, &s)
		if err == nil {
			for r, _ := range this.Pool.Rooms {
				if r.Id == s.RoomId {
					log.Println(string(message))
					Caro.Subcribe(r, conn)
					defer Caro.UnSubcribe(r, conn)
				}
			}
		}
	}
}
