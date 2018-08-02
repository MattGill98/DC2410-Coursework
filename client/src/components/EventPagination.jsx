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

const PageLink = ({ text, currentPage, enabled, onClick }) => {
    var className = "";
    if (text === currentPage) {
        className = "active";
    }
    if (enabled === false) {
        className += " disabled";
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
            <PageLink text="&laquo;" enabled={currentPage > 0} onClick={e => previousPage()} />
            {
                [...Array(pages)].map((e, i) => <PageLink text={i + 1} enabled={i != currentPage} currentPage={currentPage + 1} onClick={e => setPage(i)} />)
            }
            <PageLink text="&raquo;" enabled={currentPage + 1 < pages} onClick={e => nextPage()} />
        </ul>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(EventPagination);