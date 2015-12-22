import React, { Component } from 'react';
import { Link } from 'react-router';

export default class CaroLogin extends Component {
  render() {
    return (
  		<div>
  		<Link to="/auth/facebook">
  			<button>Facebook Login</button>
  		</Link>
  		</div>
  	);
  }
}

