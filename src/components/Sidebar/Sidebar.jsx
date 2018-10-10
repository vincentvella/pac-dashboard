import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
import HeaderLinks from '../Header/HeaderLinks.jsx';

import imagine from '../../assets/img/dancer.jpg';
import logo from '../../assets/img/pac-logo-transparent.png';

import dashboardRoutes from '../../routes/dashboard.jsx';
import { logOut } from '../../redux/actions/login';

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
    };
  }

  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? 'active' : '';
  }

  updateDimensions() {
    this.setState({ width: window.innerWidth });
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions.bind(this));
  }

  render() {
    const sidebarBackground = {
      backgroundImage: `url(${imagine})`,
    };
    return (
      <div
        id="sidebar"
        className="sidebar"
        data-color="black"
        data-image={imagine}
      >
        <div className="sidebar-background" style={sidebarBackground} />
        <div className="logo">
          <a
            href="#/dashboard"
            className="simple-text logo-mini"
          >
            <div className="logo-img">
              <img src={logo} alt="logo_image" />
            </div>
          </a>
          <a
            href="#/dashboard"
            className="simple-text logo-normal"
          >
            PACalendar
          </a>
        </div>
        <div className="sidebar-wrapper">
          <ul className="nav">
            {this.state.width <= 991 ? <HeaderLinks /> : null}
            {dashboardRoutes.map((prop, key) => {
              if (prop.authLevels.includes(this.props.permissions)) {
                console.log('WE GOT THE SIDEBAR TOO');
                if (!prop.redirect) {
                  return (
                    <li
                      className={
                        prop.upgrade
                          ? 'active active-pro'
                          : this.activeRoute(prop.path)
                      }
                      key={key}
                    >
                      <NavLink
                        to={prop.path}
                        className="nav-link"
                        activeClassName="active"
                      >
                        <i className={prop.icon} />
                        <p>{prop.name}</p>
                      </NavLink>
                    </li>
                  );
                }
              }
              return null;
            })}
          </ul>
        </div>
      </div>
    );
  }
}


Sidebar.propTypes = {
  permissions: PropTypes.number,
};

Sidebar.defaultProps = {
  permissions: 3,
};

const mapStateToProps = state => ({
  permissions: state && state.login && state.login.model && state.login.model.permissionLevel,
});

export default connect(mapStateToProps)(Sidebar);
