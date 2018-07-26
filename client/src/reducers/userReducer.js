import { AUTHENTICATION_BEGIN, AUTHENTICATION_FAILURE, AUTHENTICATION_SUCCESS, LOGOUT } from 'actions/userActions.js';

const initialState = {
    username: getFromStorage('username'),
    role: getFromStorage('role'),
    authenticating: false,
    authenticated: getFromStorage('username') != null,
    error: null
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
        case AUTHENTICATION_BEGIN:
            return {
                ...previousState,
                authenticating: true
            };
        case AUTHENTICATION_SUCCESS:
            persist('username', action.payload.name);
            persist('role', action.payload.role);
            return {
                ...previousState,
                authenticating: false,
                authenticated: true,
                username: action.payload.name,
                role: action.payload.role
            };
        case AUTHENTICATION_FAILURE:
            return {
                ...previousState,
                authenticating: false,
                authenticated: false,
                error: action.payload
            };
        
        case LOGOUT:
            clearStorage();
            return {
                ...initialState
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