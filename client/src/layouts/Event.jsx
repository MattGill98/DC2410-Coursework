import dateFormat from 'dateformat';
import reactLogo from 'images/logo.svg';
import React from 'react';
import { Link, Redirect } from "react-router-dom";
import { Button, Card, CardBody, CardTitle, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import titlecase from 'title-case';

export default class Event extends React.Component {

    constructor(props) {
        super(props);

        // Store page state
        this.state = {
            eventId: props.match.params.id,
            event: {},
            modal: false,
            deleted: false
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.deleteEvent = this.deleteEvent.bind(this);
    }

    componentDidMount() {
        fetch('/api/event/' + this.state.eventId)
            .then(res => res.json())
            .then(res => this.setState({ event: res }))
            .catch(err => { console.log(err); this.setState({ deleted: true }) });
    }

    deleteEvent() {
        fetch('/api/event/' + this.state.eventId, { method: 'delete' })
            .then(res => this.setState({ deleted: true }))
            .catch(err => console.log(err));
    }

    toggleModal() {
        this.setState({
            modal: !this.state.modal
        });
    }

    render() {
        if (this.state.deleted === true) {
            return <Redirect to='/events' />
        }
        return (
            <div>
                <Button outline color="secondary" tag={Link} to="/events">All Events</Button>
                <Button outline color="danger" onClick={this.toggleModal}>Delete Event</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Delete Event</ModalHeader>
                    <ModalBody>Are you sure?</ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={this.deleteEvent}>I'm sure</Button>{' '}
                        <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>
                <Row>
                    <Col key={this.state.eventId} sm="3">
                        <Card className="text-center">
                            {
                                this.state.event.picture ?
                                    <img width="100%" src={"/api/event/" + this.state.event._id + "/picture"} alt={this.state.event.name} /> :
                                    <img width="100%" src={reactLogo} alt={this.state.event.name} />
                            }
                            <CardBody>
                                <CardTitle className="align-center">{titlecase(this.state.event.name)}</CardTitle>
                                <table className="table table-bordered">
                                    <tbody>
                                        <tr><td>Date</td><td>{dateFormat(this.state.event.date, 'dS mmmm yyyy')}</td></tr>
                                        <tr><td>Category</td><td>{this.state.event.category}</td></tr>
                                        <tr><td>Venue</td><td>{this.state.event.venue}</td></tr>
                                        <tr><td>Organiser</td><td>{this.state.event.organiser}</td></tr>
                                    </tbody>
                                </table>
                                <Button outline block color="primary" tag={Link} to={"/event/" + this.state.event._id}>View Event</Button>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}