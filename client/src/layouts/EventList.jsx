import { fetchEvents } from 'actions/eventListActions.js';
import ButtonBar from 'components/ButtonBar.jsx';
import EventCard from 'components/EventCard.jsx';
import FilterDropdown from 'components/FilterDropdown.jsx';
import SortDropdown from 'components/SortDropdown.jsx';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import {GridLoader} from 'react-spinners';

const mapStateToProps = state => {
    return {
        events: state.EventList.items,
        fetching: state.EventList.fetching,
        fetchingError: state.EventList.fetchingError
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
        const { events, fetching, fetchingError } = this.props;

        if (fetchingError) {
            return <div>Error!</div>
        }

        return (
            <div>
                <ButtonBar>
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