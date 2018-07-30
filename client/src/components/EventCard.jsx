import dateFormat from 'dateformat';
import reactLogo from 'images/logo.svg';
import React from 'react';
import { Link } from "react-router-dom";
import { Button, Card, CardBody, CardTitle } from 'reactstrap';
import titlecase from 'title-case';

const EventCard = ({ event }) => (
    <Card className="text-center">
        <CardBody>
            {
                event.picture ?
                    <img class="mb-2" width="100%" src={"/api/event/" + event._id + "/picture"} alt={event.name} /> :
                    <img class="mb-2" width="100%" src={reactLogo} alt={event.name} />
            }
            <CardTitle className="align-center">{titlecase(event.name)}</CardTitle>
            <table className="table table-bordered">
                <tbody>
                    <tr><td>Date</td><td>{dateFormat(event.date, 'dS mmmm yyyy')}</td></tr>
                    <tr><td>Category</td><td>{event.category}</td></tr>
                    <tr><td>Venue</td><td>{event.venue}</td></tr>
                    <tr><td>Organiser</td><td>{event.organiser}</td></tr>
                </tbody>
            </table>
            <Button outline block color="primary" tag={Link} to={"/event/" + event._id}>View Event</Button>
        </CardBody>
    </Card>
);

export default EventCard;