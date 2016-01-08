package store

import "time"

type MatchStatus string

const (
	MATCH_TABLE = "match"

	STATUS_PLAYING  = MatchStatus("PLAYING")
	STATUS_FINISHED = MatchStatus("FINISHED")
)

type Match struct {
	Id          string      `gorethink:"id,omitempty"`
	Status      MatchStatus `gorethink:"status"`
	Winner      string      `gorethink:"winner,omitempty"`
	Player      [2]string   `gorethink:"player"`
	Turn        int         `gorethink:"turn"`
	CreatedTime time.Time   `gorethink:"created_time,omitempty"`
}
