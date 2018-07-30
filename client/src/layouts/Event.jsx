import { subscribe, unsubscribe } from 'actions/eventActions';
import { deleteEvent, fetchEvent } from 'actions/eventActions.js';
import ButtonBar from 'components/ButtonBar.jsx';
import ErrorAlert from 'components/ErrorAlert.jsx';
import LoadingButton from 'components/LoadingButton.jsx';
import dateFormat from 'dateformat';
import reactLogo from 'images/logo.svg';
import React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from "react-router-dom";
import { Button, Card, CardBody, CardTitle, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import titlecase from 'title-case';

const mapStateToProps = state => {
    return {
        eventData: state.Event.eventData,

        fetching: state.Event.fetching,
        fetchError: state.Event.fetchError,

        deleting: state.Event.deleting,
        deleted: state.Event.deleted,
        deletionError: state.Event.deletionError,

        subscribing: state.Event.subscribing,
        subscribed: state.Event.subscribed,
        subscriptionError: state.Event.subscriptionError
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
    }

    componentDidMount() {
        this.props.dispatch(fetchEvent(this.state.eventID));
    }

    toggleModal() {
        this.setState({
            modal: !this.state.modal
        });
    }

    render() {
        const { eventData, fetching, fetchError, deleted, deleting, deletionError, subscribing, subscribed, subscriptionError } = this.props;

        if (fetching) {
            return <div>Fetching Event...</div>
        }

        if (fetchError) {
            return <div>{fetchError}</div>
        }

        if (deleted === true) {
            return <Redirect to='/events' />;
        }

        if (deleting === true) {
            return <div>Deleting Event...</div>;
        }

        // Hide the modal if deletion fails
        if (deletionError && !document.getElementById('deletionErrorAlert')) {
            this.setState({
                modal: false
            });
        }

        return (
            <div>
                {/* Error bars */}
                <ErrorAlert error={fetchError} id="fetchErrorAlert" />
                <ErrorAlert error={deletionError} id="deletionErrorAlert" />
                <ErrorAlert error={subscriptionError} id="subscriptionErrorAlert" />

                {/* Button bar */}
                <ButtonBar>
                    <Button outline color="secondary" tag={Link} to="/events">All Events</Button>
                    <LoadingButton visible={!subscribed} loading={subscribing} loadingText="Subscribing..." text="Subscribe" theme="primary" onClick={e => {this.props.dispatch(subscribe(this.state.eventID))}} />
                    <LoadingButton visible={subscribed} loading={subscribing} loadingText="Unsubscribing..." text="Unsubscribe" theme="primary" onClick={e => {this.props.dispatch(unsubscribe(this.state.eventID))}} />
                    <Button outline color="danger" onClick={this.toggleModal}>Delete Event</Button>
                </ButtonBar>

                <Modal isOpen={this.state.modal}>
                    <ModalHeader>Delete Event</ModalHeader>
                    <ModalBody>Are you sure?</ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={e => {this.props.dispatch(deleteEvent(this.state.eventID))}}>I'm sure</Button>{' '}
                        <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>

                <Row>
                    <Card className="text-center col-ms-3 col-xs-6">
                        <CardBody>
                            {
                                eventData.picture ?
                                    <img width="100%" src={"/api/event/" + eventData._id + "/picture"} alt={eventData.name} /> :
                                    <img width="100%" src={reactLogo} alt={eventData.name} />
                            }
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
                </Row>
            </div>
        );
    }
}

export default connect(mapStateToProps)(Event);