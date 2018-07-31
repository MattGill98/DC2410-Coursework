import { fetchEvents } from 'actions/eventListActions.js';
import ButtonBar from 'components/ButtonBar.jsx';
import EventCard from 'components/EventCard.jsx';
import FilterDropdown from 'components/FilterDropdown.jsx';
import SortDropdown from 'components/SortDropdown.jsx';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';

const mapStateToProps = state => {
    return {
        events: state.EventList.items,
        fetching: state.EventList.fetching,
        fetchingError: state.EventList.fetchingError
    };
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

        if (fetching) {
            return <div>Loading...</div>
        }

        return (
            <div style={{textAlign: "center"}}>
                <ButtonBar>
                    <Button outline color="success" tag={Link} to="/events/new">New Event</Button>
                    <FilterDropdown />
                    <SortDropdown />
                </ButtonBar>

                <Row>
                    {
                        events.map((event) =>
                            <Col key={event._id} sm="6" lg="4">
                                <EventCard event={event} />
                            </Col>
                        )
                    }
                </Row>
            </div>
        );
    }
}

export default connect(mapStateToProps)(EventList);