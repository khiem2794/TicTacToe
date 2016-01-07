package server

import (
	"API_server/OAuth"
	"net/http"
)

type Config struct {
	Server struct {
		Port string `json:"API_PORT"`
		Addr string `json:"API_ADDR"`
	} `json:"server"`

	Rethink struct {
		Port   string `json:"RETHINKDB_PORT"`
		Addr   string `json:"RETHINKDB_ADDR"`
		DBName string `json:"RETHINKDB_DBNAME"`
	} `json:"rethinkdb"`
}

func Start(cfg Config, authCfg *OAuth.Config) {
	s := setup(cfg, authCfg)

	listenAddr := cfg.Server.Addr + ":" + cfg.Server.Port

	l.Println("API_server is listening on", listenAddr)
	http.ListenAndServe(listenAddr, s.Handler)
}
