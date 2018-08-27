import React, { Component } from 'react';
import '../../../node_modules/react-datetime/css/react-datetime.css';
import connect from "react-redux/es/connect/connect";
import {ref, setUpFirebase} from '../../api/firebase';
import firebase from "firebase";
import EventForm from "../EventForm/EventForm";
import {Col, Grid, Row} from "react-bootstrap";
import Card from "../../components/Card/Card";

const customStyles = {
	control: base => ({
		...base,
		backgroundColor: 'white',
	}),
};

class ManageEvents extends Component {

	render() {
		return (
			<div className="content" >
					<Row className="show-grid">
						<Col smOffset={1} sm={8} md={2} lg={3}>
							<Card
								title="Submitted Events"
								content={(
									<div className="content">
										hey event list will go here
									</div>
								)}
							/>
						</Col>
						<Col  sm={10} md={10} lg={8}>
							<EventForm/>
						</Col>
					</Row>
			</div>
		)
	}
}

export default connect()(ManageEvents);
