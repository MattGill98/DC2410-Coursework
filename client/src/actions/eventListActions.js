import { fetchEventBegin } from "actions/eventActions";

export const FETCH_EVENTS_BEGIN = 'FETCH_EVENTS_BEGIN';
export const FETCH_EVENTS_SUCCESS = 'FETCH_EVENTS_SUCCESS';
export const FETCH_EVENTS_FAILURE = 'FETCH_EVENTS_FAILURE';

export const FILTER_EVENTS = 'FILTER_EVENTS';
export const SORT_EVENTS = 'SORT_EVENTS';
export const REVERSE_SORT_ORDER = 'REVERSE_SORT_ORDER';

export const SET_PAGE = 'SET_PAGE';

const fetchEventsBegin = () => ({
    type: FETCH_EVENTS_BEGIN
});
const fetchEventsSuccess = (events) => ({
    type: FETCH_EVENTS_SUCCESS,
    payload: events
});
const fetchEventsFailure = (error) => ({
    type: FETCH_EVENTS_FAILURE,
    payload: error
});

const filterEventState = (filterString) => ({
    type: FILTER_EVENTS,
    payload: filterString
});

const sortEventState = (sortString) => ({
    type: SORT_EVENTS,
    payload: sortString
});
const sortOrderReversal = () => ({
    type: REVERSE_SORT_ORDER
});

const setPage = (pageNumber) => ({
    type: SET_PAGE,
    payload: pageNumber
});

export function fetchEvents() {
    return (dispatch, getState) => {
        // Reset the single event data when the page begins to load
        dispatch(fetchEventBegin());
        dispatch(fetchEventsBegin());

        // Begin building url to request
        const url = new URL(window.location.origin + '/api/events');
        const params = {
            limit: getState().EventList.pageOffset,
            offset: getState().EventList.pageOffset * getState().EventList.currentPage
        };

        // If the user is logged out, clear all filters and sort data
        if (!getState().User.authenticated) {
            dispatch(sortEventState());
            dispatch(filterEventState());
        } else {
            if (getState().EventList.filters) {
                params.filter = getState().EventList.filters;
            }
            if (getState().EventList.sortValue) {
                params.sort = getState().EventList.sortValue;
            }
            if (getState().EventList.sortOrder) {
                params.order = 'desc';
            }
        }

        // If the user is a student or organiser, add the query parameters
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

        return fetch(url)
            .then(res => {
                if (!res.ok) {
                    throw res;
                }
                return res.json();
            })
            .then(res => {
                dispatch(fetchEventsSuccess(res));
                return res;
            })
            .catch(res => res.json().then(err => dispatch(fetchEventsFailure(err.message))));
    };
}

export function filterEvents(filterString) {
    return dispatch => {
        dispatch(filterEventState(filterString));
        dispatch(fetchEvents());
    };
}

export function sortEvents(sortString) {
    return dispatch => {
        dispatch(sortEventState(sortString));
        dispatch(fetchEvents());
    };
}

export function reverseSortOrder() {
    return dispatch => {
        dispatch(sortOrderReversal());
        dispatch(fetchEvents());
    };
}

export function changePage(pageNumber) {
    return (dispatch, getState) => {
        if (pageNumber >= 0 && pageNumber < getState().EventList.pageCount && pageNumber !== getState().EventList.currentPage) {
            dispatch(setPage(pageNumber));
            dispatch(fetchEvents());
        }
    };
}

export function nextPage() {
    return (dispatch, getState) => {
        if (getState().EventList.currentPage + 1 < getState().EventList.pageCount) {
            dispatch(setPage(getState().EventList.currentPage + 1));
            dispatch(fetchEvents());
        }
    };
}

export function previousPage() {
    return (dispatch, getState) => {
        if (getState().EventList.currentPage > 0) {
            dispatch(setPage(getState().EventList.currentPage - 1));
            dispatch(fetchEvents());
        }
    };
}