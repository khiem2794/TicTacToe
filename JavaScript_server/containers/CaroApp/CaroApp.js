import React, { Component, PropTypes } from 'react';
import connectData from 'helpers/connectData';
import { isLoaded as isAuthLoaded, load as loadAuth } from 'redux/modules/facebookauth';
import {connect} from 'react-redux';
import { pushState } from 'redux-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav, NavItem } from 'react-bootstrap';
import DocumentMeta from 'react-document-meta';
import config from '../../config';

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
    const {user} = this.props;
    return (
  	<div>
      <DocumentMeta {...config.app}/>
  		{user &&
  			<div className="col-md-3">
  				<Nav bsStyle="pills" stacked>
					<LinkContainer to="/"><NavItem eventKey={1}>Home</NavItem></LinkContainer>
					<LinkContainer to="/profile"><NavItem eventKey={3}>Profile</NavItem></LinkContainer>
					<LinkContainer to="/ranking"><NavItem eventKey={4}>Ranking</NavItem></LinkContainer>
					<LinkContainer to="/spectate"><NavItem eventKey={5}>Spectate</NavItem></LinkContainer>
					<LinkContainer to="/caro"><NavItem eventKey={6}>Play</NavItem></LinkContainer>
				</Nav>
			</div>}
  		{this.props.children}
  	</div>
  	);
  }
}
