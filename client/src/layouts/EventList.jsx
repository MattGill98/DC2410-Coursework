import { fetchEvents } from 'actions/eventListActions.js';
import ButtonBar from 'components/ButtonBar.jsx';
import ErrorAlert from 'components/ErrorAlert.jsx';
import EventCard from 'components/EventCard.jsx';
import FilterDropdown from 'components/FilterDropdown.jsx';
import SortDropdown from 'components/SortDropdown.jsx';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { GridLoader } from 'react-spinners';
import { Button, Col, Row } from 'reactstrap';

const mapStateToProps = state => {
    return {
        events: state.EventList.items,
        fetching: state.EventList.fetching,
        fetchingError: state.EventList.fetchingError,
        role: state.User.role
    };
};

const EventGrid = (props) => {
    if (!props.events) return null;
    
    return (
        <Row>
            {
                props.events.map((event) =>
                    <Col key={event._id} sm="6" lg="4">
                        <EventCard event={event} />
                    </Col>
                )
            }
        </Row>
    );
};

class EventList extends React.Component {

    componentDidMount() {
        this.props.dispatch(fetchEvents());
    }

    render() {
        const { events, fetching, fetchingError, role } = this.props;

        return (
            <div>
                <ErrorAlert error={fetchingError} id="fetchErrorAlert" />

                <ButtonBar visible={role === 'student' || role === 'organiser'}>
                    <Button outline color="success" tag={Link} to="/events/new">New Event</Button>
                    <FilterDropdown />
                    <SortDropdown />
                </ButtonBar>

                <GridLoader color={'#95A09E'} loaderStyle={{'margin': 'auto'}} loading={fetching} />

                <EventGrid events={events} />
            </div>
        );
    }
}

export default connect(mapStateToProps)(EventList);