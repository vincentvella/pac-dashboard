/* eslint-disable no-unused-vars,no-undef */
import React, { Component } from 'react';
import ChartistGraph from 'react-chartist';
import { Grid, Row, Col } from 'react-bootstrap';
import firebase from 'firebase/app';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import Card from '../../components/Card/Card';
import { StatsCard } from '../../components/StatsCard/StatsCard';

import {
  dataSales,
  optionsSales,
  responsiveSales,
  signInLegend,
  createdLegend,
} from '../../variables/Variables';
import { ref, setUpFirebase } from '../../api/firebase';
import { setOrgs } from '../../redux/actions/orgs';
import { setMobileEvents } from "../../redux/actions/events";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: {},
    };
    this.getUserStats = this.getUserStats.bind(this);
  }

  componentWillMount() {
    if (!firebase.apps.length) {
      setUpFirebase();
    }
    ref.child('/Orgs').once('value').then((snapshot) => {
      // eslint-disable-next-line react/destructuring-assignment
      this.props.setOrgs(snapshot.val());
    });
    ref.child('/Mobile/Events').once('value').then((snapshot) => {
      this.props.setMobileEvents(snapshot.val());
    });
    this.getUserStats();
  }

  async getUserStats() {
    const rawUserData = await fetch('https://pacalendar-api.herokuapp.com/api/users-summary');
    const userData = await rawUserData.json();
    this.setState({ userData });
  }

  createLegend = (json) => {
    const legend = [];
    for (let i = 0; i < json.names.length; i++) {
      const type = `fa fa-circle text-${json.types[i]}`;
      legend.push(<i className={type} key={i} />);
      legend.push(' ');
      legend.push(json.names[i]);
    }
    return legend;
  };

  render() {
    console.log('STATE', this.state);
    const { userData } = this.state;
    let creationData = {
      labels: [],
      series: [],
    };
    let signInData = {
      labels: [],
      series: [],
    };
    if (userData) {
      if (userData.creation) {
        const series = [Object.keys(userData.creation).map(timeKey => userData.creation[timeKey])];
        creationData = {
          labels: [],
          series,
        };
      }
      if (userData.signIn) {
        const series = [Object.keys(userData.signIn).map(timeKey => userData.signIn[timeKey])];
        signInData = {
          labels: [],
          series,
        };
      }
    }
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="fa fa-facebook-square text-primary" />}
                statsText="Users"
                statsValue={userData.facebook}
                statsIcon={<i className="fa fa-calendar-o" />}
                statsIconText="Last 90 days"
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="fa fa-google-plus-square text-danger" />}
                statsText="Users"
                statsValue={userData.google}
                statsIcon={<i className="fa fa-calendar-o" />}
                statsIconText="Last 90 days"
              />
            </Col>
            <Col lg={2} sm={4}>
              <StatsCard
                bigIcon={<i className="pe-7s-graph1 text-danger" />}
                statsText="Errors"
                statsValue="0"
                statsIcon={<i className="fa fa-clock-o" />}
                statsIconText="In the last 30 days"
              />
            </Col>
            <Col lg={2} sm={3}>
              <StatsCard
                bigIcon={<i className="fa fa-apple text-default" />}
                statsText="Downloads"
                statsValue="162"
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Updated now"
              />
            </Col>
            <Col lg={2} sm={3}>
              <StatsCard
                bigIcon={<i className="fa fa-android text-success" />}
                statsText="Downloads"
                statsValue="95"
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Updated now"
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Card
                id="chartHours"
                title="Users Behavior"
                statsIcon="fa fa-calendar-o"
                stats="Last 90 days"
                category="24 Hours performance"
                content={(
                  <div className="ct-chart">
                    <ChartistGraph
                      data={creationData}
                      type="Line"
                      options={optionsSales}
                      responsiveOptions={responsiveSales}
                    />
                  </div>
                )}
                legend={
                  <div className="legend">{this.createLegend(createdLegend)}</div>
                }
              />
            </Col>
            <Col md={6}>
              <Card
                id="chartHours"
                title="Users Behavior"
                category="24 Hours performance"
                statsIcon="fa fa-calendar-o"
                stats="Last 90 days"
                content={(
                  <div className="ct-chart">
                    <ChartistGraph
                      data={signInData}
                      type="Line"
                      options={optionsSales}
                      responsiveOptions={responsiveSales}
                    />
                  </div>
                )}
                legend={
                  <div className="legend">{this.createLegend(signInLegend)}</div>
                }
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

Dashboard.propTypes = {
  setOrgs: PropTypes.func,
};

Dashboard.defaultProps = {
  setOrgs: () => {},
};

const mapDispatchToProps = dispatch => bindActionCreators({
  setOrgs,
  setMobileEvents,
}, dispatch);

export default connect(null, mapDispatchToProps)(Dashboard);
