package OAuth

import (
	"encoding/json"
	"errors"
	"io/ioutil"
	"net/http"
	"path/filepath"
	"regexp"
	"strings"
)

var (
	r, _ = regexp.Compile(`access_token=(.)+`)
)

type Config struct {
	Facebook struct {
		AppId       string `json:"APP_ID"`
		AppSecret   string `json:"APP_SECRET"`
		CallbackUrl string `json:"CALLBACK_URL"`
	} `json:"facebook"`
}

type ProfileFB struct {
	Name        string `json:"name"`
	Id          string `json:"id"`
	AccessToken string `json:"-,omitempty"`
}

func SetupOAuth(flConfigFile string) (*Config, error) {
	var cfg Config
	absPath, err := filepath.Abs(flConfigFile)
	if err != nil {
		return nil, err
	}

	data, err := ioutil.ReadFile(absPath)
	if err != nil {
		return nil, err
	}

	err = json.Unmarshal(data, &cfg)
	if err != nil {
		return nil, err
	}
	return &cfg, nil
}

func (this *Config) RequestTokenFB(code string) (string, error) {
	res, err := http.Get("https://graph.facebook.com/oauth/access_token?client_id=" + this.Facebook.AppId + "&redirect_uri=" + this.Facebook.CallbackUrl + "&client_secret=" + this.Facebook.AppSecret + "&code=" + code)
	if err != nil {
		return "", err
	}
	body, _ := ioutil.ReadAll(res.Body)
	str := string(body)
	if len(r.FindAllString(str, -1)) != 1 {
		err = errors.New("Response not match")
		return "", err
	}
	str1 := strings.Split(str, "=")[1]
	access_token := strings.Split(str1, "&")[0]
	return access_token, nil
}

func (this *Config) ExtendTokenFB(accessToken string) (string, error) {
	res, err := http.Get("https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=" + this.Facebook.AppId + "&client_secret=" + this.Facebook.AppSecret + "&fb_exchange_token=" + accessToken)
	if err != nil {
		return "", err
	}
	body, _ := ioutil.ReadAll(res.Body)
	str := string(body)
	if len(r.FindAllString(str, -1)) != 1 {
		err = errors.New("Response not match")
		return "", err
	}
	str1 := strings.Split(str, "=")[1]
	access_token := strings.Split(str1, "&")[0]
	return access_token, nil
}

func (this *Config) GetProfileFB(accessToken string) (*ProfileFB, error) {
	res, err := http.Get("https://graph.facebook.com/me?access_token=" + accessToken)
	var profileFB ProfileFB
	decoder := json.NewDecoder(res.Body)
	err = decoder.Decode(&profileFB)
	if err != nil {
		return nil, err
	}
	return &profileFB, nil
}
