/* eslint-disable react/no-unescaped-entities */
import { Col, ListGroup, ListGroupItem, Panel, ProgressBar, Row, Well } from 'react-bootstrap';
import React, { Component } from 'react';
import firebase from 'firebase';
import ReactHtmlParser from 'react-html-parser';
import { ref, setUpFirebase } from '../../api/firebase';
import Button from '../../components/CustomButton/CustomButton';
import Card from '../../components/Card/Card';
import EventForm from '../../components/Forms/EventForm';

class EventScraper extends Component {
  static async getScrapedEvents() {
    const snapshot = await ref.child('/Scraped-Events').once('value');
    return snapshot.val();
  }

  static condenseEvents(result, currentScrapedEvents) {
    let condensedEvents = {};
    Object.keys(result).forEach((eventKey) => {
      if (!(currentScrapedEvents && currentScrapedEvents[eventKey])) {
        condensedEvents = {
          ...condensedEvents,
          [eventKey]: result[eventKey],
        };
      }
    });
    return condensedEvents;
  }

  constructor(props) {
    super(props);
    this.state = {
      scraping: false,
      progress: 0,
      selected: '',
      events: {},
    };
    this.runScraper = this.runScraper.bind(this);
    this.makeRequest = this.makeRequest.bind(this);
    this.clearSelected = this.clearSelected.bind(this);
    this.incrementProgress = this.incrementProgress.bind(this);
  }

  componentWillMount() {
    if (!firebase.apps.length) {
      setUpFirebase();
    }
  }

  incrementProgress() {
    const { progress } = this.state;
    this.setState({ progress: progress + 1 });
  }

  async clearSelected() {
    this.setState({ selected: '' });
    if (!firebase.apps.length) {
      setUpFirebase();
    }
    const currentScrapedEvents = await EventScraper.getScrapedEvents();
    const events = EventScraper.condenseEvents(this.state.events, currentScrapedEvents);
    this.setState({ events });
  }

  async makeRequest(i, j) {
    let value = {};
    try {
      const scrapedData = await fetch(`https://pacalendar-api.herokuapp.com/api/scraper/${i}/${j}`);
      value = await scrapedData.json();
      this.incrementProgress();
    } catch (err) {
      console.error('ERROR:', err);
    }
    return value;
  }

  async runScraper() {
    const dateVariables = [];
    for (let i = 1; i < 13; i++) {
      for (let j = 1; j < 31; j++) {
        dateVariables.push({ i, j });
      }
    }
    const val = await Promise.all(
      dateVariables.map(async date => this.makeRequest(date.i, date.j)),
    );
    let result = {};
    val.forEach((requestGroup) => {
      Object.keys(requestGroup).forEach((eventKey) => {
        result = { ...result, [eventKey]: requestGroup[eventKey] };
      });
    });
    const currentScrapedEvents = await EventScraper.getScrapedEvents();
    const events = { ...EventScraper.condenseEvents(result, currentScrapedEvents) };
    this.setState({ events, scraping: false, progress: 0 });
  }

  render() {
    const {
      scraping,
      progress,
      events,
      selected,
    } = this.state;
    let eventKeys = [];
    const keys = Object.keys(events);
    if (keys && keys.length && keys.length > 0) {
      eventKeys = keys;
    }
    return (
      <div className="content">
        <Row>
          <Col sm={16} md={12} lg={12}>
            <Panel>
              <Panel.Body>
                <h1>Event Scraper</h1>
                <p>
                  Click the button below to start the scraping process. This could take a couple
                  of seconds so feel free to grab a cup of coffee or something in the meantime!
                </p>
                <p>
                  <Button
                    fill
                    bsStyle="primary"
                    disabled={scraping}
                    onClick={() => {
                      this.setState({ scraping: true, progress: 0 }, () => {
                        // Return 202 for accepted
                        this.runScraper().then(() => {
                          this.setState({ scraping: false });
                        });
                      });
                    }}
                  >
                    Start Scraper
                  </Button>
                </p>
                {scraping
                && (
                  <ProgressBar
                    striped
                    active
                    bsStyle="success"
                    now={progress / 3.6}
                  />
                )}
              </Panel.Body>
              {events && Object.keys(events).length > 0 && (
                <Panel.Body>
                  <h1>{`Found ${Object.keys(events).length} events`}</h1>
                  <p>
                    These events have been scraped from our source 25live and
                    need your attention.
                  </p>
                </Panel.Body>
              )}
            </Panel>
          </Col>
        </Row>
        <Row>
          <Col sm={16} md={12} lg={12}>
            <Row className="show-grid">
              <Col sm={8} md={4} lg={4}>
                <Card
                  fill={events.length && events.length > 0}
                  title="Scraped Events"
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
                                    <div>
                                      <div>{`Date: ${events[eventKey].timeDate}`}</div>
                                      <div>Description:</div>
                                      <div>{ReactHtmlParser(events[eventKey].details)}</div>
                                    </div>
                                  </ListGroupItem>
                                );
                              }
                              return (
                                <ListGroupItem
                                  key={eventKey}
                                  header={events[eventKey].title}
                                  href="#/scraper"
                                  onClick={() => {
                                    this.setState({ selected: eventKey });
                                  }}
                                >
                                  {`${events[eventKey].timeDate}`}
                                </ListGroupItem>
                              );
                            })}
                          </ListGroup>
                        )
                        : <Well>No scraped events - try running the scraper above by pressing the "Start Scraper" button</Well>
                      }
                    </div>
                  )}
                />
              </Col>
              <Col sm={10} md={8} lg={8}>
                {selected !== '' && events && events[selected]
                  ? (
                    <EventForm
                      scraper
                      currentEvent={{ key: selected, ...events[selected] }}
                      notificationSystem={this.props.notificationSystem}
                      clearSelected={this.clearSelected}
                    />
                  )
                  : (
                    <Card
                      title="Select an event from the left to get started..."
                      category="If there's no events you have nothing left to scrape."
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

export default EventScraper;
