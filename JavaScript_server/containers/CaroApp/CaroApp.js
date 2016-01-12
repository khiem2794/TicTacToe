import React, { Component, PropTypes } from 'react';
import connectData from 'helpers/connectData';
import { isLoaded as isAuthLoaded, load as loadAuth } from 'redux/modules/facebookauth';
import {connect} from 'react-redux';
import { pushState } from 'redux-router';
import { Link } from 'react-router';
import DocumentMeta from 'react-document-meta';
import config from '../../config';
import Divider from 'material-ui/lib/divider';
import Paper from 'material-ui/lib/paper';
import MenuItem from 'material-ui/lib/menus/menu-item';
import { ProfileBox } from 'components';
import {logout} from 'redux/modules/facebookauth';

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
  {pushState, logout})

export default class CaroApp extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object,
    pushState: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
  };
  componentWillReceiveProps(nextProps) {
    if (!this.props.user && nextProps.user) {
      this.props.pushState(null, '/');
    } else if (this.props.user && !nextProps.user) {
      this.props.pushState(null, '/landing');
    }
  };
  handleLogout = () => {
    this.props.logout();
  };
  render() {
    const {user} = this.props;
    const center = {
      textAlign: 'center',
    };
    return (
  	<div className="container">
      <DocumentMeta {...config.app}/>

  		{user &&
        <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
          <ProfileBox user={user} logout={this.handleLogout} />
          <Paper zDepth={3}>
            <Link to="/"><MenuItem style={center} primaryText="Home" /></Link>
            <Divider />
            <Link to="/ranking"><MenuItem style={center} primaryText="Rank" /></Link>
            <Divider />
            <Link to="/spectate"><MenuItem style={center} primaryText="Spectate" /></Link>
            <Divider />
            <Link to="/caro"><MenuItem style={center} primaryText="Play" /></Link>
          </Paper>
        </div>}

      <div className="col-lg-8 col-md-8 col-sm-8 col-xs-12">
        <Paper zDepth={3} style={center}>
          {this.props.children}
        </Paper>
      </div>
  	</div>
  	);
  }
}
