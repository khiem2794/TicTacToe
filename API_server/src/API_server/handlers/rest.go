package handlers

import (
	"API_server/store"
	"API_server/utils/logs"
	"net/http"

	"github.com/gorilla/mux"
)

var (
	restLogger = logs.New("Rest")
)

type RestCtrl struct {
	*store.Store
}

func NewRestCtrl(s *store.Store) *RestCtrl {
	return &RestCtrl{
		Store: s,
	}
}

func (this *RestCtrl) ProfileHandler(w http.ResponseWriter, r *http.Request) {
	res, err := this.Store.GetProfile(mux.Vars(r)["fbid"])
	if err != nil {
		restLogger.Println(err)
		w.WriteHeader(404)
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(res)
}

func (this *RestCtrl) RankHandler(w http.ResponseWriter, r *http.Request) {
	res, _ := this.Store.GetRanking(10)
	w.Header().Set("Content-Type", "application/json")
	w.Write(res)
}

func (this *RestCtrl) MatchHandler(w http.ResponseWriter, r *http.Request) {

}
