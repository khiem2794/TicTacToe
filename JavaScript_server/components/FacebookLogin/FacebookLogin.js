import React, { Component } from 'react';
import RaisedButton from 'material-ui/lib/raised-button';
import FontIcon from 'material-ui/lib/font-icon';


export default class FacebookLogin extends Component {
  render() {
    return (
    	<div>
		  	<RaisedButton linkButton={true} href="/auth/facebook" primary={true} label="Sign in" labelPosition="after">
		  		<FontIcon className="muidocs-icon-action-home" />
			</RaisedButton>
		</div>
  	);
  }
}

