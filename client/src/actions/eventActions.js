export const FETCH_EVENT_BEGIN = 'FETCH_EVENT_BEGIN';
export const FETCH_EVENT_SUCCESS = 'FETCH_EVENT_SUCCESS';
export const FETCH_EVENT_FAILURE = 'FETCH_EVENT_FAILURE';

export const DELETE_EVENT_BEGIN = 'DELETE_EVENT_BEGIN';
export const DELETE_EVENT_SUCCESS = 'DELETE_EVENT_SUCCESS';
export const DELETE_EVENT_FAILURE = 'DELETE_EVENT_FAILURE';

export const CREATE_EVENT_BEGIN = 'CREATE_EVENT_BEGIN';
export const CREATE_EVENT_SUCCESS = 'CREATE_EVENT_SUCCESS';
export const CREATE_EVENT_FAILURE = 'CREATE_EVENT_FAILURE';

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
export const deleteEventSuccess = () => ({
    type: DELETE_EVENT_SUCCESS
});
export const deleteEventFailure = (error) => ({
    type: DELETE_EVENT_FAILURE,
    payload: error
});

export const createEventBegin = () => ({
    type: CREATE_EVENT_BEGIN
});
export const createEventSuccess = () => ({
    type: CREATE_EVENT_SUCCESS
});
export const createEventFailure = (error) => ({
    type: CREATE_EVENT_FAILURE,
    payload: error.errors
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
                    throw res;
                }
                return res;
            })
            .then(res => {
                dispatch(deleteEventSuccess());
                return res;
            })
            .catch(res => res.json().then(err => dispatch(fetchEventFailure(err))));
    };
}

export function createEvent(data) {
    return dispatch => {
        dispatch(createEventBegin());
        fetch('/api/events/',
                {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Accept': 'application/json'
                    },
                    body: data
                })
            .then(res => {
                if (!res.ok) {
                    throw res;
                }
                return res.json();
            })
            .then(res => {
                dispatch(createEventSuccess());
                return res;
            })
            .catch(res => res.json().then(err => dispatch(createEventFailure(err))));
    };
}