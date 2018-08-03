import React from 'react';
import { Jumbotron } from 'reactstrap';

const Welcome = () => (
    <div>
        <Jumbotron fluid>
            <h1 className="display-3">DC2410 Coursework</h1>
            <p className="lead">This is a website to fulfil the criteria of the DC2410 Coursework</p>
        </Jumbotron>
        <p>The basic functionality is as follows:</p>
        <ul>
            <li>
                A public user can:
                <ul>
                    <li>List all event information for all events (name, description, date, picture, organiser, venue).</li>
                    <li>Register as a student user or an event organiser.</li>
                </ul>
            </li>
            <li>
                Any user can:
                <ul>
                    <li>Login.</li>
                    <li>Logout.</li>
                </ul>
            </li>
            <li>
                A student user can:
                <ul>
                    <li>List all event information by the three categories (sport/culture/other).</li>
                    <li>List all event information according to popularity.</li>
                    <li>List all event information according to dates.</li>
                    <li>View details of a specific event.</li>
                    <li>Register interest for an event.</li>
                </ul>
            </li>
            <li>
                An organiser can:
                <ul>
                    <li>Add new events.</li>
                    <li>List all of their own events.</li>
                    <li>Update their own events.</li>
                </ul>
            </li>
        </ul>
    </div>
);

export default Welcome;