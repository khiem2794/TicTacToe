package store

import "API_server/api/rethink"

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

func (this *Store) StartMatch(players [2]string, matchid string) error {
	for _, userid := range players {
		user, err := this.GetUser(userid)
		if err != nil {
			return err
		}
		user.Match = append(user.Match, matchid)
		_, err = this.re.RunWrite(this.re.Table(USER_TABLE).Get(userid).Update(user))
		if err != nil {
			return err
		}
	}

	return nil
}

func (this *Store) UpdateWin(userid string) error {
	user, err := this.GetUser(userid)
	if err != nil {
		return err
	}
	user.Win++
	_, err = this.re.RunWrite(this.re.Table(USER_TABLE).Get(userid).Update(user))
	return err
}

func (this *Store) ListAllMatch() (match []*Match) {
	this.re.All(this.re.Table(MATCH_TABLE), &match)
	return
}

func (this *Store) CreateMatch(match *Match) error {
	rw, err := this.re.RunWrite(this.re.Table(MATCH_TABLE).Insert(match))
	if err != nil {
		return err
	}
	match.Id = rw.GeneratedKeys[0]
	return nil
}

func (this *Store) UpdateMatch(match *Match) error {
	_, err := this.re.RunWrite(this.re.Table(MATCH_TABLE).Get(match.Id).Update(match))
	return err
}

func (this *Store) GetMatch(id string) (match *Match, err error) {
	err = this.re.One(this.re.Table(MATCH_TABLE).Get(id), &match)
	return
}
