export const AUTHENTICATION_BEGIN = 'AUTHENTICATION_BEGIN';
export const AUTHENTICATION_SUCCESS = 'AUTHENTICATION_SUCCESS';
export const AUTHENTICATION_FAILURE = 'AUTHENTICATION_FAILURE';

export const LOGOUT = 'LOGOUT';

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

export const logout = () => ({
    type: LOGOUT
})

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