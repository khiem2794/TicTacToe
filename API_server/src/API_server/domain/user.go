package domain

import "time"

const (
	USER_TABLE = "user"
)

type User struct {
	Id             string    `gorethink:"id,omitempty"`
	Name           string    `gorethink:"name"`
	FBAc           string    `gorethink:"fbac"`
	Match          []string  `gorethink:"match,omitempty"`
	Win            int       `gorethink:"win"`
	RegisteredTime time.Time `gorethink:"registered_time,omitempty"`
}
