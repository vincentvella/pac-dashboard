import React, { Component } from 'react';
import '../../../../node_modules/react-datetime/css/react-datetime.css';
import connect from "react-redux/es/connect/connect";
import {ref, setUpFirebase} from '../../../api/firebase';
import firebase from "firebase";
import EventForm from "../../EventForm/EventForm";
import {Col, Grid, ListGroup, ListGroupItem, Row, Tab, Tabs, Well} from "react-bootstrap";
import Card from "../../../components/Card/Card";
import {bindActionCreators} from "redux";
import {setLegacyEvents, setPendingEvents} from "../../../redux/actions/events";

const customStyles = {
	control: base => ({
		...base,
		backgroundColor: 'white',
	}),
};

class LegacyTransitioner extends Component {

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
		ref.child('/Events').once('value').then((snapshot) => {
			this.props.setLegacyEvents(snapshot.val());
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
		let propKeys = Object.keys(this.props.legacyEvents);
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
							style={{height: 200, overflowY: "scroll"}}
							content={(
								<div>
									{eventKeys.length && eventKeys.length > 0 ?
										<ListGroup>
											{eventKeys.map((eventKey) => {
												if (this.state.selected === eventKey) {
													return (
														<ListGroupItem
															key={eventKey}
															header={this.props.legacyEvents[eventKey].title}
															bsStyle="info"
														>
															<div>
																<div>
																	Subtitle: {this.props.legacyEvents[eventKey].subtitle}
																</div>
																<div>
																	Description: {this.props.legacyEvents[eventKey].description}
																</div>
																{this.props.legacyEvents[eventKey].free === true ?
																<div>
																	Free?: Yes
																</div> :
																	<div>
																		<div>
																			Tickets Available at door?: {this.props.legacyEvents[eventKey].ticketAvailability === true ? 'Yes' : 'No'}
																		</div>
																		<div>
																			Ticket Link: {this.props.legacyEvents[eventKey].ticketLink}
																		</div>
																		<div>
																			Ticket Cost: {this.props.legacyEvents[eventKey].ticketCost}
																		</div>
																	</div>
																}
																<div>
																	Location: {this.props.legacyEvents[eventKey].location}
																</div>
																<div>
																	Time: {this.props.legacyEvents[eventKey].time}
																</div>
																<div>
																	Date: {`${new Date(this.props.legacyEvents[eventKey].selectedDate).toLocaleDateString()}`}
																</div>
															</div>
														</ListGroupItem>
													)
												}
												return (
													<ListGroupItem
														key={eventKey}
														header={this.props.legacyEvents[eventKey].title}
														href="#/manage-events"
														onClick={() => this.setState({selected: eventKey})}
													>
														{`${new Date(this.props.legacyEvents[eventKey].selectedDate).toLocaleDateString()}`}
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
						{this.state.selected !== '' && this.props.legacyEvents && this.props.legacyEvents[this.state.selected] ?
							<EventForm
								currentEvent={{key: this.state.selected, ...this.props.legacyEvents[this.state.selected]}}
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
	legacyEvents: state.events.model.legacy,
});

const mapDispatchToProps = dispatch => bindActionCreators({
	setLegacyEvents,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(LegacyTransitioner);
