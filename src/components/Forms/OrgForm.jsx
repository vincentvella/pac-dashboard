/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { Grid, Row, Col, FormGroup, ControlLabel } from 'react-bootstrap';
import Select from 'react-select';
import connect from 'react-redux/es/connect/connect';
import firebase from 'firebase';
import FileUploader from 'react-firebase-file-uploader';
import { Line } from 'rc-progress';
import Card from '../Card/Card';
import { FormInputs } from '../FormInputs/FormInputs';
import Button from '../CustomButton/CustomButton';
import '../../../node_modules/react-datetime/css/react-datetime.css';
import { ref, storageRef, setUpFirebase } from '../../api/firebase';
import { bindActionCreators } from "redux";
import { setOrgs } from "../../redux/actions/orgs";

const customStyles = {
  control: base => ({
    ...base,
    backgroundColor: 'white',
  }),
};

class OrgForm extends Component {
  constructor(props) {
    super(props);
    this.clearedState = {
      name: '',
      website: '',
      genres: [],
      key: '',
      progress: 0,
      imageURL: '',
      isUploading: false,
    };
    this.initialState = {};
    if (props.currentOrg) {
      let mappedGenres = props.currentOrg.genres;
      if (props.currentOrg.genres && props.currentOrg.genres.length > 0) {
        // eslint-disable-next-line arrow-body-style,react/prop-types
        mappedGenres = props.currentOrg.genres.map((genre) => {
          return { value: genre, label: genre };
        });
      }
      this.initialState = {
        ...props.currentOrg,
        genres: mappedGenres,
      };
    }
    if (props.currentOrg) {
      this.state = {
        ...this.initialState,
      };
    } else {
      this.state = {
        ...this.clearedState,
      };
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
    if (nextProps.currentOrg) {
      this.resetState().then(() => {
        let mappedGenres = nextProps.currentOrg.genres;
        if (nextProps.currentOrg.genres && nextProps.currentOrg.genres.length > 0) {
          // eslint-disable-next-line arrow-body-style,react/prop-types
          mappedGenres = nextProps.currentOrg.genres.map((genre) => {
            return { value: genre, label: genre };
          });
        }
        this.setState({
          ...nextProps.currentOrg,
          genres: mappedGenres,
        });
      });
    }
  }


  onSubmit() {
    const { name, website, imageURL, genres, key } = this.state;
    const { notificationSystem, clearSelected } = this.props;
    const orgGenres = [];
    if (genres) {
      genres.forEach((genre) => {
        orgGenres.push(genre.value);
      });
    }
    const event = { name, website, imageURL, genres: orgGenres };
    if (!firebase.apps.length) {
      setUpFirebase();
    }
    if (key === '') {
      ref.child('Orgs/').push(event, (err) => {
        if (err) {
          notificationSystem({ message: err, level: 'error' });
        } else {
          notificationSystem({ message: 'Organization has been added successfully!', level: 'success' });
        }
      });
    } else if (key && key !== '') {
      ref.child(`Orgs/${key}`).set(event, (err) => {
        if (err) {
          notificationSystem({ message: err, level: 'error' });
        } else {
          notificationSystem({ message: 'Organization has been edited successfully!', level: 'success' });
        }
      });
      clearSelected();
    } else {
      notificationSystem({ message: 'There\'s been an error saving that data.', level: 'error' });
    }
    this.resetState().then(() => {
      if (!firebase.apps.length) {
        setUpFirebase();
      }
      ref.child('Orgs/').once('value').then((snapshot) => {
        // eslint-disable-next-line react/destructuring-assignment
        this.props.setOrgs(snapshot.val());
      });
    });
  }

  handleUploadStart = () => this.setState({ isUploading: true, progress: 0 });

  handleProgress = progress => this.setState({ progress });

  handleUploadError = (error) => {
    const { notificationSystem } = this.props;
    this.setState({ isUploading: false });
    notificationSystem({ message: `There was an error uploading that image. ${error}`, level: 'error' });
  };

  handleUploadSuccess = (filename) => {
    this.setState({ progress: 100, isUploading: false });
    this.storageRef.child(filename)
      .getDownloadURL()
      .then(imageURL => this.setState({ imageURL }));
  };

  handleChange(selectedOptions, state) {
    this.setState({ [state]: selectedOptions });
  }

  async resetState() {
    await this.setState({
      ...this.clearedState,
    });
  }

  render() {
    const { clearSelected } = this.props;
    const { name, website, imageURL, genres, key, isUploading, progress } = this.state;
    const categories = [
      { value: 'A Cappella/Vocal', label: 'A Cappella/Vocal' },
      { value: 'Dance', label: 'Dance' },
      { value: 'Theatre', label: 'Theatre' },
      { value: 'Music/Instrumental', label: 'Music/Instrumental' },
      { value: 'Writing', label: 'Writing' },
    ];
    return (
      <div className="content">
        <Grid>
          <Row>
            <Col sm={18} md={12} lg={10}>
              <Card
                title={(key && key !== '') ? 'Edit Organization' : 'New Organization'}
                content={(
                  <div>
                    <div>
                      <FormInputs
                        ncols={['col-md-12']}
                        proprieties={[
                          {
                            label: 'Organization Name',
                            type: 'text',
                            bsClass: 'form-control',
                            placeholder: 'Title',
                            value: name,
                            onChange: e => this.setState({ name: e.target.value }),
                          },
                        ]}
                      />
                      <FormInputs
                        ncols={['col-md-12']}
                        proprieties={[
                          {
                            label: 'Organization Website',
                            type: 'text',
                            bsClass: 'form-control',
                            placeholder: 'Subtitle',
                            value: website,
                            onChange: e => this.setState({ website: e.target.value }),
                          },
                        ]}
                      />
                      <FormGroup>
                        <ControlLabel>Category</ControlLabel>
                        <Select
                          options={categories}
                          styles={customStyles}
                          isMulti
                          closeMenuOnSelect={false}
                          value={genres}
                          onChange={selected => this.handleChange(selected, 'genres')}
                        />
                      </FormGroup>
                      <FormGroup controlId="formControlsFile">
                        <Col sm={4}>
                          <ControlLabel>Image Upload</ControlLabel>
                          <br />
                          <label
                            style={{
                              backgroundColor: 'steelblue',
                              color: 'white',
                              padding: 10,
                              borderRadius: 4,
                              cursor: 'pointer',
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
                          {isUploading && (
                            <p>
                              Progress:
                              {<Line percent={progress} strokeWidth="4" strokeColor="#D3D3D3" />}
                            </p>
                          )}
                          {imageURL && <img alt=" " src={imageURL} width="200px" height="auto" style={{ paddingBottom: '25px' }} />}
                        </Col>
                      </FormGroup>
                      <div className="clearfix" />
                      <Button bsStyle="primary" pullRight fill type="submit" onClick={this.onSubmit}>
                        {(key && key !== '') ? 'Update Org' : 'Create Org'}
                      </Button>
                      <Button bsStyle="default" pullRight fill type="submit" onClick={clearSelected}>
                        Cancel
                      </Button>
                      <div className="clearfix" />
                    </div>
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

const mapDispatchToProps = dispatch => bindActionCreators({
  setOrgs,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(OrgForm);
