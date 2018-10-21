/* eslint-disable no-undef,react/no-string-refs,react/destructuring-assignment,no-underscore-dangle,no-shadow,no-array-index-key */
import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import NotificationSystem from 'react-notification-system';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import { style } from '../../variables/Variables';
import dashboardRoutes from '../../routes/dashboard';
import authRoutes from '../../routes/auth';
import { logOut } from '../../redux/actions/login';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.deauthRoutes = this.deauthRoutes.bind(this);
    this.sendNotification = this.sendNotification.bind(this);
    this.authenticateRoutes = this.authenticateRoutes.bind(this);
    this.state = {
      _notificationSystem: null,
      authed: props.authed,
    };
  }

  componentDidMount() {
    this.setState({ _notificationSystem: this.refs.notificationSystem });
  }

  componentDidUpdate(e) {
    if (
      window.innerWidth < 993
      && e.history.location.pathname !== e.location.pathname
      && document.documentElement.className.indexOf('nav-open') !== -1
    ) {
      document.documentElement.classList.toggle('nav-open');
    }
    if (e.history.action === 'PUSH') {
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
      this.refs.mainPanel.scrollTop = 0;
    }
  }

  authenticateRoutes() {
    this.setState({
      authed: true,
    });
  }

  deauthRoutes() {
    this.setState({
      authed: false,
    });
  }

  sendNotification(notification) {
	  this.state._notificationSystem.addNotification({
		  title: <span data-notify="icon" className="pe-7s-check" />,
		  message: (<div>{notification.message}</div>),
		  level: notification.level,
		  position: 'tr',
		  autoDismiss: 15,
	  });
  }

  render() {
    const { authed } = this.state;
    const { logOut, permissions } = this.props;
    return (
      <div className="wrapper">
        <NotificationSystem ref="notificationSystem" style={style} />
        {authed && (
          <div>
            <Sidebar {...this.props} deauthenticateUser={this.deauthRoutes} logOut={logOut} />
            <div id="main-panel" className="main-panel" ref="mainPanel">
              <Header {...this.props} deauthenticateUser={this.deauthRoutes} logOut={logOut} />
              <Switch>
                {dashboardRoutes.map((prop, key) => {
                  if (prop.name === 'Notifications' && prop.authLevels.includes(permissions)) {
                    return (
                      <Route
                        path={prop.path}
                        key={key}
                        render={routeProps => (
                          <prop.component
                            {...routeProps}
                            handleClick={this.handleNotificationClick}
                          />
                        )}
                      />
                    );
                  }
                  if (prop.redirect) return <Redirect from={prop.path} to={prop.to} key={key} />;
                  if (prop.authLevels.includes(permissions)) {
                    return (
                      <Route
                        path={prop.path}
                        key={key}
                        render={routeProps => (
                          <prop.component
                            {...routeProps}
                            notificationSystem={this.sendNotification}
                            deauthenticateUser={this.deauthRoutes}
                          />
                        )}
                      />
                    );
                  }
                })}
              </Switch>
            </div>
          </div>
        )}
        {!authed && (
          <div>
            <Switch>
              {authRoutes.map((prop, key) => {
                if (prop.redirect) return <Redirect to={prop.to} key={key} />;
                return (
                  <Route
                    path={prop.path}
                    key={key}
                    render={routeProps => (
                      <prop.component
                        {...routeProps}
                        notificationSystem={this.sendNotification}
                        authenticateUser={this.authenticateRoutes}
                      />
                    )}
                  />
                );
              })}
            </Switch>
          </div>
        )}
        </div>
    );
  }
}

Dashboard.propTypes = {
  authed: PropTypes.bool,
  logOut: PropTypes.func,
  permissions: PropTypes.number,
};

Dashboard.defaultProps = {
  authed: false,
  logOut: () => {},
  permissions: 3,
};

const mapStateToProps = state => ({
  authed: state.login.authed,
  permissions: state && state.login && state.login.model && state.login.model.permissionLevel,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  logOut,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
