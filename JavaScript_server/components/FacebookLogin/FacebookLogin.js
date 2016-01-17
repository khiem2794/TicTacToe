import React, { Component } from 'react';
import RaisedButton from 'material-ui/lib/raised-button';
import FontIcon from 'material-ui/lib/font-icon';

const style = `
  .area {
    margin-top: 10%;
    font-family: "Lato",  Impact;
    font-weight: 100;
    text-align:center;
    font-size:6.5em;
    color:#fff;
    letter-spacing: -7px;
    font-weight:700;
    text-transform:uppercase;
    text-shadow:0px 0px 5px #fff,
        0px 0px 7px #fff;
  }
  @keyframes blur{
  from{
      text-shadow:0px 0px 10px #fff,
      0px 0px 10px #fff,
      0px 0px 25px #fff,
      0px 0px 25px #fff,
      0px 0px 25px #fff,
      0px 0px 25px #fff,
      0px 0px 25px #fff,
      0px 0px 25px #fff,
      0px 0px 50px #fff,
      0px 0px 50px #fff,
      0px 0px 50px #7B96B8,
      0px 0px 150px #7B96B8,
      0px 10px 100px #7B96B8,
      0px 10px 100px #7B96B8,
      0px 10px 100px #7B96B8,
      0px 10px 100px #7B96B8,
      0px -10px 100px #7B96B8,
      0px -10px 100px #7B96B8;}
}
  .fb-btn {
    text-align: center;
    margin-top: 5%;
  }
`

export default class FacebookLogin extends Component {
  render() {
    return (
    	<div className="container">
      <style dangerouslySetInnerHTML={{__html: style}} />
      <div className="area">
        CARO GAME
      </div>
      <div className="fb-btn">
  		  <RaisedButton linkButton={true} href="/auth/facebook" primary={true} label="Facebook Sign in" labelPosition="after">
  		  	<FontIcon className="muidocs-icon-action-home" />
  			</RaisedButton>
      </div>
		</div>
  	);
  }
}
