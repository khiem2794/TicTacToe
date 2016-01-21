package middlewares

import (
	"API_server/utils/cookie"
	"log"
	"net/http"

	"github.com/gorilla/context"
)

type Ctx struct {
}

func NewCtx() func(http.Handler) http.Handler {
	a := Ctx{}
	return a.factory
}

func (a Ctx) factory(next http.Handler) http.Handler {

	return http.HandlerFunc(
		func(w http.ResponseWriter, r *http.Request) {
			profile, err := cookie.GetProfile(r)
			if err != nil {
				log.Println("Context err", err)
				next.ServeHTTP(w, r)
			} else {
				context.Set(r, "PROFILE", profile)
				next.ServeHTTP(w, r)
				context.Clear(r)
			}
		})
}
