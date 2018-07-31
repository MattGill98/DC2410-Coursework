import { sortEvents, reverseSortOrder } from 'actions/eventListActions.js';
import React from 'react';
import { connect } from 'react-redux';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';

const mapStateToProps = state => ({
    sortValue: state.EventList.sortValue
});

const mapDispatchToProps = dispatch => ({
    sortByPopularity: () => {dispatch(sortEvents('popularity'))},
    sortByName: () => {dispatch(sortEvents('name'))},
    sortByDate: () => {dispatch(sortEvents('date'))},
    sortByCategory: () => {dispatch(sortEvents('category'))},
    sortByVenue: () => {dispatch(sortEvents('venue'))},
    sortByOrganiser: () => {dispatch(sortEvents('organiser'))},
    reverseSortOrder: () => {dispatch(reverseSortOrder())}
});

const TickedDropdownItem = ({name, sortValue, event}) => {
    var ticked = null;
    if (sortValue === name.toLowerCase()) {
        ticked = 'dropdown-item-checked';
    }
    return (
        <DropdownItem className={ticked} onClick={e => event()}>{name}</DropdownItem>
    );
};

const SortDropdown = ({sortValue, sortByPopularity, sortByName, sortByDate, sortByCategory, sortByVenue, sortByOrganiser}) => (
    <UncontrolledDropdown>
        <DropdownToggle caret>Sort by</DropdownToggle>
        <DropdownMenu>
            <TickedDropdownItem name="Popularity" sortValue={sortValue} event={sortByPopularity} />
            <TickedDropdownItem name="Name" sortValue={sortValue} event={sortByName} />
            <TickedDropdownItem name="Date" sortValue={sortValue} event={sortByDate} />
            <TickedDropdownItem name="Category" sortValue={sortValue} event={sortByCategory} />
            <TickedDropdownItem name="Venue" sortValue={sortValue} event={sortByVenue} />
            <TickedDropdownItem name="Organiser" sortValue={sortValue} event={sortByOrganiser} />
        </DropdownMenu>
    </UncontrolledDropdown>
);

export default connect(mapStateToProps, mapDispatchToProps)(SortDropdown);