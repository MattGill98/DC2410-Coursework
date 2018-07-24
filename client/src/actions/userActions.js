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