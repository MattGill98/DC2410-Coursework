import { changePage, nextPage, previousPage } from 'actions/eventListActions.js';
import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';

const mapStateToProps = state => ({
    filters: state.EventList.filters,
    currentPage: state.EventList.currentPage,
});

const mapDispatchToProps = dispatch => ({
    setPage: (number) => { dispatch(changePage(number)) },
    nextPage: () => { dispatch(nextPage()) },
    previousPage: () => { dispatch(previousPage()) },
});

const PageLink = ({ text, currentPage, onClick }) => {
    var className = "";
    if (text === currentPage) {
        className = "active";
    }
    return (
        <li class={"page-item " + className}>
            <Button className="page-link" onClick={onClick}>{text}</Button>
        </li>
    );
};

const EventPagination = ({ pages, currentPage, previousPage, nextPage, setPage }) => {
    if (pages === 1) {
        return null;
    }
    return (
        <ul class="pagination justify-content-center mt-3">
            <PageLink text="&laquo;" onClick={e => previousPage()} />
            {
                [...Array(pages)].map((e, i) => <PageLink text={i + 1} currentPage={currentPage + 1} onClick={e => setPage(i)} />)
            }
            <PageLink text="&raquo;" onClick={e => nextPage()} />
        </ul>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(EventPagination);