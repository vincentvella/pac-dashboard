import React, { Component } from 'react';
import '../../../node_modules/react-datetime/css/react-datetime.css';
import connect from "react-redux/es/connect/connect";
import {ref, setUpFirebase} from '../../api/firebase';
import firebase from "firebase";
import EventForm from "../EventForm/EventForm";
import {Col, Grid, ListGroup, ListGroupItem, Row, Tab, Tabs, Well} from "react-bootstrap";
import Card from "../../components/Card/Card";
import {bindActionCreators} from "redux";
import {setOrgs} from "../../redux/actions/orgs";
import {setPendingEvents} from "../../redux/actions/events";

const customStyles = {
	control: base => ({
		...base,
		backgroundColor: 'white',
	}),
};

class ManageEvents extends Component {

	constructor(props) {
		super(props);
		this.state = {
			selected: '',
		}
		this.clearSelected = this.clearSelected.bind(this);
	}

	componentWillMount() {
		if (!firebase.apps.length) {
			setUpFirebase();
		}
		ref.child('/Web/Events').once('value').then((snapshot) => {
			this.props.setPendingEvents(snapshot.val());
		})
	}

	clearSelected() {
		this.setState({selected: ''});
		if (!firebase.apps.length) {
			setUpFirebase();
		}
		ref.child('/Web/Events').once('value').then((snapshot) => {
			this.props.setPendingEvents(snapshot.val());
		})
	}

	render() {
		let eventKeys = [];
		let propKeys = Object.keys(this.props.pendingEvents);
		if (propKeys && propKeys.length && propKeys.length > 0) {
			eventKeys = propKeys;
		}

		return (
			<div className="content">
				<Row>
					<Tabs defaultActiveKey={1} id="uncontrolled-tab-example" style={{paddingLeft: 20, paddingRight: 20, paddingBottom: 20}}>
						<Tab eventKey={1} title="Submitted Events" />
						<Tab eventKey={2} title="Legacy Transition" />
						{/* <Tab eventKey={3} title="Tab 3" /> */}
					</Tabs>
				</Row>
				<Row className="show-grid">
					<Col sm={8} md={4} lg={4}>
						<Card
							title="Submitted Events"
							badge={eventKeys.length}
							content={(
								<div>
									{eventKeys.length && eventKeys.length > 0 ?
										<ListGroup>
											{eventKeys.map((eventKey) => {
												if (this.state.selected === eventKey) {
													return (
														<ListGroupItem
															key={eventKey}
															header={this.props.pendingEvents[eventKey].title}
															href="#/manage-events"
															bsStyle="info"
															onClick={() => this.setState({selected: eventKey})}
														>
															{`${new Date(this.props.pendingEvents[eventKey].startDateTime).toLocaleString()} - ${new Date(this.props.pendingEvents[eventKey].endDateTime).toLocaleString()}`}
														</ListGroupItem>
													)
												}
												return (
													<ListGroupItem
														key={eventKey}
														header={this.props.pendingEvents[eventKey].title}
														href="#/manage-events"
														onClick={() => this.setState({selected: eventKey})}
													>
														{`${new Date(this.props.pendingEvents[eventKey].startDateTime).toLocaleString()} - ${new Date(this.props.pendingEvents[eventKey].endDateTime).toLocaleString()}`}
													</ListGroupItem>
												)
											})}
										</ListGroup> :
										<Well>No pending events...</Well>
									}
								</div>
							)}
						/>
					</Col>
					<Col sm={10} md={8} lg={8}>
						{this.state.selected !== '' && this.props.pendingEvents && this.props.pendingEvents[this.state.selected] ?
							<EventForm
								currentEvent={{key: this.state.selected, ...this.props.pendingEvents[this.state.selected]}}
								notificationSystem={this.props.notificationSystem}
								clearSelected={this.clearSelected}
							/> :
							<Card
								title="Select an event from the left to get started..."
								category="If there's no events you have nothing that requires your approval."
							/>
						}
					</Col>
				</Row>
			</div>
		)
	}
}

const mapStateToProps = state => ({
	orgs: state.orgs.model,
	pendingEvents: state.events.model.pending,
});

const mapDispatchToProps = dispatch => bindActionCreators({
	setPendingEvents,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ManageEvents);
