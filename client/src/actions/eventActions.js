export const FETCH_EVENT_BEGIN = 'FETCH_EVENT_BEGIN';
export const FETCH_EVENT_SUCCESS = 'FETCH_EVENT_SUCCESS';
export const FETCH_EVENT_FAILURE = 'FETCH_EVENT_FAILURE';

export const DELETE_EVENT_BEGIN = 'DELETE_EVENT_BEGIN';
export const DELETE_EVENT_SUCCESS = 'DELETE_EVENT_SUCCESS';
export const DELETE_EVENT_FAILURE = 'DELETE_EVENT_FAILURE';

export const CREATE_EVENT_BEGIN = 'CREATE_EVENT_BEGIN';
export const CREATE_EVENT_SUCCESS = 'CREATE_EVENT_SUCCESS';
export const CREATE_EVENT_FAILURE = 'CREATE_EVENT_FAILURE';

export const UPDATE_EVENT_BEGIN = 'UPDATE_EVENT_BEGIN';
export const UPDATE_EVENT_SUCCESS = 'UPDATE_EVENT_SUCCESS';
export const UPDATE_EVENT_FAILURE = 'UPDATE_EVENT_FAILURE';

export const SUBSCRIBE_BEGIN = 'SUBSCRIBE_BEGIN';
export const SUBSCRIBE_SUCCESS = 'SUBSCRIBE_SUCCESS';
export const UNSUBSCRIBE_SUCCESS = 'UNSUBSCRIBE_SUCCESS';
export const SUBSCRIBE_FAILURE = 'SUBSCRIBE_FAILURE';

export const RELOAD_EVENT = 'RELOAD_EVENT';

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
    payload: error
});

export const updateEventBegin = () => ({
    type: UPDATE_EVENT_BEGIN
});
export const updateEventSuccess = () => ({
    type: UPDATE_EVENT_SUCCESS
});
export const updateEventFailure = (error) => ({
    type: UPDATE_EVENT_FAILURE,
    payload: error
});

export const subscribeBegin = () => ({
    type: SUBSCRIBE_BEGIN
});
export const subscribeSuccess = (data) => ({
    type: SUBSCRIBE_SUCCESS,
    payload: data
});
export const unsubscribeSuccess = (data) => ({
    type: UNSUBSCRIBE_SUCCESS,
    payload: data
});
export const subscribeFailure = (error) => ({
    type: SUBSCRIBE_FAILURE,
    payload: error
});

export const reloadEvent = () => ({
    type: RELOAD_EVENT
});

export function fetchEvent(eventID) {
    return (dispatch, getState) => {
        dispatch(fetchEventBegin());
        return fetch('/api/event/' + eventID)
            .then(res => {
                if (!res.ok) {
                    throw res;
                }
                return res.json();
            })
            .then(res => {
                dispatch(fetchEventSuccess(res));
                if (getState().User.username) {
                    if (res.interested.includes(getState().User.username)) {
                        dispatch(subscribeSuccess(res.interested));
                    }
                }
                return res;
            })
            .catch(res => res.json().then(err => dispatch(fetchEventFailure(err.message))));
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
            .catch(res => res.json().then(err => dispatch(deleteEventFailure(err.message))));
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

export function updateEvent(data) {
    return (dispatch, getState) => {

        var formData = new FormData();
        for (var key of data.keys()) {
            if (data.get(key) && data.get(key) !== getState().Event.eventData[key]) {
                formData.append(key, data.get(key));
            }
        }

        dispatch(updateEventBegin());
        fetch('/api/event/' + getState().Event.eventData._id,
                {
                    method: 'PATCH',
                    headers: {
                        'Accept': 'application/json'
                    },
                    body: formData
                })
            .then(res => {
                if (!res.ok) {
                    throw res;
                }
                if (data.get('picture')) {
                    dispatch(reloadEvent());
                }
                return res.json();
            })
            .then(res => {
                dispatch(updateEventSuccess());
                return res;
            })
            .catch(res => res.json().then(err => dispatch(updateEventFailure(err))));
    };
}

export function subscribe(eventID) {
    return dispatch => {
        dispatch(subscribeBegin());
        fetch('/api/event/' + eventID + '/interest', {
            method: 'put'
        })
            .then(res => {
                if (!res.ok) {
                    throw res;
                }
                return res;
            })
            .then(res => {
                dispatch(subscribeSuccess());
                return res;
            })
            .catch(res => res.json().then(err => dispatch(subscribeFailure(err.message))));
    };
}

export function unsubscribe(eventID) {
    return dispatch => {
        dispatch(subscribeBegin());
        fetch('/api/event/' + eventID + '/interest', {
            method: 'delete'
        })
            .then(res => {
                if (!res.ok) {
                    throw res;
                }
                return res;
            })
            .then(res => {
                dispatch(unsubscribeSuccess());
                return res;
            })
            .catch(res => res.json().then(err => dispatch(subscribeFailure(err.message))));
    };
}