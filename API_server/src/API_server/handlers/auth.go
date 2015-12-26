package handlers

import (
	"encoding/json"
	"net/http"

	"API_server/OAuth"
	"API_server/utils/cookie"
	"API_server/utils/logs"
)

var (
	authLogger = logs.New("AuthCtrl")
)

type AuthCtrl struct {
	*OAuth.Config
}
type LoginReq struct {
	Code string `json:"code"`
}

func NewAuthCtrl(authCfg *OAuth.Config) *AuthCtrl {
	return &AuthCtrl{authCfg}
}

func (this *AuthCtrl) FacebookLogin(w http.ResponseWriter, r *http.Request) {
	var loginReq LoginReq
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&loginReq)
	if err != nil {
		authLogger.Println(err)
		w.WriteHeader(404)
		w.Write([]byte("Cant Decode Login Request"))
		return
	}

	token, err := this.Config.RequestTokenFB(loginReq.Code)
	if err != nil {
		authLogger.Println(err)
		w.WriteHeader(404)
		w.Write([]byte("Error getting access token"))
		return
	}
	extendToken, err := this.Config.ExtendTokenFB(token)
	if err != nil {
		extendToken = token
	}
	profileFB, err := this.Config.GetProfileFB(extendToken)
	if err != nil {
		authLogger.Println(err)
		w.WriteHeader(404)
		w.Write([]byte("Error getting profile FB"))
		return
	}

	AuthCookie, err := cookie.NewCookie(profileFB.Id, profileFB.Name)
	if err != nil {
		authLogger.Println(err)
		w.WriteHeader(404)
		w.Write([]byte("Error generate AuthCookie"))
		return
	}
	cookie.SetCookie(w, AuthCookie)

	resjs, err := json.Marshal(profileFB)
	if err != nil {
		authLogger.Println(err)
		w.WriteHeader(404)
		w.Write([]byte("Error generate marshal resjs"))
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(resjs)
}

func (this *AuthCtrl) LoadAuth(w http.ResponseWriter, r *http.Request) {
	profileFB, err := cookie.GetProfile(r)
	if err != nil {
		return
	}

	resjs, err := json.Marshal(profileFB)
	if err != nil {
		authLogger.Println(err)
		w.WriteHeader(404)
		w.Write([]byte("Error generate marshal resjs"))
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(resjs)
}
