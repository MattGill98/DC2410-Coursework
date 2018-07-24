export const LOGIN_BEGIN = 'LOGIN_BEGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export const REGISTER_BEGIN = 'REGISTER_BEGIN';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAILURE = 'REGISTER_FAILURE';

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

export const registerBegin = () => ({
    type: REGISTER_BEGIN
});
export const registerSuccess = (user) => ({
    type: REGISTER_SUCCESS,
    payload: user.name
});
export const registerFailure = (error) => ({
    type: REGISTER_FAILURE,
    payload: error
});

export function login(data) {
    return dispatch => {
        dispatch(loginBegin());
        fetch('/api/login/',
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
                return res.text();
            })
            .then(res => {
                dispatch(loginSuccess(res));
                return res;
            })
            .catch(res => res.text().then(err => dispatch(loginFailure(err))));
    };
}

export function register(data) {
    return dispatch => {
        dispatch(registerBegin());
        fetch('/api/register/',
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
                return res.text();
            })
            .then(res => {
                dispatch(registerSuccess(res));
                return res;
            })
            .catch(res => res.text().then(err => dispatch(registerFailure(err))));
    };
}