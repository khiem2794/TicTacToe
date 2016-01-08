package cookie

import (
	"API_server/OAuth"
	"net/http"
	"time"

	"github.com/gorilla/securecookie"
)

const (
	COOKIE_NAME = "CARO-NHK"
	MAX_AGE     = 3600 * 24 * 30
)

var (
	hashKey       = []byte{44, 182, 78, 160, 210, 57, 235, 63, 86, 184, 74, 240, 244, 63, 228, 147, 76, 59, 71, 129, 45, 131, 86, 154, 25, 106, 2, 31, 144, 118, 180, 116, 110, 204, 237, 130, 215, 125, 2, 75, 239, 24, 119, 110, 129, 216, 158, 13, 18, 109, 63, 26, 171, 145, 203, 89, 63, 72, 136, 231, 31, 57, 116, 105}
	blockKey      = []byte{64, 15, 168, 237, 70, 183, 17, 31, 130, 123, 118, 96, 66, 66, 223, 123, 60, 172, 27, 119, 14, 234, 252, 107, 35, 116, 234, 194, 37, 30, 125, 126}
	cookieHandler = securecookie.New(hashKey, blockKey)
	EXPIRES       = time.Now().Add(time.Hour * 24 * 30)
)

type Cookie struct {
	*http.Cookie
	Name  string
	Value CookieValue
}
type CookieValue struct {
	UserFBID   string
	UserFBName string
}

func NewCookie(FBID string, FBName string) (*Cookie, error) {
	var cookie = &Cookie{}
	cookie.Name = COOKIE_NAME
	cookie.Value.UserFBID = FBID
	cookie.Value.UserFBName = FBName
	encoded, err := cookieHandler.Encode(cookie.Name, cookie.Value)
	if err == nil {
		cookie.Cookie = &http.Cookie{
			Name:    COOKIE_NAME,
			Value:   encoded,
			Path:    "/",
			Expires: EXPIRES,
			MaxAge:  MAX_AGE,
		}
		return cookie, nil
	}
	return nil, err

}

func SetCookie(w http.ResponseWriter, cookie *Cookie) {
	http.SetCookie(w, cookie.Cookie)
}

func GetProfile(r *http.Request) (*OAuth.ProfileFB, error) {
	cookie, err := r.Cookie(COOKIE_NAME)
	if err != nil {
		return nil, err
	}
	var cookieValue = &CookieValue{}
	err = cookieHandler.Decode(COOKIE_NAME, cookie.Value, cookieValue)
	if err != nil {
		return nil, err
	}
	profileFB := &OAuth.ProfileFB{
		Name: cookieValue.UserFBName,
		Id:   cookieValue.UserFBID,
	}
	return profileFB, nil
}

func ClearCookie(w http.ResponseWriter, r *http.Request) {
	var cookie = &http.Cookie{
		Name:   COOKIE_NAME,
		Path:   "/",
		MaxAge: -1,
	}
	http.SetCookie(w, cookie)
}
