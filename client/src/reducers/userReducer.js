import { RESET_ERROR, AUTHENTICATION_BEGIN, AUTHENTICATION_FAILURE, AUTHENTICATION_SUCCESS, DEAUTHENTICATION_BEGIN, DEAUTHENTICATION_FAILURE, DEAUTHENTICATION_SUCCESS } from 'actions/userActions.js';

const initialState = {
    username: getFromStorage('username'),
    role: getFromStorage('role'),
    authenticating: false,
    authenticated: getFromStorage('username') != null,
    authenticationError: null
};

export default (state = initialState, action) => {

    // Check the authentication status on every event
    var previousState = {};
    if (localStorage.getItem('username')) {
        persist('username', getFromStorage('username'));
        persist('role', getFromStorage('role'));
        previousState = {
            ...state,
            authenticated: true,
            authenticating: false,
            username: getFromStorage('username'),
            role: getFromStorage('role')
        };
    } else {
        clearStorage();
        previousState = {
            ...state,
            authenticated: false,
            authenticating: false,
            username: null,
            role: null
        };
    }

    switch (action.type) {
        case RESET_ERROR:
            return {
                ...previousState,
                authenticationError: null
            };
        case AUTHENTICATION_BEGIN:
            return {
                ...previousState,
                authenticating: true
            };
        case AUTHENTICATION_SUCCESS:
            persist('username', action.payload.username);
            persist('role', action.payload.role);
            return {
                ...previousState,
                authenticating: false,
                authenticated: true,
                username: action.payload.username,
                role: action.payload.role
            };
        case AUTHENTICATION_FAILURE:
            return {
                ...previousState,
                authenticating: false,
                authenticated: false,
                authenticationError: action.payload
            };

        case DEAUTHENTICATION_BEGIN:
            return {
                ...previousState,
                authenticating: true
            };
        case DEAUTHENTICATION_SUCCESS:
            clearStorage();
            return {
                ...previousState,
                authenticating: false,
                authenticated: false,
                username: null,
                role: null,
                authenticationError: null
            };
        case DEAUTHENTICATION_FAILURE:
            return {
                ...previousState,
                authenticating: false,
                authenticationError: action.payload
            };
        
        default:
            return previousState;
    }
};

export function persist(name, value) {
    localStorage.setItem(name, value);
    sessionStorage.setItem(name, value);
}

export function getFromStorage(name) {
    return localStorage.getItem(name) || sessionStorage.getItem(name);
}

export function clearStorage() {
    localStorage.clear();
    sessionStorage.clear();
}