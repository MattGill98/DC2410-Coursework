import { sortEvents, reverseSortOrder } from 'actions/eventListActions.js';
import React from 'react';
import { connect } from 'react-redux';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';

const mapStateToProps = state => ({
    sortValue: state.EventList.sortValue
});

const mapDispatchToProps = dispatch => ({
    sortByPopularity: () => {dispatch(sortEvents('me'))},
    sortByName: () => {dispatch(sortEvents('subscribed'))},
    sortByCategory: () => {dispatch(sortEvents('sport'))},
    sortByVenue: () => {dispatch(sortEvents('culture'))},
    sortByOrganiser: () => {dispatch(sortEvents('others'))},
    reverseSortOrder: () => {dispatch(reverseSortOrder())}
});

const SortDropdown = ({sortValue, sortByPopularity, sortByName, sortByCategory, sortByVenue, sortByOrganiser}) => (
    <UncontrolledDropdown>
        <DropdownToggle caret>Sort by</DropdownToggle>
        <DropdownMenu>
            <DropdownItem onClick={e => sortByPopularity()}>Popularity</DropdownItem>
            <DropdownItem onClick={e => sortByName()}>Name</DropdownItem>
            <DropdownItem onClick={e => sortByCategory()}>Category</DropdownItem>
            <DropdownItem onClick={e => sortByVenue()}>Venue</DropdownItem>
            <DropdownItem onClick={e => sortByOrganiser()}>Organiser</DropdownItem>
        </DropdownMenu>
    </UncontrolledDropdown>
);

export default connect(mapStateToProps, mapDispatchToProps)(SortDropdown);