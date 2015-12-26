package main

import (
	"flag"

	"API_server/OAuth"
	"API_server/server"
	"API_server/utils/loadConfig"
	"API_server/utils/logs"
)

var (
	flConfigFile = flag.String("config-file", "config-default.json", "Load config from file")

	l = logs.New("API_server")
)

func main() {
	flag.Parse()

	var authCfg *OAuth.Config
	authCfg, err1 := OAuth.SetupOAuth(*flConfigFile)
	if err1 != nil {
		l.Panic(err1)
	}

	var cfg server.Config
	err := loadConfig.FromFileAndEnv(&cfg, *flConfigFile)
	if err != nil {
		l.Fatalln("Error loading config:", err)
	}

	server.Start(cfg, authCfg)

}
