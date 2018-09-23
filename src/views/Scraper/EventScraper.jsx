import { Col, Grid, Jumbotron, Row } from 'react-bootstrap';
import React, { Component } from 'react';
import axios from 'axios';
import cheerio from 'cheerio';
import firebase from 'firebase';
import { ref, setUpFirebase } from '../../api/firebase';
import Button from '../../components/CustomButton/CustomButton';


class EventScraper extends Component {
  static toHex(str) {
    let hex = '';
    for (let i = 0; i < str.length; i++) {
      hex += `${str.charCodeAt(i).toString(16)}`;
    }
    return hex.trim();
  }

  static extractListingsFromHTML(html) {
    const $ = cheerio.load(html, { xmlMode: false });
    let events = {};
    $('div.twRyoPhotoEventsItemHeader').each((i, el) => {
      events = { ...events, [i]: {} };
      events[i].timeDate = $(el).children('.twRyoPhotoEventsItemHeaderDate').text().trim(); // this is the time and date
      events[i].calendar = $(el).children('.twRyoPhotoEventsItemHeaderLocation').text().trim(); // calendar location
    });
    $('span.twRyoPhotoEventsDescription').each((i, el) => {
      events[i].title = $(el).children('a').text().trim();
    });
    $('div.twRyoPhotoEventsNotes').each((i, el) => {
      $(el).children('p').each((j, detail) => {
        if ($(detail).text() === 'More details...') {
          events[i].extraInfoLink = $(detail).children('a').attr('href');
        }
      });
      events[i].details = $(el).html();
    });
    let finalEvents = {};
    Object.keys(events).forEach((key) => {
      const event = events[key];
      const eventKey = EventScraper.toHex(event.timeDate + event.title);
      finalEvents = { ...finalEvents, [eventKey]: event };
    });
    return finalEvents;
  }

  static async makeRequest(i, j) {
    let listings;
    return axios.get(
      `https://25livepub.collegenet.com/calendars/arts-and-architecture-mixin?date=2018${i < 10 ? `0${i}` : i}${j < 10 ? `0${j}` : j}&media=print`,
      { headers: { 'content-type': 'text/html' },
      },
    )
      .then((response) => {
        if (response.status === 200) {
          const html = response.data;
          listings = { ...listings, ...EventScraper.extractListingsFromHTML(html) };
        }
        return listings;
      }).catch((err) => {
        console.log('Error in scrape request', err);
      });
  }

  constructor(props) {
    super(props);
    this.runScraper = this.runScraper.bind(this);
  }

  componentWillMount() {
    if (!firebase.apps.length) {
      setUpFirebase();
    }
  }

  async runScraper() {
    let events = {};
    const promises = [];
    for (let i = 1; i < 13; i++) {
      for (let j = 1; j < 31; j++) {
        promises.push(new Promise((resolve) => {
          EventScraper.makeRequest(i, j)
            .then((val) => {
              resolve(val);
            });
        }));
      }
    }
    await Promise.all(promises).then(async (val) => {
      let res = {};
      val.forEach((requestGroup) => {
        Object.keys(requestGroup).forEach((eventKey) => {
          res = { ...res, [eventKey]: requestGroup[eventKey] };
        });
      });
      await ref.child('/Scraped-Events/accepted').once('value').then((snapshot) => {
        const currentAcceptedEvents = snapshot.val();
        let condensedEvents = {};
        Object.keys(res).forEach((eventKey) => {
          if (!(currentAcceptedEvents && currentAcceptedEvents[eventKey])) {
            condensedEvents = {
              ...condensedEvents,
              [eventKey]: res[eventKey],
            };
          }
        });
        events = condensedEvents;
      });
    });
    console.log('EVENTS', events);
  }

  render() {
    return (
      <div className="content">
        <Grid>
          <Row>
            <Col xs={8} xsOffset={2}>
              <Jumbotron>
                <h1>Event Scraper</h1>
                <p>
                  Click the button below to start the scraping process. This could take a couple of
                  seconds so feel free to grab a cup of coffee or something in the meantime!
                </p>
                <p>
                  <Button fill bsStyle="primary" onClick={() => this.runScraper()}>Start Scraper</Button>
                </p>
              </Jumbotron>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default EventScraper;
