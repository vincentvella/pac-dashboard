import React, {Component} from "react";
import {
	Grid,
	Row,
	Col,
	FormGroup,
	ControlLabel,
	FormControl, Radio
} from "react-bootstrap";

import {Card} from "../../components/Card/Card.jsx";
import {FormInputs} from "../../components/FormInputs/FormInputs.jsx";
import Button from "../../components/CustomButton/CustomButton.jsx";


class AddEvent extends Component {
	constructor(props) {
		super(props);
		this.clearedState = {
			title: '',
			subtitle: '',
			description: '',
			free: 'free',
			available: 'yes',
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


	render() {
		console.log(this.state.free);
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
										<FormInputs
											ncols={["col-md-6", "col-md-6"]}
											proprieties={[
												{
													label: "First name",
													type: "text",
													bsClass: "form-control",
													placeholder: "First name",
													defaultValue: "Mike"
												},
												{
													label: "Last name",
													type: "text",
													bsClass: "form-control",
													placeholder: "Last name",
													defaultValue: "Andrew"
												}
											]}
										/>
										<FormInputs
											ncols={["col-md-12"]}
											proprieties={[
												{
													label: "Adress",
													type: "text",
													bsClass: "form-control",
													placeholder: "Home Adress",
													defaultValue:
														"Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09"
												}
											]}
										/>
										<FormInputs
											ncols={["col-md-4", "col-md-4", "col-md-4"]}
											proprieties={[
												{
													label: "City",
													type: "text",
													bsClass: "form-control",
													placeholder: "City",
													defaultValue: "Mike"
												},
												{
													label: "Country",
													type: "text",
													bsClass: "form-control",
													placeholder: "Country",
													defaultValue: "Andrew"
												},
												{
													label: "Postal Code",
													type: "number",
													bsClass: "form-control",
													placeholder: "ZIP Code"
												}
											]}
										/>

										<Row>
											<Col md={12}>
												<FormGroup controlId="formControlsTextarea">
													<ControlLabel>About Me</ControlLabel>
													<FormControl
														rows="5"
														componentClass="textarea"
														bsClass="form-control"
														placeholder="Here can be your description"
														defaultValue="Lamborghini Mercy, Your chick she so thirsty, I'm in that two seat Lambo."
													/>
												</FormGroup>
											</Col>
										</Row>
										<Button bsStyle="info" pullRight fill type="submit">
											Update Profile
										</Button>
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

export default AddEvent;
