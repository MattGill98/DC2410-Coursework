import { AUTHENTICATION_BEGIN, AUTHENTICATION_SUCCESS, AUTHENTICATION_FAILURE, LOGOUT } from 'actions/userActions.js';

const initialState = {
    username: null,
    role: null,
    token: null,
    authenticating: false,
    authenticated: false,
    error: null
};

export default (state = initialState, action) => {
    switch (action.type) {
        case AUTHENTICATION_BEGIN:
            return {
                ...initialState,
                authenticating: true
            };
        case AUTHENTICATION_SUCCESS:
            return {
                ...state,
                authenticating: false,
                authenticated: true,
                username: action.payload.name,
                token: action.payload.token,
                role: action.payload.role
            };
        case AUTHENTICATION_FAILURE:
            return {
                ...state,
                authenticating: false,
                authenticated: false,
                error: action.payload
            };
        
        case LOGOUT:
            return {
                ...initialState
            };
        default:
            return state;
    }
};