import moment from 'moment';
import firebase from 'firebase';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import DateTimeField from 'react-datetime';
import { bindActionCreators } from 'redux';
import { Col, ListGroup, ListGroupItem, Panel, Row, Well } from 'react-bootstrap';
import Card from '../../components/Card/Card';
import { ref, setUpFirebase } from '../../api/firebase';
import EventForm from '../../components/Forms/EventForm';
import { setMobileEvents } from '../../redux/actions/events';
import Button from '../../components/CustomButton/CustomButton';

class GodMode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: '',
      selectedDate: null,
    };
    this.resetCalendar = this.resetCalendar.bind(this);
    this.clearSelected = this.clearSelected.bind(this);
  }

  componentWillMount() {
    if (!firebase.apps.length) {
      setUpFirebase();
    }
    ref.child('/Mobile/Events').once('value').then((snapshot) => {
      this.props.setMobileEvents(snapshot.val());
    });
  }

  clearSelected() {
    this.setState({ selected: '' });
    if (!firebase.apps.length) {
      setUpFirebase();
    }
    ref.child('/Mobile/Events').once('value').then((snapshot) => {
      this.props.setMobileEvents(snapshot.val());
    });
  }

  resetCalendar() {
    this.setState({ selectedDate: null });
  }

  render() {
    const { events } = this.props;
    const { selected, selectedDate } = this.state;
    let eventKeys = [];
    if (events && Object.keys(events) && Object.keys(events).length > 0) {
      if (selectedDate) {
        eventKeys = Object.keys(events).reduce((returnedEvents, event) => {
          if (moment(new Date(events[event].startDateTime)).format('DD MM YYYY') === moment(new Date(selectedDate)).format('DD MM YYYY')) {
            returnedEvents.push(event);
          }
          return returnedEvents;
        }, []);
      } else {
        eventKeys = Object.keys(events);
      }
    }
    return (
      <div className="content">
        <Row>
          <Col sm={16} md={12} lg={12}>
            <Panel>
              <Panel.Body>
                Use the date selector to search for events
                <DateTimeField
                  input={false}
                  timeFormat={false}
                  onChange={newVal => this.setState({ selectedDate: newVal.toDate() })}
                  value={selectedDate}
                />
                <Button bsStyle="default" fill type="submit" onClick={this.resetCalendar}>
                  Reset
                </Button>
              </Panel.Body>
            </Panel>
          </Col>
        </Row>
        <Row>
          <Col sm={16} md={12} lg={12}>
            <Row className="show-grid">
              <Col sm={8} md={4} lg={4}>
                <Card
                  fill={events.length && events.length > 0}
                  title="Mobile App Events"
                  badge={eventKeys.length}
                  style={{ height: 200, overflowY: 'scroll' }}
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
                                    header={events[eventKey].title}
                                    bsStyle="info"
                                  >
                                    {`${new Date(events[eventKey].startDateTime).toLocaleDateString()}`}
                                  </ListGroupItem>
                                );
                              }
                              return (
                                <ListGroupItem
                                  key={eventKey}
                                  header={events[eventKey].title}
                                  onClick={() => {
                                    this.setState({ selected: eventKey });
                                  }}
                                >
                                  {`${new Date(events[eventKey].startDateTime).toLocaleDateString()}`}
                                </ListGroupItem>
                              );
                            })}
                          </ListGroup>
                        )
                        : <Well>No events found.</Well>
                      }
                    </div>
                  )}
                />
              </Col>
              <Col sm={10} md={8} lg={8}>
                {selected !== '' && events && events[selected]
                  ? (
                    <EventForm
                      god
                      currentEvent={{ key: selected, ...events[selected] }}
                      notificationSystem={this.props.notificationSystem}
                      clearSelected={this.clearSelected}
                    />
                  )
                  : (
                    <Card
                      title="Select an event from the left to get started..."
                      category="Keep in mind that you will be directly editing the in-app events from here."
                    />
                  )
                }
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  orgs: state.orgs.model,
  events: state.events.model.mobile,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  setMobileEvents,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(GodMode);
