import React, { Component } from 'react';
import '../../../node_modules/react-datetime/css/react-datetime.css';
import connect from 'react-redux/es/connect/connect';
import firebase from 'firebase';
import { Row, Tab, Tabs } from 'react-bootstrap';
import { setUpFirebase } from '../../api/firebase';
import SubmittedEvents from './Tabs/SubmittedEvents';
import LegacyTransitioner from './Tabs/LegacyTransitioner';

class ManageEvents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key: 1,
    };
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentWillMount() {
    if (!firebase.apps.length) {
      setUpFirebase();
    }
  }

  handleSelect = (key) => {
    this.setState({ key });
  };

  render() {
    const { key } = this.state;
    const { notificationSystem } = this.props;
    return (
      <div className="content">
        <Row>
          <Tabs
            id="EventOptions"
            activeKey={key}
            onSelect={this.handleSelect}
            style={{ paddingLeft: 20, paddingRight: 20, paddingBottom: 20 }}
          >
            <Tab eventKey={1} title="Submitted Events" />
            <Tab eventKey={2} title="Legacy Transition" />
          </Tabs>
        </Row>
        {key === 1 && <SubmittedEvents notificationSystem={notificationSystem} />}
        {key === 2 && <LegacyTransitioner notificationSystem={notificationSystem} />}
      </div>
    );
  }
}

export default connect()(ManageEvents);
