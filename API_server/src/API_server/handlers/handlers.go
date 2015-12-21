package handlers

import (
	"API_server/utils/logs"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"github.com/gorilla/securecookie"
	"github.com/gorilla/sessions"
	"github.com/gorilla/websocket"
)

type widget struct {
	Id            int    `json:"id"`
	Color         string `json:"color"`
	SprocketCount int    `json:"sprocketCount"`
	Owner         string `json:"owner"`
}

var (
	upgrader = websocket.Upgrader{}

	ws = logs.New("WebSocket")

	a = widget{Id: 1, Color: "Red", SprocketCount: 7, Owner: "John"}
	b = widget{Id: 2, Color: "Green", SprocketCount: 17, Owner: "Khiem"}
	c = widget{Id: 3, Color: "Red", SprocketCount: 27, Owner: "Mary"}
	d = widget{Id: 4, Color: "Yellow", SprocketCount: 37, Owner: "Ken"}

	store         = sessions.NewCookieStore([]byte("something-very-secret"))
	cookieHandler = securecookie.New(securecookie.GenerateRandomKey(64), securecookie.GenerateRandomKey(32))
)

func Home(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("HOME"))
}

func Restrict(w http.ResponseWriter, r *http.Request) {
	ps := mux.Vars(r)
	if ps["user"] == "khiem" {
		w.Write([]byte("OK"))
	} else {
		w.Write([]byte("NOT OK, Out"))
	}
}

func WsTest(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		ws.Println(err)
		return
	}
	defer conn.Close()
	for {
		mt, message, err := conn.ReadMessage()
		if err != nil {
			return
		}
		ws.Println(message)
		if err = conn.WriteMessage(mt, message); err != nil {
			return
		}
	}
}

func LoadP(w http.ResponseWriter, r *http.Request) {
	rpjs, err := json.Marshal([]widget{a, b, c, d})
	if err != nil {
		fmt.Println(err)
		w.Write([]byte("SERVER ERROR"))
		return
	}
	time.Sleep(2 * time.Second)
	w.Header().Set("Content-Type", "application/json")
	w.Write(rpjs)
}

func EditP(w http.ResponseWriter, r *http.Request) {
	p, _ := ioutil.ReadAll(r.Body)
	fmt.Println("a+", string(p), "+a")
	var wid widget
	err := json.Unmarshal([]byte(string(p)), &wid)
	if err != nil {
		fmt.Println(err)
		w.Write([]byte("SERVER ERROR"))
		return
	}
	switch wid.Id {
	case 1:
		a = wid
	case 2:
		b = wid
	case 3:
		c = wid
	case 4:
		d = wid
	}
	rpjs, err := json.Marshal(wid)
	if err != nil {
		fmt.Println(err)
		w.Write([]byte("SERVER ERROR"))
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(rpjs)
}

func Login(w http.ResponseWriter, r *http.Request) {
	var user struct {
		Name string `json:"name"`
	}
	p, _ := ioutil.ReadAll(r.Body)
	json.Unmarshal(p, &user)
	rpjs, _ := json.Marshal(user)
	setSession(user.Name, w)
	w.Header().Set("Content-Type", "application/json")
	w.Write(rpjs)
}

func Logout(w http.ResponseWriter, r *http.Request) {
	rpjs, _ := json.Marshal(map[string]string{"name": "khiem"})
	w.Header().Set("Content-Type", "application/json")
	w.Write(rpjs)
}

func setSession(userName string, response http.ResponseWriter) {
	value := map[string]string{
		"name": userName,
	}
	if encoded, err := cookieHandler.Encode("session", value); err == nil {
		cookie := &http.Cookie{
			Name:  "session",
			Value: encoded,
			Path:  "/",
		}
		http.SetCookie(response, cookie)
	}
}

func getUserName(request *http.Request) (userName string) {
	if cookie, err := request.Cookie("session"); err == nil {
		cookieValue := make(map[string]string)
		if err = cookieHandler.Decode("session", cookie.Value, &cookieValue); err == nil {
			userName = cookieValue["name"]
		}
	}
	return userName
}

func clearSession(response http.ResponseWriter) {
	cookie := &http.Cookie{
		Name:   "session",
		Value:  "",
		Path:   "/",
		MaxAge: -1,
	}
	http.SetCookie(response, cookie)
}
