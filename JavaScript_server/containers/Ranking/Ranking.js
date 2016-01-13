import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import connectData from 'helpers/connectData';
import * as actions from 'redux/modules/data';

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
	const style = {	
	  fixedHeader: true,
      fixedFooter: true,
      stripedRows: false,
      showRowHover: false,
      selectable: true,
      multiSelectable: false,
      enableSelectAll: false,
      deselectOnClickaway: true,
      height: '300px',
    };
    const {rank} = this.props;
    return (
  		<div>
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
			  <TableBody displayRowCheckbox={false}>
			    {rank.map( (user) => <TableRow style={{textAlign: 'center'}}>
								       <TableRowColumn colSpan="1"><Avatar src={`https://graph.facebook.com/${user.id}/picture`} /></TableRowColumn>
								       <TableRowColumn colSpan="2">{user.name}</TableRowColumn>
								       <TableRowColumn colSpan="1" style={{textAlign: 'center'}}>{user.totalmatch}</TableRowColumn>
								       <TableRowColumn colSpan="1" style={{textAlign: 'center'}}>{user.win}</TableRowColumn>
								       <TableRowColumn colSpan="1" style={{textAlign: 'center'}}>{user.rank}</TableRowColumn>
								     </TableRow>)}
			  </TableBody>
			</Table>
  		</div>
  	);
  }
}

