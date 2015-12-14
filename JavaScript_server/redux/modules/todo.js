const ADD = 'ADD_TODO';
const TOGGLE = 'TOGGLE_TODO';
const SHOW_ALL = 'SHOW_ALL';
const SHOW_COMPLETED = 'SHOW_COMPLETED';
const SHOW_ACTIVE = 'SHOW_ACTIVE';

const initialState = {
  items: [],
  filter: SHOW_ALL
};

export function add(label) {
  return {
    type: ADD,
    label
  };
}

export function toggle(index) {
  return {
    type: TOGGLE,
    index
  };
}

export function filter(option) {
  return {
    type: option
  };
}

function todos(items = [], action = {}) {
  switch (action.type) {
    case ADD:
      return [...items, {
        label: action.label,
        index: items.length,
        completed: false
      }];
    case TOGGLE:
      return items.map( (item) => item.index === action.index ? Object.assign({}, item, {completed: !item.completed}) : item );
    default:
      return items;
  }
}

export default function todoApp(state = initialState, action = {}) {
  switch (action.type) {
    case ADD:
      return {
        ...state,
        items: todos(state.items, action)
      };
    case TOGGLE:
      return {
        ...state,
        items: todos(state.items, action)
      };
    case SHOW_ALL:
      return {
        ...state,
        filter: SHOW_ALL
      };
    case SHOW_COMPLETED:
      return {
        ...state,
        filter: SHOW_COMPLETED
      };
    case SHOW_ACTIVE:
      return {
        ...state,
        filter: SHOW_ACTIVE
      };
    default:
      return state;
  }
}
