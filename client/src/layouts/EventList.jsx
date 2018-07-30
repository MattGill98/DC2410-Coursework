import { fetchEvents } from 'actions/eventListActions.js';
import EventCard from 'components/EventCard.jsx';
import React from 'react';
import { connect } from 'react-redux';
import ButtonBar from 'components/ButtonBar.jsx';
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
                <ButtonBar>
                    <Button outline color="success" tag={Link} to="/events/new">New Event</Button>
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