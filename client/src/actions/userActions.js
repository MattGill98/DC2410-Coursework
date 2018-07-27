export const RESET_ERROR = 'RESET_ERROR';

export const AUTHENTICATION_BEGIN = 'AUTHENTICATION_BEGIN';
export const AUTHENTICATION_SUCCESS = 'AUTHENTICATION_SUCCESS';
export const AUTHENTICATION_FAILURE = 'AUTHENTICATION_FAILURE';

export const DEAUTHENTICATION_BEGIN = 'DEAUTHENTICATION_BEGIN';
export const DEAUTHENTICATION_SUCCESS = 'DEAUTHENTICATION_SUCCESS';
export const DEAUTHENTICATION_FAILURE = 'DEAUTHENTICATION_FAILURE';

export const resetError = () => ({
    type: RESET_ERROR
});

export const authenticationBegin = () => ({
    type: AUTHENTICATION_BEGIN
});
export const authenticationSuccess = (res) => ({
    type: AUTHENTICATION_SUCCESS,
    payload: res
});
export const authenticationFailure = (error) => ({
    type: AUTHENTICATION_FAILURE,
    payload: error
});

export const deauthenticationBegin = () => ({
    type: DEAUTHENTICATION_BEGIN
});
export const deauthenticationSuccess = () => ({
    type: DEAUTHENTICATION_SUCCESS
});
export const deauthenticationFailure = (error) => ({
    type: DEAUTHENTICATION_FAILURE,
    payload: error
});

export function login(data) {
    return dispatch => {
        dispatch(authenticationBegin());
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
                return res.json();
            })
            .then(res => {
                dispatch(authenticationSuccess(res));
                return res;
            })
            .catch(res => res.json().then(err => dispatch(authenticationFailure(err))));
    };
}

export function register(data) {
    return dispatch => {
        dispatch(authenticationBegin());
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
                return res.json();
            })
            .then(res => {
                dispatch(authenticationSuccess(res));
                return res;
            })
            .catch(res => res.json().then(err => dispatch(authenticationFailure(err))));
    };
}

export function logout() {
    return dispatch => {
        dispatch(deauthenticationBegin());
        fetch('/api/logout/')
            .then(res => {
                if (!res.ok) {
                    throw res;
                }
                return res.text();
            })
            .then(res => {
                dispatch(deauthenticationSuccess(res));
                return res;
            })
            .catch(res => res.text().then(err => dispatch(deauthenticationFailure(err))));
    };
}