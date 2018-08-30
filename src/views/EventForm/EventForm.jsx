import React, { Component } from 'react';
import {
  Grid, Row, Col, FormGroup, ControlLabel, FormControl, Radio,
} from 'react-bootstrap';
import Select from 'react-select';
import DateTimeField from 'react-datetime';
import { Card } from '../../components/Card/Card';
import { FormInputs } from '../../components/FormInputs/FormInputs';
import Button from '../../components/CustomButton/CustomButton';
import '../../../node_modules/react-datetime/css/react-datetime.css';
import connect from "react-redux/es/connect/connect";
import {ref, storageRef, setUpFirebase} from '../../api/firebase';
import firebase from "firebase";
import FileUploader from 'react-firebase-file-uploader';
import { Line } from 'rc-progress';

const customStyles = {
  control: base => ({
    ...base,
    backgroundColor: 'white',
  }),
};

class EventForm extends Component {
  constructor(props) {
    super(props);
    this.clearedState = {
      title: '',
      subtitle: '',
      description: '',
      free: 'free',
      available: 'yes',
      startDateTime: new Date(),
      endDateTime: new Date(),
      link: '',
      ticketDetails: '',
      category: [],
      orgs: [],
      location: '',
	    key: '',
	    progress: 0,
	    url: '',
	    isUploading: false,
    };
    this.initialState = {};
    if (props.currentEvent) {
	    this.initialState = {
		    ...props.currentEvent,
		    startDateTime: new Date(props.currentEvent.startDateTime),
		    endDateTime: new Date(props.currentEvent.endDateTime),
		    free: props.currentEvent.free === 0 ? 'free' : 'paid',
		    available: props.currentEvent.available === 0 ? 'yes' : 'no',
		    link: props.currentEvent.ticketLink ? props.currentEvent.ticketLink : props.currentEvent.link,
	    };
    }
    if (props.currentEvent) {
	    this.state = {
		    ...this.initialState,
	    };
    } else {
      this.state = {
        ...this.clearedState
      }
    }
	  if (!firebase.apps.length) {
		  setUpFirebase();
	  }
	  this.storageRef = storageRef;
    this.resetState = this.resetState.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleUploadError = this.handleUploadError.bind(this);
    this.handleUploadStart = this.handleUploadStart.bind(this);
    this.handleProgress = this.handleProgress.bind(this);
    this.handleUploadSuccess = this.handleUploadSuccess.bind(this);
  }

  componentWillReceiveProps(nextProps) {
  	if (nextProps.currentEvent) {
		  this.resetState().then(() => {
			  this.setState({
				  ...nextProps.currentEvent,
				  startDateTime: new Date(nextProps.currentEvent.startDateTime),
				  endDateTime: new Date(nextProps.currentEvent.endDateTime),
				  free: nextProps.currentEvent.free === 0 ? 'free' : 'paid',
				  available: nextProps.currentEvent.available === 0 ? 'yes' : 'no',
				  link: nextProps.currentEvent.ticketLink ? nextProps.currentEvent.ticketLink : nextProps.currentEvent.link,
			  })
		  });
	  }
  }

	handleUploadStart = () => this.setState({ isUploading: true, progress: 0 });

	handleProgress = progress => this.setState({ progress });

	handleUploadError = (error) => {
		this.setState({ isUploading: false });
		this.props.notificationSystem({message: 'There was an error uploading that image.', level: "error"});
	};

	handleUploadSuccess = (filename) => {
		this.setState({ progress: 100, isUploading: false });
		this.storageRef.child(filename)
			.getDownloadURL()
			.then(url => this.setState({ url: url, changed: true }));
	};

