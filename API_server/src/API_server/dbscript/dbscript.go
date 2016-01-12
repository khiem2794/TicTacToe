package dbscript

import (
	"strings"

	"API_server/api/rethink"
	"API_server/domain"
	"API_server/utils/logs"

	"github.com/dancannon/gorethink"
)

var l = logs.New("dbscript")

const (
	WIN_INDEX  = "win"
	NAME_INDEX = "name"
)

type RethinkScript struct {
	re     *rethink.Instance
	dbname string
}

func NewRethinkScript(re *rethink.Instance, dbname string) *RethinkScript {
	if len(strings.TrimSpace(dbname)) == 0 {
		l.Fatalln("Empty database name")
	}
	return &RethinkScript{
		re:     re,
		dbname: dbname,
	}
}
func (this *RethinkScript) Setup() error {
	dbname := this.dbname
	err := this.re.Exec(gorethink.DB(dbname).Info())

	if err == nil {
		l.Printf("Database `%v` exists, skip creating.", dbname)
		return err
	}

	if !strings.Contains(err.Error(), "does not exist") {
		l.Printf("Error querying database `%v`: %v", dbname, err)
		return err
	}

	l.Printf("Creating database `%v`", dbname)
	err = this.re.Exec(gorethink.DBCreate(dbname))
	if err != nil {
		return err
	}

	err = this.createTableUser()
	err = this.createTableMatch()
	return err
}

func (this *RethinkScript) createTableUser() error {
	err := this.re.Exec(this.re.DB().TableCreate(domain.USER_TABLE))
	if err != nil {
		return err
	}

	l.Printf("Create index:", WIN_INDEX)
	err = this.re.Exec(this.re.Table(domain.USER_TABLE).IndexCreate(WIN_INDEX))
	if err != nil {
		return err
	}
	l.Printf("Create index:", NAME_INDEX)
	err = this.re.Exec(this.re.Table(domain.USER_TABLE).IndexCreate(NAME_INDEX))
	if err != nil {
		return err
	}

	err = this.re.Exec(this.re.Table(domain.USER_TABLE).IndexWait())
	if err != nil {
		return err
	}

	return nil
}

func (this *RethinkScript) createTableMatch() error {
	err := this.re.Exec(this.re.DB().TableCreate(domain.MATCH_TABLE))
	if err != nil {
		return err
	}
	return nil
}
