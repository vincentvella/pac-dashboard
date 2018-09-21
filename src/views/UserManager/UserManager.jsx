/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import '../../../node_modules/react-datetime/css/react-datetime.css';
import connect from 'react-redux/es/connect/connect';
import firebase from 'firebase';
import PropTypes from 'prop-types';
import { Col, ListGroup, ListGroupItem, Row, Well } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { ref, setUpFirebase } from '../../api/firebase';
import Card from '../../components/Card/Card';
import { setUsers } from '../../redux/actions/users';
import UserForm from '../../components/Forms/UserForm';

class UserManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: '',
      adding: false,
    };
    this.clearSelected = this.clearSelected.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
  }

  componentWillMount() {
    if (!firebase.apps.length) {
      setUpFirebase();
    }
    ref.child('/Web/Users').once('value').then((snapshot) => {
      // eslint-disable-next-line react/destructuring-assignment
      this.props.setUsers(snapshot.val());
    });
  }

  clearSelected() {
    this.setState({ selected: '', adding: false });
  }

  handleAdd() {
    this.setState({ adding: true });
  }

  render() {
    const { users, notificationSystem } = this.props;
    const { selected, adding } = this.state;
    let userKeys = [];
    const propKeys = Object.keys(users);
    if (propKeys && propKeys.length && propKeys.length > 0) {
      userKeys = propKeys;
    }

    return (
      <div className="content">
        <Row className="show-grid">
          <Col sm={8} md={8} lg={4}>
            <Card
              fill
              add
              addFunc={this.handleAdd}
              title="Users"
              badge={userKeys.length}
              content={(
                <div>
                  {userKeys.length && userKeys.length > 0
                    ? (
                      <ListGroup>
                        {userKeys.map((userKey) => {
                          if (selected === userKey) {
                            return (
                              <ListGroupItem
                                key={userKey}
                                header={users[userKey].email}
                                href="#/manage-users"
                                bsStyle="info"
                                onClick={() => this.setState({ selected: userKey })}
                              />
                            );
                          }
                          return (
                            <ListGroupItem
                              key={userKey}
                              header={users[userKey].email}
                              href="#/manage-users"
                              onClick={() => this.setState({ selected: userKey })}
                            />
                          );
                        })}
                      </ListGroup>
                    ) : <Well>No organizations...</Well>}
                </div>
              )}
            />
          </Col>
          <Col sm={10} md={8} lg={8}>
            {selected !== '' && users && users[selected]
              ? (
                <UserForm
                  currentUser={{ key: selected, ...users[selected] }}
                  notificationSystem={notificationSystem}
                  clearSelected={this.clearSelected}
                />
              ) : (adding) ? (
                <UserForm
                  notificationSystem={notificationSystem}
                  clearSelected={this.clearSelected}
                />
              ) : (
                <Card
                  title="Select an organization's name from the left to get started..."
                />
              )}
          </Col>
        </Row>
      </div>
    );
  }
}

UserManager.propTypes = {
  notificationSystem: PropTypes.func,
};

UserManager.defaultProps = {
  notificationSystem: () => {},
};

const mapStateToProps = state => ({
  users: state.users.model,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  setUsers,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UserManager);
