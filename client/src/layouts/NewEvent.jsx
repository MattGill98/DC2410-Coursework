import React from 'react';
import { createEvent } from 'actions/eventActions.js';
import { Link, Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import { Button, Col, Form, FormFeedback, FormGroup, Input, Label, Row } from 'reactstrap';
import ErrorAlert from 'components/ErrorAlert.jsx';

const mapStateToProps = state => {
    return {
        creating: state.Event.creating,
        created: state.Event.created,
        creationError: state.Event.creationError
    };
};

class NewEvent extends React.Component {

    constructor(props) {
        super(props);

        this.startCreate = this.startCreate.bind(this);
    }

    startCreate(e) {
        e.preventDefault();
        e.stopPropagation();

        var data = new FormData(document.forms.namedItem('eventForm'));
        this.props.dispatch(createEvent(data));
    }

    render() {
        const { creationError, created, creating } = this.props;

        const nonNullError = (creationError)? creationError : {};

        if (created === true) {
            return <Redirect to='/events' />
        }

        if (creating === true) {
            return <div>Creating event...</div>
        }

        return (
            <div>
                <ErrorAlert error={nonNullError.message} id="creationErrorAlert" />
                <Button outline color="secondary" tag={Link} to="/events">All Events</Button>
                <Row>
                    <Col sm="4">
                        <Form onSubmit={this.startCreate} id="eventForm">
                            <FormGroup>
                                <Label for="name">Event Name</Label>
                                <Input invalid={nonNullError.name} type="text" name="name" required />
                                <FormFeedback>{
                                    nonNullError.name == null ?
                                        "Invalid name" :
                                        nonNullError.name.message}
                                </FormFeedback>
                            </FormGroup>
                            <FormGroup>
                                <Label for="category">Event Category</Label>
                                <Input invalid={nonNullError.category} type="select" name="category" required defaultValue="" onChange={this.handleFieldChange}>
                                    <option>sport</option>
                                    <option>culture</option>
                                    <option>other</option>
                                </Input>
                                <FormFeedback>{
                                    nonNullError.category == null ?
                                        "Invalid category" :
                                        nonNullError.category.message}
                                </FormFeedback>
                            </FormGroup>
                            <FormGroup>
                                <Label for="description">Description</Label>
                                <Input invalid={nonNullError.description} type="text" name="description" />
                                <FormFeedback>{
                                    nonNullError.description == null ?
                                        "Invalid description" :
                                        nonNullError.description.message}
                                </FormFeedback>
                            </FormGroup>
                            <FormGroup>
                                <Label for="date">Date</Label>
                                <Input invalid={nonNullError.date} type="date" name="date" required />
                                <FormFeedback>{
                                    nonNullError.date == null ?
                                        "Invalid date" :
                                        nonNullError.date.message}
                                </FormFeedback>
                            </FormGroup>
                            <FormGroup>
                                <Label for="venue">Venue</Label>
                                <Input invalid={nonNullError.venue} type="text" name="venue" required />
                                <FormFeedback>{
                                    nonNullError.venue == null ?
                                        "Invalid venue" :
                                        nonNullError.venue.message}
                                </FormFeedback>
                            </FormGroup>
                            <FormGroup>
                                <Label for="picture">Picture</Label>
                                <Input invalid={nonNullError.picture} type="file" name="picture" />
                                <FormFeedback>{
                                    nonNullError.picture == null ?
                                        "Invalid picture" :
                                        nonNullError.picture.message}
                                </FormFeedback>
                            </FormGroup>
                            <input type="hidden" name="organiser" value="Matt Gill" />
                            <Button outline color="success" type="submit">Create</Button>
                        </Form>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default connect(mapStateToProps)(NewEvent);