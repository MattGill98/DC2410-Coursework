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

const EventPicture = ({src, alt, exists}) => {
    if (exists === false) {
        src = reactLogo;
    }
    return <img className="img-fluid mb-2" style={{margin: 'auto', width: '100%', objectFit: 'cover'}} src={src} alt={alt} />
};

const ViewEventButton = ({id, visible}) => {
    if (visible === false) {
        return null;
    }
    return <Button outline block color="primary" tag={Link} to={"/event/" + id}>View Event</Button>
};

const EventCard = ({ className, event, authenticated }) => (
    <Card className={className + " text-center"}>
        <CardBody>
            <EventPicture src={"/api/event/" + event._id + "/picture"} alt={event.name} exists={event.picture} />
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