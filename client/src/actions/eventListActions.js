import { fetchEventBegin } from "actions/eventActions";

export const FETCH_EVENTS_BEGIN = 'FETCH_EVENTS_BEGIN';
export const FETCH_EVENTS_SUCCESS = 'FETCH_EVENTS_SUCCESS';
export const FETCH_EVENTS_FAILURE = 'FETCH_EVENTS_FAILURE';

export const fetchEventsBegin = () => ({
    type: FETCH_EVENTS_BEGIN
});
export const fetchEventsSuccess = (events) => ({
    type: FETCH_EVENTS_SUCCESS,
    payload: events
});
export const fetchEventsFailure = (error) => ({
    type: FETCH_EVENTS_FAILURE,
    payload: error
});

export function fetchEvents() {
    return dispatch => {
        dispatch(fetchEventsBegin());
        // Reset the single event data when the page begins to load
        dispatch(fetchEventBegin());
        return fetch('/api/events')
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