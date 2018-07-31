import { filterEvents } from 'actions/eventListActions.js';
import React from 'react';
import { connect } from 'react-redux';
import { DropdownMenu, DropdownToggle, Input, UncontrolledDropdown } from 'reactstrap';

const mapStateToProps = state => ({
    filters: state.EventList.filters
});

const mapDispatchToProps = dispatch => ({
    filterMe: () => {dispatch(filterEvents('me'))},
    filterSubscribed: () => {dispatch(filterEvents('subscribed'))},
    filterSport: () => {dispatch(filterEvents('sport'))},
    filterCulture: () => {dispatch(filterEvents('culture'))},
    filterOthers: () => {dispatch(filterEvents('others'))}
});

const FilterDropdown = ({filters, filterMe, filterSubscribed, filterSport, filterCulture, filterOthers}) => (
    <UncontrolledDropdown>
        <DropdownToggle caret>Filter by</DropdownToggle>
        <DropdownMenu>
            <button className="dropdown-item" type="button" tabIndex="0" onClick={e => filterMe()}>
                <Input type="checkbox" checked={filters.me} onChange={e => {}}/>{' '}My Events
            </button>
            <button className="dropdown-item" type="button" tabIndex="0" onClick={e => filterSubscribed()}>
                <Input type="checkbox" checked={filters.subscribed} onChange={e => {}}/>{' '}Subscribed
            </button>
            <button className="dropdown-item" type="button" tabIndex="0" onClick={e => filterSport()}>
                <Input type="checkbox" checked={filters.sport} onChange={e => {}}/>{' '}Sport
            </button>
            <button className="dropdown-item" type="button" tabIndex="0" onClick={e => filterCulture()}>
                <Input type="checkbox" checked={filters.culture} onChange={e => {}}/>{' '}Culture
            </button>
            <button className="dropdown-item" type="button" tabIndex="0" onClick={e => filterOthers()}>
                <Input type="checkbox" checked={filters.others} onChange={e => {}}/>{' '}Others
            </button>
        </DropdownMenu>
    </UncontrolledDropdown>
);

export default connect(mapStateToProps, mapDispatchToProps)(FilterDropdown);