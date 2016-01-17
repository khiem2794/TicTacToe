import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import connectData from 'helpers/connectData';
import * as actions from 'redux/modules/data';

import Avatar from 'material-ui/lib/avatar';
import Paper from 'material-ui/lib/paper';
import Card from 'material-ui/lib/card/card';
import CardMedia from 'material-ui/lib/card/card-media';
import CardTitle from 'material-ui/lib/card/card-title';
import AppBar from 'material-ui/lib/app-bar';
import Table from 'material-ui/lib/table/table';
import TableBody from 'material-ui/lib/table/table-body';
import TableFooter from 'material-ui/lib/table/table-footer';
import TableHeader from 'material-ui/lib/table/table-header';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableRowColumn from 'material-ui/lib/table/table-row-column';

function fetchData(getState, dispatch) {
  const promises = [];
  promises.push(dispatch(actions.loadProfile(getState().facebookauth.user.fbid)));
  return Promise.all(promises);
}

@connectData(fetchData)
@connect(
  state => ({
  	profile: state.data.profile
  })
  ,{...actions})
export default class Profile extends Component {
  static propTypes = {
  	profile: PropTypes.object
  };
  render() {
  	const {profile} = this.props;
  	const style = {
  	  cover: {
  	  	maxHeight: 170
  	  },
  	  title: {

  	  }
  	}
    return (
  		<div>
  			<Paper className="row" zDepth={3} style={{ textAlign: 'center' }}>
	  			<Card>
				    <CardMedia>
				        <img style={style.cover} src={`/user-profile-bg.jpg`}/>
				    </CardMedia>
				    <CardTitle style={style.title}>
				    	<div className="col-md-5 col-sm-5 col-xs-5" style={{ textAlign: 'left'}}>
			    			<div className="col-md-4"><Avatar  size={80} src={`https://graph.facebook.com/${profile.id}/picture?type=large`} style={{ marginTop: -55 }} /></div>
			    			<CardTitle className="col-md-8 hidden-sm hidden-xs" style={{ fontSize: 20 }} >{profile.name}</CardTitle>
			    		</div>
			    		<div className="col-md-7 col-sm-7 col-xs-7">
			    			<div className="col-md-3 col-sm-3 col-xs-3" style={{ textAlign: 'center'}}>
				    			<h4>RANK</h4>
				    			<p>{profile.rank}</p>
				    		</div>
				    		<div className="col-md-6 col-sm-6 col-xs-6" style={{ textAlign: 'center'}}>
				    			<h4>MATCHES</h4>
				    			<p>{profile.totalmatch}</p>
				    		</div>
				    		<div className="col-md-3 col-sm-3 col-xs-3" style={{ textAlign: 'center'}}>
				    			<h4>WIN</h4>
				    			<p>{profile.win}</p>
				    		</div>
			    		</div>
			    	</CardTitle>
				</Card>
			</Paper>
			<Paper zDepth={3} className="row" style={{ textAlign: 'center', marginTop: 25, marginBottom: 50, paddingBottom: 50 }}>
	  			<AppBar
				  title="Matches"
				  titleStyle={{ textAlign: 'left'}}
				  iconClassNameLeft="muidocs-icon-action-home"/>
				<Table>
				  <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
				    <TableRow>
				      <TableHeaderColumn colSpan="1" tooltip='Match Result'>Result</TableHeaderColumn>
				      <TableHeaderColumn colSpan="2" tooltip='Opponent Name'>Opponent</TableHeaderColumn>
				      <TableHeaderColumn colSpan="1" tooltip='Total turns' style={{textAlign: 'center'}}>Turns</TableHeaderColumn>
				      <TableHeaderColumn colSpan="2" tooltip='Time' style={{textAlign: 'center'}}>Time</TableHeaderColumn>
				    </TableRow>
				  </TableHeader>
				  <TableBody displayRowCheckbox={false}>
				    {profile.matches.map( (match) => <TableRow style={{textAlign: 'center'}}>
				        <TableRowColumn colSpan="1">
				          { match.winner === match.opponent && <Avatar size={30} color='#d50000' backgroundColor='black'><b>L</b></Avatar> }
				          { match.winner === profile.id && <Avatar size={30} color='green' backgroundColor='black'><b>W</b></Avatar> }
				        </TableRowColumn>
				        <TableRowColumn colSpan="2">{match.opponent}</TableRowColumn>
				        <TableRowColumn colSpan="1" style={{textAlign: 'center'}}>{match.turn}</TableRowColumn>
				        <TableRowColumn colSpan="2" style={{textAlign: 'center'}}>{match.time}</TableRowColumn>
				      </TableRow>)}
				  </TableBody>
				</Table>
			</Paper>
  		</div>
  	);
  }
}
