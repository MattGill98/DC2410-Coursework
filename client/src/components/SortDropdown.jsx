import { reverseSortOrder, sortEvents } from 'actions/eventListActions.js';
import React from 'react';
import { connect } from 'react-redux';
import { Button, ButtonGroup, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';

const mapStateToProps = state => ({
    sortValue: state.EventList.sortValue,
    sortOrder: state.EventList.sortOrder
});

const mapDispatchToProps = dispatch => ({
    sortByPopularity: () => { dispatch(sortEvents('popularity')) },
    sortByName: () => { dispatch(sortEvents('name')) },
    sortByDate: () => { dispatch(sortEvents('date')) },
    sortByCategory: () => { dispatch(sortEvents('category')) },
    sortByVenue: () => { dispatch(sortEvents('venue')) },
    sortByOrganiser: () => { dispatch(sortEvents('organiser')) },
    resetSort: () => { dispatch(sortEvents()) },
    reverseSortOrder: () => { dispatch(reverseSortOrder()) }
});

const TickedDropdownItem = ({ name, sortValue, event }) => {
    var ticked = null;
    if (sortValue === name.toLowerCase()) {
        ticked = 'dropdown-item-checked';
    }
    return (
        <DropdownItem className={ticked} onClick={e => event()}>{name}</DropdownItem>
    );
};

const SortDropdown = ({ sortValue, sortByPopularity, sortByName, sortByDate, sortByCategory, sortByVenue, sortByOrganiser, resetSort, reverseSortOrder, sortOrder }) => (
    <ButtonGroup>
        <UncontrolledDropdown>
            <DropdownToggle caret>Sort by</DropdownToggle>
            <DropdownMenu>
                <TickedDropdownItem name="Popularity" sortValue={sortValue} event={sortByPopularity} />
                <TickedDropdownItem name="Name" sortValue={sortValue} event={sortByName} />
                <TickedDropdownItem name="Date" sortValue={sortValue} event={sortByDate} />
                <TickedDropdownItem name="Category" sortValue={sortValue} event={sortByCategory} />
                <TickedDropdownItem name="Venue" sortValue={sortValue} event={sortByVenue} />
                <TickedDropdownItem name="Organiser" sortValue={sortValue} event={sortByOrganiser} />
                <DropdownItem divider />
                <TickedDropdownItem name="Reset" event={resetSort} />
            </DropdownMenu>
        </UncontrolledDropdown>
        {sortOrder?
            <Button color="secondary" onClick={e => reverseSortOrder()}>DESC</Button>:
            <Button color="secondary" onClick={e => reverseSortOrder()}>ASC</Button>
        }
    </ButtonGroup>
);

export default connect(mapStateToProps, mapDispatchToProps)(SortDropdown);