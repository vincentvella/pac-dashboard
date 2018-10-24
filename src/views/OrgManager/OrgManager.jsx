/* eslint-disable no-nested-ternary */
import firebase from 'firebase';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Col, ListGroup, ListGroupItem, Row, Well } from 'react-bootstrap';
import Card from '../../components/Card/Card';
import { setOrgs } from '../../redux/actions/orgs';
import OrgForm from '../../components/Forms/OrgForm';
import { ref, setUpFirebase } from '../../api/firebase';
import '../../../node_modules/react-datetime/css/react-datetime.css';

class OrgManager extends Component {
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
    ref.child('/Orgs').once('value').then((snapshot) => {
      // eslint-disable-next-line react/destructuring-assignment
      this.props.setOrgs(snapshot.val());
    });
  }

  async clearSelected() {
    await this.setState({ selected: '', adding: false }, () => {
      if (!firebase.apps.length) {
        setUpFirebase();
      }
      ref.child('Orgs/').once('value').then((snapshot) => {
        // eslint-disable-next-line react/destructuring-assignment
        this.props.setOrgs(snapshot.val());
      });
    });
  }

  handleAdd() {
    this.clearSelected().then(() => {
      this.setState({ adding: true }, () => {
        if (!firebase.apps.length) {
          setUpFirebase();
        }
        ref.child('Orgs/').once('value').then((snapshot) => {
          // eslint-disable-next-line react/destructuring-assignment
          this.props.setOrgs(snapshot.val());
        });
      });
    });
  }

  render() {
    const { orgs, notificationSystem } = this.props;
    const { adding, selected } = this.state;
    let orgKeys = [];
    const propKeys = Object.keys(orgs);
    if (propKeys && propKeys.length && propKeys.length > 0) {
      orgKeys = propKeys;
    }

    return (
      <div className="content">
        <Row className="show-grid">
          <Col sm={8} md={8} lg={4}>
            <Card
              fill
              add
              addFunc={this.handleAdd}
              title="Organizations"
              badge={orgKeys.length}
              content={(
                <div>
                  {orgKeys.length && orgKeys.length > 0
                    ? (
                      <ListGroup>
                        {orgKeys.map((orgKey) => {
                          if (selected === orgKey) {
                            return (
                              <ListGroupItem
                                key={orgKey}
                                header={orgs[orgKey].name}
                                href="#/orgs"
                                bsStyle="info"
                                onClick={() => this.setState({ selected: orgKey })}
                              />
                            );
                          }
                          return (
                            <ListGroupItem
                              key={orgKey}
                              header={orgs[orgKey].name}
                              href="#/orgs"
                              onClick={() => this.setState({ selected: orgKey })}
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
            {selected !== '' && orgs && orgs[selected]
              ? (
                <OrgForm
                  currentOrg={{ key: selected, ...orgs[selected] }}
                  notificationSystem={notificationSystem}
                  clearSelected={this.clearSelected}
                />
              ) : (adding) ? (
                <OrgForm
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

OrgManager.propTypes = {
  notificationSystem: PropTypes.func,
};

OrgManager.defaultProps = {
  notificationSystem: () => {},
};

const mapStateToProps = state => ({
  orgs: state.orgs.model,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  setOrgs,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(OrgManager);
