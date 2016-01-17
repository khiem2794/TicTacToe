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
import Menu from 'material-ui/lib/menus/menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import { ProfileBox } from 'components';
import {logout} from 'redux/modules/facebookauth';
import Theme from 'material-ui/lib/styles/raw-themes/dark-raw-theme';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import ThemeDecorator from 'material-ui/lib/styles/theme-decorator';

Theme.palette.canvasColor = '#242f39';

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

@ThemeDecorator(ThemeManager.getMuiTheme(Theme))
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
    const caroAppStyle = require('./CaroApp.scss');
    const center = {
      textAlign: 'center',
    };
    return (
  	<div className="container">
      <DocumentMeta {...config.app}/>

  		{user &&
        <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
          <ProfileBox user={user} logout={this.handleLogout} />
          <Paper zDepth={3} style={{ marginBottom: 25 }}>
              <Link className={caroAppStyle.home} to="/"><MenuItem style={{ height: 100, paddingTop: 25 }} primaryText="HOME"></MenuItem></Link>
              <Link className={caroAppStyle.rank} to="/ranking"><MenuItem style={{ height: 100, paddingTop: 25 }} primaryText="RANK"></MenuItem></Link>
              <Link className={caroAppStyle.spectate} to="/spectate"><MenuItem style={{ height: 100, paddingTop: 25 }} primaryText="SPECTATE"></MenuItem></Link>
              <Link className={caroAppStyle.play} to="/caro"><MenuItem style={{ height: 100, paddingTop: 25 }} primaryText="PLAY"></MenuItem></Link>
          </Paper>
        </div>}

      <div className="col-lg-8 col-md-8 col-sm-8 col-xs-12">
          {this.props.children}
      </div>
  	</div>
  	);
  }
}
