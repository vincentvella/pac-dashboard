/* eslint-disable no-shadow */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
import { auth, getUserInfo } from '../../api/auth';
import { authUser, setUserInfo } from '../../redux/actions/login';

const imgMyimageexample = require('../../../src/assets/img/performance.jpg');

const divStyle = {
  width: '100%',
  height: '100%',
  backgroundImage: `url(${imgMyimageexample})`,
  backgroundSize: 'cover',
};

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginMessage: null,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const { authenticateUser, setUserInfo, notificationSystem, authUser } = this.props;
    auth(this.email.value, this.pw.value)
      .then((user) => {
        if (user) {
          getUserInfo(user.user.uid).then((u) => {
            setUserInfo(u);
            authUser();
            authenticateUser();
          });
        } else {
          notificationSystem({ message: 'Looks like we couldn\'t find your user information. Contact a PAC administrator for further assistance.', level: 'error' });
        }
      })
      .catch(() => {
        notificationSystem({ message: 'Invalid username/password.', level: 'error' });
      });
  }

  render() {
    const { loginMessage } = this.state;
    return (
      <div className="cComponent" style={divStyle}>
        <div className="col-sm-6 col-sm-offset-3">
          <h1 style={{ color: '#2e6da4' }}>Welcome to the PACalendar Admin Portal</h1>
          <h3 style={{ color: '#2e6da4' }}>Login</h3>
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input className="form-control" ref={email => this.email = email} placeholder="Email" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" className="form-control" placeholder="Password" ref={pw => this.pw = pw} />
            </div>
            {loginMessage
              && (
              <div className="alert alert-danger" role="alert">
                <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true" />
                <span className="sr-only">Error:</span>
                {loginMessage}
              </div>
              )
            }
            <button type="submit" className="btn btn-primary" onClick={() => this.handleSubmit}>Login</button>
          </form>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  setUserInfo: PropTypes.func,
  authenticateUser: PropTypes.func,
  notificationSystem: PropTypes.func,
  authUser: PropTypes.func,
};

Login.defaultProps = {
  setUserInfo: () => {},
  authenticateUser: () => {},
  notificationSystem: () => {},
  authUser: () => {},
};

const mapDispatchToProps = dispatch => bindActionCreators({
  setUserInfo,
  authUser,
}, dispatch);

export default connect(null, mapDispatchToProps)(Login);
