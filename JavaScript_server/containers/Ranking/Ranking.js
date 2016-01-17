import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import connectData from 'helpers/connectData';
import * as actions from 'redux/modules/data';

import Paper from 'material-ui/lib/paper';
import AppBar from 'material-ui/lib/app-bar';
import Avatar from 'material-ui/lib/avatar';
import Table from 'material-ui/lib/table/table';
import TableBody from 'material-ui/lib/table/table-body';
import TableFooter from 'material-ui/lib/table/table-footer';
import TableHeader from 'material-ui/lib/table/table-header';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableRowColumn from 'material-ui/lib/table/table-row-column';

function fetchData(getState, dispatch) {
  const promises = [];
  promises.push(dispatch(actions.loadRank(10)));
  return Promise.all(promises);
}

@connectData(fetchData)
@connect(
  state => ({
  	user: state.facebookauth.user,
  	rank: state.data.rank
  })
  ,{...actions})
export default class Ranking extends Component {
  static propTypes = {
  	user: PropTypes.object.isRequired,
  	rank: PropTypes.array
  };
  render() {
    const {rank} = this.props;
    return (
  		<div>
  			<Paper className="row" zDepth={3} style={{ textAlign: 'center', marginBottom: 50, paddingBottom: 50 }}>
	  			<AppBar
				  title="Caro Official Ranking"
				  titleStyle={{ textAlign: 'left'}}
				  iconClassNameLeft="muidocs-icon-action-home"/>
				<Table>
				  <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
				    <TableRow>
				      <TableHeaderColumn colSpan="1" tooltip=''></TableHeaderColumn>
				      <TableHeaderColumn colSpan="2" tooltip='User Name'>Name</TableHeaderColumn>
				      <TableHeaderColumn colSpan="1" tooltip='Total match' style={{textAlign: 'center'}}>Total match</TableHeaderColumn>
				      <TableHeaderColumn colSpan="1" tooltip='Win' style={{textAlign: 'center'}}>Win</TableHeaderColumn>
				      <TableHeaderColumn colSpan="1" tooltip='Rank' style={{textAlign: 'center'}}>Rank</TableHeaderColumn>
				    </TableRow>
				  </TableHeader>
				  <TableBody displayRowCheckbox={false} style={{ paddingLeft: 20 }}>
				    {rank.map( (user, i) => <TableRow style={ i%2===1 ? { textAlign: 'center', backgroundColor: '#2d3741' } : { textAlign: 'center', backgroundColor: '#28333d' } }>
									       <TableRowColumn colSpan="1"><Avatar src={`https://graph.facebook.com/${user.id}/picture`} /></TableRowColumn>
									       <TableRowColumn colSpan="2">{user.name}</TableRowColumn>
									       <TableRowColumn colSpan="1" style={{textAlign: 'center'}}>{user.totalmatch}</TableRowColumn>
									       <TableRowColumn colSpan="1" style={{textAlign: 'center'}}>{user.win}</TableRowColumn>
									       <TableRowColumn colSpan="1" style={{textAlign: 'center'}}>{user.rank}</TableRowColumn>
									     </TableRow>)}
				  </TableBody>
				</Table>
			</Paper>
  		</div>
  	);
  }
}
