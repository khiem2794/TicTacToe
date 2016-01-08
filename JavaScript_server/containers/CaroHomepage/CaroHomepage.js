import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import {LogoutButton} from 'components';
import {logout} from 'redux/modules/facebookauth';

@connect(
  state => ({
    user: state.facebookauth.user
  })
  ,{logout})
export default class CaroHomepage extends Component {
  static propTypes = {
    user: PropTypes.object,
    logout: PropTypes.func.isRequired,
  }
  render() {
    const {user} = this.props;
    return (
  	<div>
        <div>Welcome {this.props.user.name}</div>
        <LogoutButton logout={this.props.logout} />
  	</div>
  	);
  }
}
