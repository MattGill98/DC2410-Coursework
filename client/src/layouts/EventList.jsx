import { fetchEvents } from 'actions/eventListActions.js';
import EventCard from 'components/EventCard.jsx';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';

const mapStateToProps = state => {
    return {
        events: state.EventList.items,
        loading: state.EventList.loading,
        error: state.EventList.error
    };
};

class EventList extends React.Component {

    componentDidMount() {
        this.props.dispatch(fetchEvents());
    }

    render() {
        const { events, loading, error } = this.props;

        if (error) {
            return <div>Error!</div>
        }

        if (loading) {
            return <div>Loading...</div>
        }

        return (
            <div>
                <Button outline color="success" tag={Link} to="/events/new">New Event</Button>
                <Row>
                    {
                        events.map((event) =>
                            <Col key={event._id} sm="3">
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