import React, {Component, PropTypes} from 'react';
import { Link } from 'react-router';

import Paper from 'material-ui/lib/paper';
import RaisedButton from 'material-ui/lib/raised-button';
import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardHeader from 'material-ui/lib/card/card-header';
import CardMedia from 'material-ui/lib/card/card-media';
import CardTitle from 'material-ui/lib/card/card-title';
import FontIcon from 'material-ui/lib/font-icon';



const style = {
  avatar: {
  	maxHeight: 200
  },
  center: {
  	textAlign: 'center'
  },
  bottom: {
  	marginBottom: 50
  },
  padding: {
  	paddingLeft: 0,
    paddingRight: 0
  }
};

export default class ProfileBox extends Component {
  static propTypes = {
  	user: PropTypes.object.isRequired,
  };
  render() {
  	const {user, logout} = this.props;
  	return (
  		<div style={style.bottom}>
			<Paper zDepth={3}>
				<Card>
			    <CardMedia overlay={<CardTitle title={user.name} />}>
			      <img style={style.avatar} src={`https://graph.facebook.com/${user.fbid}/picture?type=large`}/>
			    </CardMedia>
			    <CardHeader style={{...style.center, ...style.padding}}>
			    	<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6" style={style.padding}>
			    		<Link to="/profile">
				        <RaisedButton style={style.center} linkButton={true} primary={true} label="Profile" labelPosition="after" />
						  </Link>
					  </div>
					  <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6" style={style.padding}>
				      <RaisedButton style={style.center} onClick={logout} linkButton={true} primary={true} label="Logout" labelPosition="after" />
					  </div>
			    </CardHeader>
			  </Card>
			</Paper>
		</div>
  	);
  }
}