import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import * as todoActions from 'redux/modules/todo';

@connect(
  state => ({
    items: state.todo.items,
    currentfilter: state.todo.filter
  }),
  {...todoActions })


export default class Todo extends Component {
  static propTypes = {
    items: PropTypes.array,
    currentfilter: PropTypes.string,
    add: PropTypes.func,
    toggle: PropTypes.func,
    filter: PropTypes.func
  }
  render() {
    const { items, add, toggle, filter, currentfilter } = this.props;
    return (
      <div>
        <h3>TODO</h3>
        <input type="text" ref={ node => { this._inputTodo = node; } } />
        <button onClick={ () => add(this._inputTodo.value) } >ADD</button>
        <p>
          SHOW:{'  '}
          <a onClick={ () => filter('SHOW_ALL') } style={{ 'textDecoration': currentfilter === 'SHOW_ALL' ? 'underline' : 'none' }} >ALL</a> {'  '}
          <a onClick={ () => filter('SHOW_COMPLETED') } style={{ 'textDecoration': currentfilter === 'SHOW_COMPLETED' ? 'underline' : 'none' }} >COMPLETED</a> {'  '}
          <a onClick={ () => filter('SHOW_ACTIVE') } style={{ 'textDecoration': currentfilter === 'SHOW_ACTIVE' ? 'underline' : 'none' }} >ACTIVE</a>
        </p>
        <ul>
        	{ items.map( (item, key) => {
          if (currentfilter === 'SHOW_ALL') {
            return <li style={{ 'textDecoration': item.completed ? 'line-through' : 'none' }} key={key} onClick={ () => { console.log(key); toggle(key); } } >{item.label}</li>;
          } else if (currentfilter === 'SHOW_ACTIVE' && !item.completed) {
            return <li style={{ 'textDecoration': item.completed ? 'line-through' : 'none' }} key={key} onClick={ () => { console.log(key); toggle(key); } } >{item.label}</li>;
          } else if (currentfilter === 'SHOW_COMPLETED' && item.completed) {
            return <li style={{ 'textDecoration': item.completed ? 'line-through' : 'none' }} key={key} onClick={ () => { console.log(key); toggle(key); } } >{item.label}</li>;
          }
        })}
        </ul>
      </div>
    );
  }
}

