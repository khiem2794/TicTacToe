package domain

import "time"

type MatchStatus string

const (
	MATCH_TABLE = "match"

	STATUS_PLAYING  = MatchStatus("PLAYING")
	STATUS_FINISHED = MatchStatus("FINISHED")
)

type Match struct {
	Id          string      `gorethink:"id,omitempty" json:"id"`
	Status      MatchStatus `gorethink:"status" json:"status"`
	Winner      string      `gorethink:"winner,omitempty" json:"winner"`
	Player      [2]string   `gorethink:"player" json:"player"`
	Turn        int         `gorethink:"turn" json:"turn"`
	CreatedTime time.Time   `gorethink:"created_time,omitempty" json:"time"`
}
