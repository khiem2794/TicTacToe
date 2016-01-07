package rethink

import (
	r "github.com/dancannon/gorethink"

	"API_server/utils/logs"
)

var (
	l = logs.New("api/rethink")
)

type Instance struct {
	opts    r.ConnectOpts
	session *r.Session
	db      string
}

func NewInstance(opts r.ConnectOpts) (*Instance, error) {
	ins := &Instance{
		opts: opts,
		db:   opts.Database,
	}

	session, err := r.Connect(opts)
	if err != nil {
		return nil, err
	}
	ins.session = session
	return ins, nil
}

func (this *Instance) Connect() {
	if session, err := r.Connect(this.opts); err == nil {
		this.session = session
	} else {
		l.Fatalln("Cant connect to Rethink server")
	}
}

func (this *Instance) DB() r.Term {
	return r.DB(this.db)
}

func (this *Instance) Exec(term r.Term) error {
	this.Connect()
	return term.Exec(this.session)
}

func (this *Instance) Table(name string) r.Term {
	return r.DB(this.db).Table(name)
}

func (this *Instance) Run(term r.Term) (*r.Cursor, error) {
	this.Connect()
	return term.Run(this.session)
}

func (this *Instance) RunWrite(term r.Term) (r.WriteResponse, error) {
	this.Connect()
	return term.RunWrite(this.session)
}

func (this *Instance) One(term r.Term, result interface{}) error {
	cursor, err := term.Run(this.session)
	if err != nil {
		return err
	}

	return cursor.One(result)
}

func (this *Instance) All(term r.Term, result interface{}) error {
	cursor, err := term.Run(this.session)
	if err != nil {
		return err
	}

	return cursor.All(result)
}

func (this *Instance) Between(table string, index interface{}, start, end interface{}) r.Term {
	return r.DB(this.db).Table(table).OrderBy(r.OrderByOpts{Index: index}).Between(start, end)
}
