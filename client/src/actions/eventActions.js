export const FETCH_EVENT_BEGIN = 'FETCH_EVENT_BEGIN';
export const FETCH_EVENT_SUCCESS = 'FETCH_EVENT_SUCCESS';
export const FETCH_EVENT_FAILURE = 'FETCH_EVENT_FAILURE';

export const DELETE_EVENT_BEGIN = 'DELETE_EVENT_BEGIN';
export const DELETE_EVENT_SUCCESS = 'DELETE_EVENT_SUCCESS';
export const DELETE_EVENT_FAILURE = 'DELETE_EVENT_FAILURE';

export const fetchEventBegin = () => ({
    type: FETCH_EVENT_BEGIN
});
export const fetchEventSuccess = (event) => ({
    type: FETCH_EVENT_SUCCESS,
    payload: event
});
export const fetchEventFailure = (error) => ({
    type: FETCH_EVENT_FAILURE,
    payload: error
});

export const deleteEventBegin = () => ({
    type: DELETE_EVENT_BEGIN
});
export const deleteEventSuccess = (event) => ({
    type: DELETE_EVENT_SUCCESS
});
export const deleteEventFailure = (error) => ({
    type: DELETE_EVENT_FAILURE,
    payload: error
});

export function fetchEvent(eventID) {
    return dispatch => {
        dispatch(fetchEventBegin());
        return fetch('/api/event/' + eventID)
            .then(res => {
                if (!res.ok) {
                    throw new Error(res.statusText);
                }
                return res.json();
            })
            .then(res => {
                dispatch(fetchEventSuccess(res));
                return res;
            })
            .catch(err => dispatch(fetchEventFailure(err)));
    };
}

export function deleteEvent(eventID) {
    return dispatch => {
        dispatch(deleteEventBegin());
        fetch('/api/event/' + eventID, {
            method: 'delete'
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(res.statusText);
                }
                return res;
            })
            .then(dispatch(deleteEventSuccess()))
            .catch(err => dispatch(fetchEventFailure(err)));
    };
}