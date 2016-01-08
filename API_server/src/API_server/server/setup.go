package server

import (
	"net/http"

	"API_server/OAuth"
	r "API_server/api/rethink"
	"API_server/dbscript"
	"API_server/handlers"
	"API_server/middlewares"
	"API_server/store"
	"API_server/utils/logs"

	"github.com/dancannon/gorethink"
	"github.com/gorilla/context"
	"github.com/gorilla/mux"
)

var l = logs.New("API_server")

type setupStruct struct {
	Config
	AuthConfig *OAuth.Config
	Handler    http.Handler
	DB         *r.Instance
}

func setup(cfg Config, authCfg *OAuth.Config) *setupStruct {
	s := &setupStruct{Config: cfg, AuthConfig: authCfg}
	s.setupRethink()
	s.setupRoutes()

	return s
}

func commonMiddlewares() func(http.Handler) http.Handler {
	logger := middlewares.NewLogger()
	recovery := middlewares.NewRecovery()
	ctx := middlewares.NewCtx()
	return func(h http.Handler) http.Handler {
		return recovery(ctx(logger(h)))
	}
}

func authMiddlewares() func(http.Handler) http.Handler {
	auth := middlewares.NewAuth()

	return func(h http.Handler) http.Handler {
		return auth(h)
	}
}

func (s *setupStruct) setupRethink() {
	cfg := s.Config
	re, err := r.NewInstance(gorethink.ConnectOpts{
		Address:  cfg.Rethink.Addr + ":" + cfg.Rethink.Port,
		Database: cfg.Rethink.DBName,
	})
	if err != nil {
		l.Fatalln("Couldn't connect to Rethink server")
	}
	s.DB = re
	script := dbscript.NewRethinkScript(s.DB, cfg.Rethink.DBName)
	if err := script.Setup(); err != nil {
		l.Fatalln("Error generating data", err)
	}
}
func (s *setupStruct) setupRoutes() {
	commonMids := commonMiddlewares()

	normal := func(h http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			commonMids(h).ServeHTTP(w, r)
		}
	}

	router := mux.NewRouter()
	store := store.NewStore(s.DB)
	authCtrl := handlers.NewAuthCtrl(s.AuthConfig, store)
	{
		router.HandleFunc("/login/facebook", normal(authCtrl.FacebookLogin)).Methods("POST")
		router.HandleFunc("/loadAuth", normal(authCtrl.LoadAuth)).Methods("GET")
		router.HandleFunc("/logout", normal(authCtrl.Logout)).Methods("GET")
	}

	gameCtrl := handlers.NewGameCtrl(store)
	{
		router.Handle("/ws/caro", normal(gameCtrl.CaroHandler))
	}

	s.Handler = context.ClearHandler(router)
}
