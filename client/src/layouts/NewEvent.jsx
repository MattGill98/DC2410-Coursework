import React from 'react';
import { createEvent } from 'actions/eventActions.js';
import { Link, Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import { Button, Col, Form, FormFeedback, FormGroup, Input, Label, Row } from 'reactstrap';

const mapStateToProps = state => {
    return {
        error: state.Event.error,
        creating: state.Event.creating,
        created: state.Event.created,
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
        const { error, created, creating } = this.props;

        const creationErrors = (error)? error : {};

        if (created === true) {
            return <Redirect to='/events' />
        }

        if (creating === true) {
            return <div>Deleting...</div>
        }

        return (
            <div>
                <Button outline color="secondary" tag={Link} to="/events">All Events</Button>
                <Row>
                    <Col sm="4">
                        <Form onSubmit={this.startCreate} id="eventForm">
                            <FormGroup>
                                <Label for="name">Event Name</Label>
                                <Input invalid={creationErrors.name != null} type="text" name="name" required />
                                <FormFeedback>{
                                    creationErrors.name == null ?
                                        "Invalid name" :
                                        creationErrors.name.message}
                                </FormFeedback>
                            </FormGroup>
                            <FormGroup>
                                <Label for="category">Event Category</Label>
                                <Input invalid={creationErrors.category != null} type="select" name="category" required defaultValue="" onChange={this.handleFieldChange}>
                                    <option>sport</option>
                                    <option>culture</option>
                                    <option>other</option>
                                </Input>
                                <FormFeedback>{
                                    creationErrors.category == null ?
                                        "Invalid category" :
                                        creationErrors.category.message}
                                </FormFeedback>
                            </FormGroup>
                            <FormGroup>
                                <Label for="description">Description</Label>
                                <Input invalid={creationErrors.description != null} type="text" name="description" />
                                <FormFeedback>{
                                    creationErrors.description == null ?
                                        "Invalid description" :
                                        creationErrors.description.message}
                                </FormFeedback>
                            </FormGroup>
                            <FormGroup>
                                <Label for="date">Date</Label>
                                <Input invalid={creationErrors.date != null} type="date" name="date" required />
                                <FormFeedback>{
                                    creationErrors.date == null ?
                                        "Invalid date" :
                                        creationErrors.date.message}
                                </FormFeedback>
                            </FormGroup>
                            <FormGroup>
                                <Label for="venue">Venue</Label>
                                <Input invalid={creationErrors.venue != null} type="text" name="venue" required />
                                <FormFeedback>{
                                    creationErrors.venue == null ?
                                        "Invalid venue" :
                                        creationErrors.venue.message}
                                </FormFeedback>
                            </FormGroup>
                            <FormGroup>
                                <Label for="picture">Picture</Label>
                                <Input invalid={creationErrors.picture != null} type="file" name="picture" />
                                <FormFeedback>{
                                    creationErrors.picture == null ?
                                        "Invalid picture" :
                                        creationErrors.picture.message}
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