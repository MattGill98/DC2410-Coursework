import { deleteEvent, fetchEvent } from 'actions/eventActions.js';
import dateFormat from 'dateformat';
import reactLogo from 'images/logo.svg';
import React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from "react-router-dom";
import { Button, Card, CardBody, CardTitle, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import titlecase from 'title-case';

const mapStateToProps = state => {
    return {
        eventData: state.Event.eventData,
        loading: state.Event.loading,
        error: state.Event.error,
        deleting: state.Event.deleting,
        deleted: state.Event.deleted,
    };
};

class Event extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            eventID: props.match.params.id,
            modal: false
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.startDelete = this.startDelete.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(fetchEvent(this.state.eventID));
    }

    startDelete() {
        this.props.dispatch(deleteEvent(this.state.eventID));
    }

    toggleModal() {
        this.setState({
            modal: !this.state.modal
        });
    }

    render() {
        const { eventData, loading, error, deleted, deleting } = this.props;

        if (error) {
            return <div>Error!</div>
        }

        if (loading) {
            return <div>Loading...</div>
        }

        if (deleted === true) {
            return <Redirect to='/events' />
        }

        if (deleting === true) {
            return <div>Deleting...</div>
        }

        return (
            <div>
                <Button outline color="secondary" tag={Link} to="/events">All Events</Button>
                <Button outline color="danger" onClick={this.toggleModal}>Delete Event</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Delete Event</ModalHeader>
                    <ModalBody>Are you sure?</ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={this.startDelete}>I'm sure</Button>{' '}
                        <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>
                <Row>
                    <Col key={this.state.eventId} sm="3">
                        <Card className="text-center">
                            {
                                eventData.picture ?
                                    <img width="100%" src={"/api/event/" + eventData._id + "/picture"} alt={eventData.name} /> :
                                    <img width="100%" src={reactLogo} alt={eventData.name} />
                            }
                            <CardBody>
                                <CardTitle className="align-center">{titlecase(eventData.name)}</CardTitle>
                                <table className="table table-bordered">
                                    <tbody>
                                        <tr><td>Date</td><td>{dateFormat(eventData.date, 'dS mmmm yyyy')}</td></tr>
                                        <tr><td>Category</td><td>{eventData.category}</td></tr>
                                        <tr><td>Venue</td><td>{eventData.venue}</td></tr>
                                        <tr><td>Organiser</td><td>{eventData.organiser}</td></tr>
                                    </tbody>
                                </table>
                                <Button outline block color="primary" tag={Link} to={"/event/" + this.state.eventId}>View Event</Button>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default connect(mapStateToProps)(Event);