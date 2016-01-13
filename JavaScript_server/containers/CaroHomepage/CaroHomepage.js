import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';

import Paper from 'material-ui/lib/paper';

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
          <Paper zDepth={3} style={{ textAlign: 'center' }}>
            <p>HOMEPAGE</p>
          </Paper>}
      </div>
  	);
  }
}
