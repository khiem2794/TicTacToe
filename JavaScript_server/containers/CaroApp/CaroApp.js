import React, { Component, PropTypes } from 'react';
import connectData from 'helpers/connectData';
import { isLoaded as isAuthLoaded, load as loadAuth } from 'redux/modules/facebookauth';
import {connect} from 'react-redux';
import { pushState } from 'redux-router';

function fetchData(getState, dispatch) {
  const promises = [];
  if (!getState().facebookauth.user && !isAuthLoaded(getState()) ) {
    promises.push(dispatch(loadAuth()));
  }
  return Promise.all(promises);
}

@connectData(fetchData)
@connect(
  state => ({
    user: state.facebookauth.user
  }),
  {pushState})

export default class CaroApp extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object,
    pushState: PropTypes.func.isRequired,
  }
  componentWillReceiveProps(nextProps) {
    if (!this.props.user && nextProps.user) {
      this.props.pushState(null, '/');
    }
  }
  render() {
    return (
  	<div>
  		{this.props.children}
  	</div>
  	);
  }
}
