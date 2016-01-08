import React, {Component, PropTypes} from 'react';

export default class LogoutButton extends Component {
  static propTypes = {
    logout: PropTypes.func.isRequired
  }
  render() {
    return (
    	<div>
    		<button onClick={this.props.logout} className="btn btn-danger">LogOut</button>
    	</div>
    );
  }
}