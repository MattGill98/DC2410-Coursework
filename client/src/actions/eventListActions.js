import { fetchEventBegin } from "actions/eventActions";

export const FETCH_EVENTS_BEGIN = 'FETCH_EVENTS_BEGIN';
export const FETCH_EVENTS_SUCCESS = 'FETCH_EVENTS_SUCCESS';
export const FETCH_EVENTS_FAILURE = 'FETCH_EVENTS_FAILURE';

export const FILTER_EVENTS = 'FILTER_EVENTS';
export const SORT_EVENTS = 'SORT_EVENTS';
export const REVERSE_SORT_ORDER = 'REVERSE_SORT_ORDER';

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

export function fetchEvents() {
    return (dispatch, getState) => {
        // Reset the single event data when the page begins to load
        dispatch(fetchEventBegin());
        dispatch(fetchEventsBegin());
        const url = new URL(window.location.origin + '/api/events');
        const params = {};
        if (getState().EventList.filters) {
            params.filter = getState().EventList.filters;
        }
        if (getState().EventList.sortValue) {
            params.sort = getState().EventList.sortValue;
        }
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
        return fetch(url)
            .then(res => {
                if (!res.ok) {
                    throw new Error(res.statusText);
                }
                return res.json();
            })
            .then(res => {
                dispatch(fetchEventsSuccess(res));
                return res;
            })
            .catch(err => dispatch(fetchEventsFailure(err)));
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