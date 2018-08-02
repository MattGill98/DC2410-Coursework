import dateFormat from 'dateformat';
import reactLogo from 'images/logo.svg';
import React from 'react';
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import { Button, Card, CardBody, CardTitle } from 'reactstrap';
import titlecase from 'title-case';

const mapStateToProps = state => ({
    authenticated: state.User.authenticated
});

const EventPicture = ({picture, id, name}) => {
    if (!picture) {
        return <img className="mb-2" width="100%" src={reactLogo} alt={name} />
    }
    return <img className="mb-2" width="100%" src={"/api/event/" + id + "/picture"} alt={name} />
};

const ViewEventButton = ({id, visible}) => {
    if (visible === false) {
        return null;
    }
    return <Button outline block color="primary" tag={Link} to={"/event/" + id}>View Event</Button>
};

const EventCard = ({ event, authenticated }) => (
    <Card className="text-center">
        <CardBody>
            <EventPicture picture={event.picture} id={event._id} name={event.name} />
            <CardTitle className="align-center">{event.name}</CardTitle>
            <table className="table table-bordered">
                <tbody>
                    <tr><td>Date</td><td>{dateFormat(event.date, 'dS mmmm yyyy')}</td></tr>
                    <tr><td>Category</td><td>{titlecase(event.category)}</td></tr>
                    <tr><td>Venue</td><td>{titlecase(event.venue)}</td></tr>
                    <tr><td>Organiser</td><td>{event.organiser}</td></tr>
                </tbody>
            </table>
            <ViewEventButton visible={authenticated} id={event._id} />
        </CardBody>
    </Card>
);

export default connect(mapStateToProps)(EventCard);