  onSubmit() {
    const {title, subtitle, description, free, available, startDateTime, endDateTime, link, ticketDetails, category, orgs, location, url,} = this.state;
    let event = {title, subtitle, description, link, ticketDetails, category, orgs, location, url,
	    free: free === 'free' ? 0 : 1,
	    available: available === 'yes' ? 0 : 1,
	    startDateTime: startDateTime.toString(),
	    endDateTime: endDateTime.toString(),
    };
	  if (!firebase.apps.length) {
		  setUpFirebase();
	  }
	  if (this.state.key === '') {
		  ref.child('Web/Events').push(event, (err) => {
			  if (err) {
				  this.props.notificationSystem({message: err, level: "error"});
			  } else {
				  this.props.notificationSystem({message: 'Event has been added successfully!', level: "success"});
			  }
		  });
	  } else if (this.state.key && this.state.key !== '') {
		  ref.child(`Web/Events/${this.state.key}`).set(event, (err) => {
			  if (err) {
				  this.props.notificationSystem({message: err, level: "error"});
			  } else {
				  this.props.notificationSystem({message: 'Event has been edited successfully!', level: "success"});
			  }
		  });
		  this.props.clearSelected();
	  } else {
		  this.props.notificationSystem({message: 'There\'s been an error saving that data.', level: "error"});
	  }
    this.resetState();
  }

  handleChange(selectedOptions, state) {
    this.setState({ [state]: selectedOptions });
  }

  async resetState() {
    await this.setState({
      ...this.clearedState,
    });
  }

  updateRadioState(e, type) {
    this.setState({ [type]: e.target.value });
  }

