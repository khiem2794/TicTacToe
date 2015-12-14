package handlers

import (
	"net/http"

	"github.com/gorilla/mux"
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
