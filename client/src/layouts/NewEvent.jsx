import React from 'react';
import { Link, Redirect } from "react-router-dom";
import { Button, Col, Form, FormFeedback, FormGroup, Input, Label, Row } from 'reactstrap';

export default class NewEvent extends React.Component {

    constructor(props) {
        super(props);

        // Store page state
        this.state = {
            created: false,
            errors: {}
        };
        this.create = this.create.bind(this);
    }

    create(e) {
        e.preventDefault();
        e.stopPropagation();

        var data = new FormData(document.forms.namedItem('eventForm'));

        fetch('/api/events/',
            {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Accept': 'application/json'
                },
                body: data
            })
            .then(res => res.json())
            .then(res => {
                console.log(res);
                if (res.errors != null) {
                    throw res.errors;
                } else {
                    this.setState({ created: true })
                }
            })
            .catch(err => {
                console.log(err);
                this.setState({ errors: err });
            });
    }

    render() {
        if (this.state.created === true) {
            return <Redirect to='/events' />
        }
        return (
            <div>
                <Button outline color="secondary" tag={Link} to="/events">All Events</Button>
                <Row>
                    <Col sm="4">
                        <Form onSubmit={this.create} id="eventForm">
                            <FormGroup>
                                <Label for="name">Event Name</Label>
                                <Input invalid={this.state.errors.name != null} type="text" name="name" required />
                                <FormFeedback>{
                                    this.state.errors.name == null ?
                                        "Invalid name" :
                                        this.state.errors.name.message}
                                </FormFeedback>
                            </FormGroup>
                            <FormGroup>
                                <Label for="category">Event Category</Label>
                                <Input invalid={this.state.errors.category != null} type="select" name="category" required defaultValue="" onChange={this.handleFieldChange}>
                                    <option>sport</option>
                                    <option>culture</option>
                                    <option>other</option>
                                </Input>
                                <FormFeedback>{
                                    this.state.errors.category == null ?
                                        "Invalid category" :
                                        this.state.errors.category.message}
                                </FormFeedback>
                            </FormGroup>
                            <FormGroup>
                                <Label for="description">Description</Label>
                                <Input invalid={this.state.errors.description != null} type="text" name="description" />
                                <FormFeedback>{
                                    this.state.errors.description == null ?
                                        "Invalid description" :
                                        this.state.errors.description.message}
                                </FormFeedback>
                            </FormGroup>
                            <FormGroup>
                                <Label for="date">Date</Label>
                                <Input invalid={this.state.errors.date != null} type="date" name="date" required />
                                <FormFeedback>{
                                    this.state.errors.date == null ?
                                        "Invalid date" :
                                        this.state.errors.date.message}
                                </FormFeedback>
                            </FormGroup>
                            <FormGroup>
                                <Label for="venue">Venue</Label>
                                <Input invalid={this.state.errors.venue != null} type="text" name="venue" required />
                                <FormFeedback>{
                                    this.state.errors.venue == null ?
                                        "Invalid venue" :
                                        this.state.errors.venue.message}
                                </FormFeedback>
                            </FormGroup>
                            <FormGroup>
                                <Label for="picture">Picture</Label>
                                <Input invalid={this.state.errors.picture != null} type="file" name="picture" />
                                <FormFeedback>{
                                    this.state.errors.picture == null ?
                                        "Invalid picture" :
                                        this.state.errors.picture.message}
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