  render() {
    const {title, subtitle, description, free, available, startDateTime, endDateTime, link, ticketDetails, location,
	    orgs, category
    } = this.state;
    const categories = [
      { value: 'A Cappella/Vocal', label: 'A Cappella/Vocal' },
      { value: 'Dance', label: 'Dance' },
      { value: 'Theatre', label: 'Theatre' },
      { value: 'Music/Instrumental', label: 'Music/Instrumental' },
      { value: 'Writing', label: 'Writing' },
    ];
    const orgOptions = Object.keys(this.props.orgs).map((orgKey) => {
      return { value: orgKey, label: this.props.orgs[orgKey].name}
    });
    console.log('STATE', this.state);
    return (
      <div className="content">
        <Grid>
          <Row>
            <Col sm={18} md={12} lg={12}>
              <Card
                title={(this.state.key && this.state.key !== '') ? 'Edit Event' : 'New Event'}
                content={(
                  <div>
                    <FormInputs
                      ncols={['col-md-12']}
                      proprieties={[
                        {
                          label: 'Event Title',
                          type: 'text',
                          bsClass: 'form-control',
                          placeholder: 'Title',
                          value: title,
                          onChange: e => this.setState({ title: e.target.value }),
                        },
                      ]}
                    />
                    <FormInputs
                      ncols={['col-md-12']}
                      proprieties={[
                        {
                          label: 'Event Subtitle',
                          type: 'text',
                          bsClass: 'form-control',
                          placeholder: 'Subtitle',
                          value: subtitle,
                          onChange: e => this.setState({ subtitle: e.target.value }),
                        },
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
                            value={description}
                            onChange={e => this.setState({ description: e.target.value })}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <FormGroup controlId="formControlsTextarea">
                      <ControlLabel>Event Start Date/Time</ControlLabel>
                      <DateTimeField
                        onChange={newVal => this.setState({ startDateTime: newVal.toDate() })}
                        value={startDateTime}
                      />
                    </FormGroup>
                    <FormGroup controlId="formControlsTextarea">
                      <ControlLabel>Event End Date/Time</ControlLabel>
                      <DateTimeField
                        onChange={newVal => this.setState({ endDateTime: newVal.toDate() })}
                        value={endDateTime}
                      />
                    </FormGroup>
                    <FormGroup>
                      <ControlLabel>Free Event?</ControlLabel>
                      <div>
                        <Radio
                          name="radioGroup"
                          inline
                          value="free"
                          checked={free === 'free'}
                          onChange={e => this.updateRadioState(e, 'free')}
                        >
                          Yes
                        </Radio>
                        {' '}
                        <Radio
                          name="radioGroup"
                          inline
                          value="paid"
                          checked={free === 'paid'}
                          onChange={e => this.updateRadioState(e, 'free')}
                        >
                          No
                        </Radio>
                        {' '}
                      </div>
                    </FormGroup>
                    {free
                      && free === 'paid' && (
                        <div>
                          <FormGroup>
                            <ControlLabel>Tickets Available At Door?</ControlLabel>
                            <div>
                              <Radio
                                name="radioGroup1"
                                inline
                                value="yes"
                                checked={available === 'yes'}
                                onChange={e => this.updateRadioState(e, 'available')}
                              >
                                Yes
                              </Radio>
                              {' '}
                              <Radio
                                name="radioGroup1"
                                inline
                                value="no"
                                checked={available === 'no'}
                                onChange={e => this.updateRadioState(e, 'available')}
                              >
                                No
                              </Radio>
                              {' '}
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
                                  value={ticketDetails}
                                  onChange={e => this.setState({ ticketDetails: e.target.value })}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          <FormInputs
                            ncols={['col-md-12']}
                            proprieties={[
                              {
                                label: 'Ticket Link',
                                type: 'text',
                                bsClass: 'form-control',
                                placeholder: 'https://oss.ticketmaster.com/aps/psuarts/...',
                                value: link,
                                onChange: e => this.setState({ link: e.target.value }),
                              },
                            ]}
                          />
                        </div>
                    )}
                    <FormGroup>
                      <ControlLabel>Performing Organization(s)</ControlLabel>
                      <Select
                        options={orgOptions}
                        styles={customStyles}
                        isMulti
                        closeMenuOnSelect={false}
                        value={orgs}
                        onChange={selected => this.handleChange(selected, 'orgs')}
                      />
                    </FormGroup>
                    <FormGroup>
                      <ControlLabel>Category</ControlLabel>
                      <Select
                        options={categories}
                        styles={customStyles}
                        isMulti
                        closeMenuOnSelect={false}
                        value={category}
                        onChange={selected => this.handleChange(selected, 'category')}
                      />
                    </FormGroup>
                    <FormInputs
                      ncols={['col-md-12']}
                      proprieties={[
                        {
                          label: 'Location',
                          type: 'text',
                          bsClass: 'form-control',
                          placeholder: 'Add a location so people know where to show up...',
                          value: location,
                          onChange: e => this.setState({ location: e.target.value }),
                        },
                      ]}
                    />
	                  <FormGroup controlId="formControlsFile">
		                  <Col sm={4}>
			                  <ControlLabel>Image Upload</ControlLabel>
			                  <br/>
			                  <label
				                  style={{
					                  backgroundColor: 'steelblue',
					                  color: 'white',
					                  padding: 10,
					                  borderRadius: 4,
					                  cursor: 'pointer'
				                  }}
			                  >
				                  Upload an Image
				                  <FileUploader
					                  hidden
					                  randomizeFilename
					                  accept="image/*"
					                  storageRef={this.storageRef}
					                  onUploadStart={this.handleUploadStart}
					                  onUploadError={this.handleUploadError}
					                  onUploadSuccess={this.handleUploadSuccess}
					                  onProgress={this.handleProgress}
				                  />
			                  </label>
		                  </Col>
		                  <Col sm={14}>
			                  {this.state.isUploading && <p>Progress: {<Line percent={this.state.progress} strokeWidth="4" strokeColor="#D3D3D3" />}</p>}
			                  {this.state.url && <img alt=" " src={this.state.url} width="200px" height="auto" style={{ paddingBottom: '25px' }}/>}
		                  </Col>
	                  </FormGroup>
                    <Button bsStyle="primary" pullRight fill type="submit" onClick={this.onSubmit}>
	                    {(this.state.key && this.state.key !== '') ? 'Update Event' : 'Submit Event'}
                    </Button>
                    <div className="clearfix" />
                  </div>
                )}
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => ({
	orgs: state.orgs.model,
});

export default connect(mapStateToProps)(EventForm);
