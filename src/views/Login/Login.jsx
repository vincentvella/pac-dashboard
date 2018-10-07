import React, { Component } from 'react';
import { auth, getUserInfo } from '../../api/auth';

function setErrorMsg(error) {
  return {
    loginMessage: error,
  };
}

export default class Login extends Component {
  state = { loginMessage: null }

  handleSubmit = (e) => {
    e.preventDefault()
    auth(this.email.value, this.pw.value)
      .then((user) => {
        if (user) {
          console.log(user);
          getUserInfo(user.user.uid).then((u) => {
            console.log('USER INFO', u);
          });
        } else {
          console.log('MEH');
        }
      })
      .catch((error) => {
        this.setState(setErrorMsg('Invalid username/password.'))
      });
  }

  render() {
    return (
      <div className="col-sm-6 col-sm-offset-3">
        <h1> Login </h1>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input className="form-control" ref={(email) => this.email = email} placeholder="Email" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-control" placeholder="Password" ref={pw => this.pw = pw} />
          </div>
          {
            this.state.loginMessage &&
            <div className="alert alert-danger" role="alert">
              <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
              <span className="sr-only">Error:</span>
              &nbsp;{this.state.loginMessage}
            </div>
          }
          <button type="submit" className="btn btn-primary" onClick={() => this.handleSubmit}>Login</button>
        </form>
      </div>
    )
  }
}