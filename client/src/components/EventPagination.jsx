import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';

const mapStateToProps = state => ({
    filters: state.EventList.filters,
    currentPage: state.EventList.currentPage,
});

const PageLink = ({text, currentPage}) => {
    var className = "";
    if (text === currentPage) {
        className = "active";
    }
    return (
        <li class={"page-item " + className}>
            <Button className="page-link">{text}</Button>
        </li>
    );
};

const EventPagination = ({pages, currentPage}) => {
    if (pages === 1) {
        return null;
    }
    return (
        <ul class="pagination justify-content-center mt-3">
            <PageLink text="&laquo;" />
            {
                [...Array(pages)].map((e, i) => <PageLink text={i + 1} currentPage={currentPage + 1} />)
            }
            <PageLink text="&raquo;" />
        </ul>
    );
};

export default connect(mapStateToProps)(EventPagination);