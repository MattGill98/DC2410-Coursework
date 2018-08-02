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
        eventCount: state.EventList.itemCount,
        fetching: state.EventList.fetching,
        fetchingError: state.EventList.fetchingError,
        role: state.User.role
    };
};

const EventGrid = ({events}) => {
    if (!events) return null;
    
    return (
        <Row>
            {
                events.map((event) =>
                    <Col key={event._id} sm="6" lg="4">
                        <EventCard event={event} />
                    </Col>
                )
            }
        </Row>
    );
};

const EventPagination = ({pages}) => {
    if (pages === 1) {
        return null;
    }
    return (
        <nav aria-label="Page navigation example">
            <ul class="pagination justify-content-center mt-3">
                <li class="page-item">
                    <a class="page-link" href="#" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                        <span class="sr-only">Previous</span>
                    </a>
                </li>
                {
                    [...Array(pages)].map((e, i) => (<li class="page-item"><a class="page-link">{i + 1}</a></li>))
                }
                <li class="page-item">
                    <a class="page-link" href="#" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                        <span class="sr-only">Next</span>
                    </a>
                </li>
            </ul>
        </nav>
    );
};

class EventList extends React.Component {

    componentDidMount() {
        this.props.dispatch(fetchEvents());
    }

    render() {
        const { events, eventCount, fetching, fetchingError, role } = this.props;

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

                <EventPagination style={{'margin': 'auto'}} pages={Math.ceil(eventCount / 6)} />
            </div>
        );
    }
}

export default connect(mapStateToProps)(EventList);