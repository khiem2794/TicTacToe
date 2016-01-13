package handlers

import (
	"API_server/store"
	"API_server/utils/logs"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

var (
	restLogger = logs.New("REST")
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
	matchLimit, err := strconv.Atoi(r.URL.Query().Get("m"))
	if err != nil {
		matchLimit = -1 // get all matches
	}
	res, err := this.Store.GetProfile(mux.Vars(r)["fbid"], matchLimit)
	if err != nil {
		restLogger.Println(err)
		w.WriteHeader(404)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(res)
}

func (this *RestCtrl) UserRankHandler(w http.ResponseWriter, r *http.Request) {

}

func (this *RestCtrl) RankHandler(w http.ResponseWriter, r *http.Request) {
	limit, err := strconv.Atoi(r.URL.Query().Get("limit"))
	if err != nil {
		limit = -1 // get all matches
	}
	res, err := this.Store.GetRanking(limit)
	if err != nil {
		restLogger.Println(err)
		w.WriteHeader(404)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(res)
}

func (this *RestCtrl) MatchHandler(w http.ResponseWriter, r *http.Request) {
	res, err := this.Store.GetMatchInfo(mux.Vars(r)["id"])
	if err != nil {
		restLogger.Println(err)
		w.WriteHeader(404)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(res)
}
