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

	return func(h http.Handler) http.Handler {
		return recovery(logger(h))
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
	authMids := authMiddlewares()

	normal := func(h http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			commonMids(h).ServeHTTP(w, r)
		}
	}

	auth := func(h http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			commonMids(authMids(h)).ServeHTTP(w, r)
		}
	}

	router := mux.NewRouter()

	router.HandleFunc("/", normal(handlers.Home)).Methods("GET")
	router.HandleFunc("/profile/{user}", auth(handlers.Restrict)).Methods("GET")
	router.HandleFunc("/ws/test", normal(handlers.WsTest))
	router.HandleFunc("/widget/load/{param1}/{param2}", normal(handlers.LoadP))
	router.HandleFunc("/widget/update", normal(handlers.EditP)).Methods("POST")
	router.HandleFunc("/login", normal(handlers.Login)).Methods("POST")
	router.HandleFunc("/logout", normal(handlers.Logout)).Methods("POST")

	authCtrl := handlers.NewAuthCtrl(s.AuthConfig)
	{
		router.HandleFunc("/login/facebook", normal(authCtrl.FacebookLogin)).Methods("POST")
		router.HandleFunc("/loadAuth", normal(authCtrl.LoadAuth)).Methods("GET")
	}

	s.Handler = context.ClearHandler(router)
}
