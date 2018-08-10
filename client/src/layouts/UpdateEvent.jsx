import { fetchEvent, updateEvent } from 'actions/eventActions.js';
import ButtonBar from 'components/ButtonBar.jsx';
import ErrorAlert from 'components/ErrorAlert.jsx';
import dateFormat from 'dateformat';
import React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from "react-router-dom";
import { GridLoader } from 'react-spinners';
import { Button, Col, Form, FormFeedback, FormGroup, Input, Label, Row } from 'reactstrap';

const mapStateToProps = state => {
    return {
        eventData: state.Event.eventData,

        fetching: state.Event.fetching,
        fetchError: state.Event.fetchError,

        updating: state.Event.updating,
        updated: state.Event.updated,
        updateError: state.Event.updateError
    };
};

const EventData = ({ updateEvent, visible, updateError }) => {
    if (visible === false) {
        return null;
    }

    const errorList = (updateError && updateError.errors)? updateError.errors : {};

    return (
        <div>
            <ErrorAlert error={updateError == null? null: updateError.message} id="updateErrorAlert" />
            <Row>
                <Col sm="4">
                    <Form onSubmit={updateEvent} id="eventForm">
                        <FormGroup>
                            <Label for="name">Event Name</Label>
                            <Input invalid={errorList.name} type="text" name="name" required />
                            <FormFeedback>{
                                errorList.name == null ?
                                    "Invalid name" :
                                    errorList.name.message}
                            </FormFeedback>
                        </FormGroup>
                        <FormGroup>
                            <Label for="category">Event Category</Label>
                            <Input invalid={errorList.category} type="select" name="category" required>
                                <option>sport</option>
                                <option>culture</option>
                                <option>other</option>
                            </Input>
                            <FormFeedback>{
                                errorList.category == null ?
                                    "Invalid category" :
                                    errorList.category.message}
                            </FormFeedback>
                        </FormGroup>
                        <FormGroup>
                            <Label for="description">Description</Label>
                            <Input invalid={errorList.description} type="text" name="description" />
                            <FormFeedback>{
                                errorList.description == null ?
                                    "Invalid description" :
                                    errorList.description.message}
                            </FormFeedback>
                        </FormGroup>
                        <FormGroup>
                            <Label for="date">Date</Label>
                            <Input invalid={errorList.date} type="date" name="date" required />
                            <FormFeedback>{
                                errorList.date == null ?
                                    "Invalid date" :
                                    errorList.date.message}
                            </FormFeedback>
                        </FormGroup>
                        <FormGroup>
                            <Label for="venue">Venue</Label>
                            <Input invalid={errorList.venue} type="text" name="venue" required />
                            <FormFeedback>{
                                errorList.venue == null ?
                                    "Invalid venue" :
                                    errorList.venue.message}
                            </FormFeedback>
                        </FormGroup>
                        <FormGroup>
                            <Label for="picture">Picture</Label>
                            <Input invalid={errorList.picture} type="file" name="picture" />
                            <FormFeedback>{
                                errorList.picture == null ?
                                    "Invalid picture" :
                                    errorList.picture.message}
                            </FormFeedback>
                        </FormGroup>
                        <Button outline color="warning" type="submit">Update</Button>
                    </Form>
                </Col>
            </Row>
        </div>
    );
};

class UpdateEvent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            eventID: props.match.params.id
        };
        this.startUpdate = this.startUpdate.bind(this);
    }

    startUpdate(e) {
        e.preventDefault();
        e.stopPropagation();

        var data = new FormData(document.forms.namedItem('eventForm'));
        this.props.dispatch(updateEvent(data));
    }

    componentDidUpdate() {
        const {eventData} = this.props;
        var form = document.forms.namedItem('eventForm');
        if (form) {
            form.name.value = eventData.name;
            form.category.value = eventData.category;
            form.description.value = eventData.description;
            form.date.value = dateFormat(eventData.date, 'yyyy-mm-dd');
            form.venue.value = eventData.venue;
        }
    }

    componentDidMount() {
        this.props.dispatch(fetchEvent(this.state.eventID));
    }

    render() {
        const { eventData, fetching, fetchError, updating, updated, updateError } = this.props;

        if (fetchError) {
            return <div>{fetchError}</div>
        }

        if (updated === true) {
            return <Redirect to={'/event/' + this.state.eventID} />;
        }

        return (
            <div>
                {/* Error bars */}
                <ErrorAlert error={fetchError} id="fetchErrorAlert" />

                {/* Button bar */}
                <ButtonBar>
                    <Button outline color="secondary" tag={Link} to={'/event/' + eventData._id}>Return</Button>
                </ButtonBar>

                <GridLoader color={'#95A09E'} loaderStyle={{'margin': 'auto'}} loading={updating} />

                <EventData eventData={eventData} visible={!fetching && !updating} updateError={updateError} updateEvent={this.startUpdate} />
            </div>
        );
    }
}

export default connect(mapStateToProps)(UpdateEvent);