export const LOGIN_BEGIN = 'LOGIN_BEGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export const loginBegin = () => ({
    type: LOGIN_BEGIN
});
export const loginSuccess = (user) => ({
    type: LOGIN_SUCCESS,
    payload: user.name
});
export const loginFailure = (error) => ({
    type: LOGIN_FAILURE,
    payload: error
});

export function login(username, password) {
    return dispatch => {
        dispatch(loginBegin());
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