import { LOGIN_BEGIN, LOGIN_SUCCESS, LOGIN_FAILURE } from 'actions/userActions.js';

const initialState = {
    username: null,
    authenticating: false,
    authenticated: false,
    error: null
};

export default (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_BEGIN:
            return {
                ...initialState,
                authenticating: true
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                authenticating: false,
                authenticated: true,
                username: action.payload
            };
        case LOGIN_FAILURE:
            return {
                ...state,
                authenticating: false,
                error: action.payload
            };
        default:
            return state;
    }
};