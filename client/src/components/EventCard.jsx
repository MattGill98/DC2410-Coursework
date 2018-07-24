import dateFormat from 'dateformat';
import reactLogo from 'images/logo.svg';
import React from 'react';
import { Link } from "react-router-dom";
import { Button, Card, CardBody, CardTitle } from 'reactstrap';
import titlecase from 'title-case';

export default class EventCard extends React.Component {

    constructor(props) {
        super(props);
        
        // Store page state
        this.state = {
            event: props.event
        };
    }

    render() {
        return (
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
        );
    }
}