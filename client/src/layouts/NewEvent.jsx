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

        const errorList = (creationError && creationError.errors)? creationError.errors : {};

        if (created === true) {
            return <Redirect to='/events' />
        }

        if (creating === true) {
            return <div>Creating event...</div>
        }

        return (
            <div>
                <ErrorAlert error={creationError == null? null: creationError.message} id="creationErrorAlert" />
                <Button outline color="secondary" tag={Link} to="/events">All Events</Button>
                <Row>
                    <Col sm="4">
                        <Form onSubmit={this.startCreate} id="eventForm">
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
                                <Input invalid={errorList.category} type="select" name="category" required defaultValue="" onChange={this.handleFieldChange}>
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