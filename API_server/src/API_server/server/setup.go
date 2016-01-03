package server

import (
	"net/http"

	"API_server/OAuth"
	"API_server/handlers"
	"API_server/middlewares"
	"API_server/utils/logs"

	"github.com/gorilla/context"
	"github.com/gorilla/mux"
)

var l = logs.New("API_server")

type setupStruct struct {
	Config
	AuthConfig *OAuth.Config
	Handler    http.Handler
}

func setup(cfg Config, authCfg *OAuth.Config) *setupStruct {
	s := &setupStruct{Config: cfg, AuthConfig: authCfg}
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

func (s *setupStruct) setupRoutes() {
	commonMids := commonMiddlewares()

	normal := func(h http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			commonMids(h).ServeHTTP(w, r)
		}
	}

	router := mux.NewRouter()

	authCtrl := handlers.NewAuthCtrl(s.AuthConfig)
	{
		router.HandleFunc("/login/facebook", normal(authCtrl.FacebookLogin)).Methods("POST")
		router.HandleFunc("/loadAuth", normal(authCtrl.LoadAuth)).Methods("GET")
	}

	gameCtrl := handlers.NewGameCtrl()
	{
		router.Handle("/ws/caro", normal(gameCtrl.CaroHandler))
	}

	s.Handler = context.ClearHandler(router)
}
