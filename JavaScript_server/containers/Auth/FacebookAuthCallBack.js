import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import * as FBAuthAction from 'redux/modules/facebookauth';
import { pushState } from 'redux-router';

@connect(
  state => ({
    loggingIn: state.facebookauth.loggingIn,
    user: state.facebookauth.user,
  }),
  {...FBAuthAction, pushState})

export default class FacebookAuth extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    loggingIn: PropTypes.bool.isRequired,
    login: PropTypes.func.isRequired,
    user: PropTypes.object,
    pushState: PropTypes.func.isRequired,
  }
  componentDidMount() {
    if (this.props.loggingIn === true && !this.props.user) {
      this.props.login(this.props.location.query.code);
    } else if (this.props.user) {
      this.props.pushState(null, '/');
    }
  }
  render() {
    const {user} = this.props;
    return (
    	<div>
  			{!user && <div>Logging in .... </div>}
  		</div>
    );
  }
}
