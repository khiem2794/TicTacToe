package store

import (
	"API_server/api/rethink"
)

type Store struct {
	re *rethink.Instance
}

func NewStore(re *rethink.Instance) *Store {
	return &Store{
		re: re,
	}
}

func (this *Store) ListAllUser() (user []*User) {
	this.re.All(this.re.Table(USER_TABLE), &user)
	return
}

func (this *Store) CreateUser(user *User) error {
	_, err := this.re.RunWrite(this.re.Table(USER_TABLE).Insert(user))
	return err
}

func (this *Store) GetUser(id string) (user *User, err error) {
	err = this.re.One(this.re.Table(USER_TABLE).Get(id), &user)
	return
}

func (this *Store) ListAllMatch() (match []*Match) {
	this.re.All(this.re.Table(MATCH_TABLE), &match)
	return
}

func (this *Store) CreateMatch(match *Match) error {
	_, err := this.re.RunWrite(this.re.Table(MATCH_TABLE).Insert(match))
	return err
}

func (this *Store) GetMatch(id string) (match *Match, err error) {
	err = this.re.One(this.re.Table(MATCH_TABLE).Get(id), &match)
	return
}
