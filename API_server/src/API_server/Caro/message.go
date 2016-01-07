package Caro

type MessageType string

const (
	START_MSG = MessageType("start")
	MOVE_MSG  = MessageType("move")
	UNKNOWN   = MessageType("unknown")
)

type Message struct {
	Msg MessageType `json:"message"`
	Pos Cell        `json:"cell,omitempty"`
}

func getType(m Message) MessageType {
	if m.Msg == START_MSG {
		return START_MSG
	} else if m.Msg == MOVE_MSG {
		return MOVE_MSG
	}
	return UNKNOWN
}
