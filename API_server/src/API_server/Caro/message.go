package Caro

const (
	START_MSG = "start"
	MOVE_MSG  = "move"
	UNKNOWN   = "unknown"
)

type Message struct {
	Msg string `json:"message"`
	Pos Cell   `json:"cell,omitempty"`
}

func getType(m Message) string {
	if m.Msg == START_MSG {
		return START_MSG
	} else if m.Msg == MOVE_MSG {
		return MOVE_MSG
	}
	return UNKNOWN
}
