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
          <Paper className="row" zDepth={3} style={{ textAlign: 'center', marginBottom: 50 }}>

            <div className="grid">
              <figure className="effect-winston col-md-6 col-sm-6">
                <img src="img/23.jpg" alt="img30"/>
                <figcaption>
                  <h2>Jolly <span>Winston</span></h2>
                  <p>
                    <a href="#"><i className="fa fa-fw fa-star-o"></i></a>
                    <a href="#"><i className="fa fa-fw fa-comments-o"></i></a>
                    <a href="#"><i className="fa fa-fw fa-envelope-o"></i></a>
                  </p>
                </figcaption>
              </figure>
              <figure className="effect-winston col-md-6 col-sm-6">
                <img src="img/1.jpg" alt="img01"/>
                <figcaption>
                  <h2>Jolly <span>Winston</span></h2>
                  <p>
                    <a href="#"><i className="fa fa-fw fa-star-o"></i></a>
                    <a href="#"><i className="fa fa-fw fa-comments-o"></i></a>
                    <a href="#"><i className="fa fa-fw fa-envelope-o"></i></a>
                  </p>
                </figcaption>
              </figure>
            </div>
            <a style={{ height: 100, fontSize: 100 }} className="link link--yaku" href="#">
              <span>K</span><span>H</span><span>I</span><span>Ê</span><span>M</span>
            </a>
            <div className="grid">
              <figure className="effect-hera col-md-6 col-sm-6">
                <img src="img/3.jpg" alt="img17"/>
                <figcaption>
                  <h2><span>Hera</span></h2>
                  <p>
                    <a href="#"><i className="fa fa-fw fa-file-pdf-o"></i></a>
                    <a href="#"><i className="fa fa-fw fa-file-image-o"></i></a>
                    <a href="#"><i className="fa fa-fw fa-file-archive-o"></i></a>
                    <a href="#"><i className="fa fa-fw fa-file-code-o"></i></a>
                  </p>
                </figcaption>
              </figure>
              <figure className="effect-hera col-md-6 col-sm-6">
                <img src="img/4.jpg" alt="img25"/>
                <figcaption>
                  <h2><span>Hera</span></h2>
                  <p>
                    <a href="#"><i className="fa fa-fw fa-file-pdf-o"></i></a>
                    <a href="#"><i className="fa fa-fw fa-file-image-o"></i></a>
                    <a href="#"><i className="fa fa-fw fa-file-archive-o"></i></a>
                    <a href="#"><i className="fa fa-fw fa-file-code-o"></i></a>
                  </p>
                </figcaption>
              </figure>
            </div>

          </Paper>}
      </div>
  	);
  }
}
