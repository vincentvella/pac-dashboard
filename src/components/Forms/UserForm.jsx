/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { Grid, Row, Col, FormGroup, ControlLabel, ButtonToolbar, ButtonGroup } from 'react-bootstrap';
import Select from 'react-select';
import connect from 'react-redux/es/connect/connect';
import firebase from 'firebase';
import Card from '../Card/Card';
import { FormInputs } from '../FormInputs/FormInputs';
import Button from '../CustomButton/CustomButton';
import '../../../node_modules/react-datetime/css/react-datetime.css';
import { setUpFirebase } from '../../api/firebase';

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
      email: '',
      permissionLevel: 1,
      orgs: [],
      key: '',
    };

    this.initialState = {};
    if (props.currentUser) {
      let mappedGenres = props.currentUser.orgs;
      if (props.currentUser.orgs && props.currentUser.orgs.length > 0) {
        // eslint-disable-next-line arrow-body-style,react/prop-types
        mappedGenres = props.currentUser.orgs.map((genre) => {
          return { value: genre, label: genre };
        });
      }
      this.initialState = {
        ...props.currentUser,
        genres: mappedGenres,
      };
    }
    if (props.currentUser) {
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
    this.resetState = this.resetState.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentUser) {
      this.resetState().then(() => {
        let mappedOrgs = nextProps.currentUser.orgs;
        if (nextProps.currentUser.orgs && nextProps.currentUser.orgs.length > 0) {
          // eslint-disable-next-line arrow-body-style,react/prop-types
          mappedOrgs = nextProps.currentUser.orgs.map((org) => {
            return { value: org, label: org };
          });
        }
        this.setState({
          ...nextProps.currentUser,
          orgs: mappedOrgs,
        });
      });
    }
  }


  onSubmit(e) {
    console.log(e);
  }

  handleChange(selectedOptions, state) {
    this.setState({ [state]: selectedOptions });
  }

  async resetState() {
    await this.setState({
      ...this.clearedState,
    });
  }

  render() {
    console.log(this.state);
    const {
      email,
      orgs,
      permissionLevel,
      key,
    } = this.state;
    const {
      allOrgs,
      clearSelected,
    } = this.props;
    const selectableOrgs = Object.keys(allOrgs).map(org => (
      { value: org, label: allOrgs[org].name }
    )) || [];
    return (
      <div className="content">
        <Grid>
          <Row>
            <Col sm={18} md={12} lg={10}>
              <Card
                title={(key && key !== '') ? 'Edit User' : 'New User'}
                content={(
                  <div>
                    <FormInputs
                      ncols={['col-md-12']}
                      proprieties={[
                        {
                          disabled: !!(key && key !== ''),
                          label: 'User Email',
                          type: 'text',
                          bsClass: 'form-control',
                          placeholder: 'Title',
                          value: email,
                          onChange: e => this.setState({ email: e.target.value }),
                        },
                      ]}
                    />
                    <FormGroup>
                      <ControlLabel>Permission Level</ControlLabel>
                      <ButtonToolbar>
                        <ButtonGroup>
                          <Button
                            bsStyle="primary"
                            fill={permissionLevel === 1}
                            onClick={e => this.handleChange(parseInt(e.target.value, 10), 'permissionLevel')}
                            value={1}
                          >
                            Administrator
                          </Button>
                          <Button
                            bsStyle="primary"
                            fill={permissionLevel === 2}
                            onClick={e => this.handleChange(parseInt(e.target.value, 10), 'permissionLevel')}
                            value={2}
                          >
                            User
                          </Button>
                        </ButtonGroup>
                      </ButtonToolbar>
                    </FormGroup>
                    {permissionLevel > 1
                    && (
                      <FormGroup>
                        <ControlLabel>Orgs</ControlLabel>
                        <Select
                          options={selectableOrgs}
                          styles={customStyles}
                          isMulti
                          closeMenuOnSelect={false}
                          value={orgs}
                          onChange={selected => this.handleChange(selected, 'orgs')}
                        />
                      </FormGroup>
                    )}
                    <Button bsStyle="primary" pullRight fill type="submit" onClick={this.onSubmit}>
                      {(key && key !== '') ? 'Update User' : 'Submit User'}
                    </Button>
                    <Button bsStyle="default" pullRight fill type="submit" onClick={clearSelected}>
                      Cancel
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
  allOrgs: state.orgs.model,
});

export default connect(mapStateToProps)(OrgForm);
