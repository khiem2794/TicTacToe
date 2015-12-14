package server

import "net/http"

type Config struct {
	Server struct {
		Port string `json:"API_PORT"`
		Addr string `json:"API_ADDR"`
	} `json:"server"`
}

func Start(cfg Config) {
	s := setup(cfg)

	listenAddr := cfg.Server.Addr + ":" + cfg.Server.Port

	l.Println("API_server is listening on", listenAddr)
	http.ListenAndServe(listenAddr, s.Handler)
}
