import React, { Component, PropTypes } from 'react';

export default class CaroApp extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
  }
  render() {
    return (
  	<div>
  		<p>Welcome to CARO NHK</p>
  		{this.props.children}
  	</div>
  	);
  }
}
