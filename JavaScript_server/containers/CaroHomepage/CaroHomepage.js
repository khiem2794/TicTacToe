import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';

@connect(
  state => ({
    user: state.facebookauth.user
  }))
export default class CaroHomepage extends Component {
  static propTypes = {
    user: PropTypes.object,
  }
  render() {
    const {user} = this.props;
    return (
      <div>
        {user &&  
          <div>
            <div>Welcome {this.props.user.name}</div>
          </div>}
      </div>
  	);
  }
}
