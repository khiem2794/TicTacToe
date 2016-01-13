import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import connectData from 'helpers/connectData';
import * as actions from 'redux/modules/data';

function fetchData(getState, dispatch) {
  const promises = [];
  promises.push(dispatch(actions.loadProfile(getState().facebookauth.user.fbid)));
  return Promise.all(promises);
}

@connectData(fetchData)
@connect(
  state => ({
  	user: state.facebookauth.user,
  	profile: state.data.profile
  })
  ,{...actions})
export default class Profile extends Component {
  static propTypes = {
  	user: PropTypes.object.isRequired,
  	profile: PropTypes.object
  };
  render() {
    return (
  		<div>
  			PROFILE PAGE
  			<p>
  				{this.props.profile}
  			</p>
  		</div>
  	);
  }
}
