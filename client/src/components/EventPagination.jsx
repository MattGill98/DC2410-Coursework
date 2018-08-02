import { changePage, nextPage, previousPage } from 'actions/eventListActions.js';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";
import { Button } from 'reactstrap';

const mapStateToProps = state => ({
    filters: state.EventList.filters,
    currentPage: state.EventList.currentPage,
    pageCount: state.EventList.pageCount,
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
        <li key={text} class={"page-item " + className}>
            <Button className="page-link" onClick={onClick}>{text}</Button>
        </li>
    );
};

const EventPagination = ({ currentPage, pageCount, previousPage, nextPage, setPage }) => {

    if (currentPage >= pageCount) {
        setPage(pageCount - 1);
        return <Redirect to='/events' />
    }

    if (pageCount === 1) {
        return null;
    }

    return (
        <ul class="pagination justify-content-center mt-3">
            <PageLink text="&laquo;" enabled={currentPage > 0} onClick={e => previousPage()} />
            {
                [...Array(pageCount)].map((e, i) => <PageLink text={i + 1} enabled={i !== currentPage} currentPage={currentPage + 1} onClick={e => setPage(i)} />)
            }
            <PageLink text="&raquo;" enabled={currentPage + 1 < pageCount} onClick={e => nextPage()} />
        </ul>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(EventPagination);