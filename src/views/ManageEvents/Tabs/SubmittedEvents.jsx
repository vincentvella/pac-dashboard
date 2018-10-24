import React, { Component } from 'react';
import '../../../../node_modules/react-datetime/css/react-datetime.css';
import connect from 'react-redux/es/connect/connect';
import firebase from 'firebase';
import PropTypes from 'prop-types';
import {
  Col, ListGroup, ListGroupItem, Row, Well,
} from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { ref, setUpFirebase } from '../../../api/firebase';
import EventForm from '../../../components/Forms/EventForm';
import Card from '../../../components/Card/Card';
import { setPendingEvents } from '../../../redux/actions/events';

class SubmittedEvents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: '',
    };
    this.clearSelected = this.clearSelected.bind(this);
  }

  componentWillMount() {
    if (!firebase.apps.length) {
      setUpFirebase();
    }
    ref.child('/Web/Events').once('value').then((snapshot) => {
      this.props.setPendingEvents(snapshot.val());
    });
  }

  clearSelected() {
    this.setState({ selected: '' });
    if (!firebase.apps.length) {
      setUpFirebase();
    }
    ref.child('/Web/Events').once('value').then((snapshot) => {
      this.props.setPendingEvents(snapshot.val());
    });
  }

  render() {
    const { pendingEvents, notificationSystem} = this.props;
    const { selected } = this.state;
    let eventKeys = [];
    const propKeys = Object.keys(this.props.pendingEvents);
    if (propKeys && propKeys.length && propKeys.length > 0) {
      eventKeys = propKeys;
    }

    return (
      <div className="content">
        <Row className="show-grid">
          <Col sm={8} md={4} lg={4}>
            <Card
              fill
              title="Submitted Events"
              badge={eventKeys.length}
              content={(
                <div>
                  {eventKeys.length && eventKeys.length > 0
                    ? (
                      <ListGroup>
                        {eventKeys.map((eventKey) => {
                          if (selected === eventKey) {
                            return (
                              <ListGroupItem
                                key={eventKey}
                                header={pendingEvents[eventKey].title}
                                href="#/manage-events"
                                bsStyle="info"
                                onClick={() => this.setState({ selected: eventKey })}
                              >
                                {`${new Date(pendingEvents[eventKey].startDateTime).toLocaleString()} - ${new Date(pendingEvents[eventKey].endDateTime).toLocaleString()}`}
                              </ListGroupItem>);
                          }
                          return (
                            <ListGroupItem
                              key={eventKey}
                              header={pendingEvents[eventKey].title}
                              href="#/manage-events"
                              onClick={() => this.setState({ selected: eventKey })}
                            >
                              {`${new Date(pendingEvents[eventKey].startDateTime).toLocaleString()} - ${new Date(pendingEvents[eventKey].endDateTime).toLocaleString()}`}
                            </ListGroupItem>
                          );
                        })}
                      </ListGroup>
                    ) : <Well>No pending events...</Well>}
                </div>)}
            />
          </Col>
          <Col sm={10} md={8} lg={8}>
            {selected !== '' && pendingEvents && pendingEvents[selected]
              ? (
                <EventForm
                  review
                  currentEvent={{ key: selected, ...pendingEvents[selected] }}
                  notificationSystem={notificationSystem}
                  clearSelected={this.clearSelected}
                />
              ) : (
                <Card
                  title="Select an event from the left to get started..."
                  category="If there's no events you have nothing that requires your approval."
                />
              )}
          </Col>
        </Row>
      </div>
    );
  }
}

SubmittedEvents.propTypes = {
  pendingEvents: PropTypes.shape({}),
  notificationSystem: PropTypes.func,
};

SubmittedEvents.defaultProps = {
  pendingEvents: {},
  notificationSystem: () => {},
};

const mapStateToProps = state => ({
  orgs: state.orgs.model,
  pendingEvents: state.events.model.pending,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  setPendingEvents,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SubmittedEvents);
