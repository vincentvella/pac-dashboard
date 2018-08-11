import React, {Component} from "react";
import {
	Grid,
	Row,
	Col,
	FormGroup,
	ControlLabel,
	FormControl,
	Radio,
	DropdownButton,
	MenuItem
} from "react-bootstrap";
import Select from 'react-select'
import DateTimeField from "react-datetime"

import {Card} from "../../components/Card/Card.jsx";
import {FormInputs} from "../../components/FormInputs/FormInputs.jsx";
import Button from "../../components/CustomButton/CustomButton.jsx";
import '../../../node_modules/react-datetime/css/react-datetime.css';



class AddEvent extends Component {
	constructor(props) {
		super(props);
		this.clearedState = {
			title: '',
			subtitle: '',
			description: '',
			free: 'free',
			available: 'yes',
			date: "1990-06-05",
			format: "YYYY-MM-DD",
			inputFormat: "DD/MM/YYYY",
			mode: "date"
		};
		this.state = {
			...this.clearedState,
		};
		this.resetState = this.resetState.bind(this);
	}

	resetState() {
		this.setState({
			...this.clearedState,
		})
	}

	onSubmit = () => {
		console.log({
			title: this.state.title,
			subtitle: this.state.subtitle,
			description: this.state.description,
			free: this.state.free === 'free' ? 0 : 1,
			available: this.state.available === 'yes' ? 0 : 1,
		});
		this.resetState();
	};

	updateRadioState = (e, type) => this.setState({[type]: e.target.value})

	handleChange = (newDate) => {
		console.log("newDate", newDate);
		return this.setState({date: newDate});
	}

	render() {
		const {date, format, mode, inputFormat} = this.state;

		const options = [
			{ value: 'chocolate', label: 'Chocolate' },
			{ value: 'strawberry', label: 'Strawberry' },
			{ value: 'vanilla', label: 'Vanilla' }
		];
		return (
			<div className="content">
				<Grid>
					<Row>
						<Col lgOffset={1} mdOffset={1} sm={12} md={10} lg={10}>
							<Card
								title="New Event"
								content={
									<form onSubmit={this.onSubmit}>
										<FormInputs
											ncols={["col-md-12"]}
											proprieties={[
												{
													label: "Event Title",
													type: "text",
													bsClass: "form-control",
													placeholder: "Title",
													value: this.state.title,
													onChange: (e) => this.setState({title: e.target.value})
												}
											]}
										/>
										<FormInputs
											ncols={["col-md-12"]}
											proprieties={[
												{
													label: "Event Subtitle",
													type: "text",
													bsClass: "form-control",
													placeholder: "Subtitle",
													value: this.state.subtitle,
													onChange: (e) => this.setState({subtitle: e.target.value})
												}
											]}
										/>
										<Row>
											<Col md={12}>
												<FormGroup controlId="formControlsTextarea">
													<ControlLabel>Event Description</ControlLabel>
													<FormControl
														rows="5"
														componentClass="textarea"
														bsClass="form-control"
														placeholder="Describe your event..."
														value={this.state.description}
														onChange={(e) => this.setState({description: e.target.value})}
													/>
												</FormGroup>
											</Col>
										</Row>
										<FormGroup controlId="formControlsTextarea">
											<ControlLabel>Event Start Date/Time</ControlLabel>
											<DateTimeField/>
										</FormGroup>
										<FormGroup controlId="formControlsTextarea">
											<ControlLabel>Event End Date/Time</ControlLabel>
											<DateTimeField/>
										</FormGroup>
										<FormGroup>
											<ControlLabel>Free Event?</ControlLabel>
											<div>
												<Radio name="radioGroup" inline value="free" checked={this.state.free === 'free'} onChange={(e) => this.updateRadioState(e, 'free')}>
													Yes
												</Radio>{' '}
												<Radio name="radioGroup" inline value="paid" checked={this.state.free === 'paid'} onChange={(e) => this.updateRadioState(e, 'free')}>
													No
												</Radio>{' '}
											</div>
										</FormGroup>
										{this.state.free && this.state.free === 'paid' &&
										<div>
											<FormGroup>
												<ControlLabel>Tickets Available At Door?</ControlLabel>
												<div>
													<Radio name="radioGroup1" inline value="yes" checked={this.state.available === 'yes'} onChange={(e) => this.updateRadioState(e, 'available')}>
														Yes
													</Radio>{' '}
													<Radio name="radioGroup1" inline value="no" checked={this.state.available === 'no'} onChange={(e) => this.updateRadioState(e, 'available')}>
														No
													</Radio>{' '}
												</div>
											</FormGroup>
											<Row>
												<Col md={12}>
													<FormGroup controlId="formControlsTextarea">
														<ControlLabel>Ticket Details</ControlLabel>
														<FormControl
															rows="5"
															componentClass="textarea"
															bsClass="form-control"
															placeholder="Please be as detailed as possible (children, student discounts, general admission, etc...)"
															value={this.state.description}
															onChange={(e) => this.setState({description: e.target.value})}
														/>
													</FormGroup>
												</Col>
											</Row>
											<FormInputs
												ncols={["col-md-12"]}
												proprieties={[
													{
														label: "Ticket Link",
														type: "text",
														bsClass: "form-control",
														placeholder: "https://oss.ticketmaster.com/aps/psuarts/...",
														value: this.state.subtitle,
														onChange: (e) => this.setState({subtitle: e.target.value})
													}
												]}
											/>
										</div>
										}
										<FormGroup>
											<ControlLabel>Performing Organization</ControlLabel>
												<Select options={options} styles={customStyles} isMulti closeMenuOnSelect={false}/>
										</FormGroup>
										<FormGroup>
											<ControlLabel>Category</ControlLabel>
											<Select options={options} styles={customStyles} isMulti closeMenuOnSelect={false}/>
										</FormGroup>
										<FormInputs
											ncols={["col-md-12"]}
											proprieties={[
												{
													label: "Location",
													type: "text",
													bsClass: "form-control",
													placeholder: "Add a location so people know where to show up...",
													value: this.state.subtitle,
													onChange: (e) => this.setState({subtitle: e.target.value})
												}
											]}
										/>
										<Button bsStyle="primary" pullRight fill type="submit">Submit Event</Button>
										<div className="clearfix"/>
									</form>
								}
							/>
						</Col>
					</Row>
				</Grid>
			</div>
		);
	}
}

const customStyles = {
	control: (base, state) => ({
		...base,
		backgroundColor: 'white',
	})
};

export default AddEvent;
