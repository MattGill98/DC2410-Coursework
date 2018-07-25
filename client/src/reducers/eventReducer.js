import { DELETE_EVENT_BEGIN, DELETE_EVENT_FAILURE, DELETE_EVENT_SUCCESS, CREATE_EVENT_BEGIN, CREATE_EVENT_FAILURE, CREATE_EVENT_SUCCESS, FETCH_EVENT_BEGIN, FETCH_EVENT_FAILURE, FETCH_EVENT_SUCCESS } from 'actions/eventActions.js';

const initialState = {
    eventData: {},
    loading: false,
    error: null,
    deleting: false,
    deleted: false,
    creating: false,
    created: false
};

export default (state = initialState, action) => {
    switch (action.type) {
        case FETCH_EVENT_BEGIN:
            return {
                ...initialState,
                loading: true
            };
        case FETCH_EVENT_SUCCESS:
            return {
                ...state,
                loading: false,
                eventData: action.payload
            };
        case FETCH_EVENT_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                eventData: {}
            };
        
        case DELETE_EVENT_BEGIN:
            return {
                ...state,
                deleting: true,
                deleted: false,
                error: null
            };
        case DELETE_EVENT_SUCCESS:
            return {
                ...state,
                deleting: false,
                deleted: true
            };
        case DELETE_EVENT_FAILURE:
            return {
                ...state,
                deleting: false,
                deleted: false,
                error: action.payload
            };

        case CREATE_EVENT_BEGIN:
            return {
                ...state,
                creating: true,
                created: false,
                error: null
            };
        case CREATE_EVENT_SUCCESS:
            return {
                ...state,
                creating: false,
                created: true
            };
        case CREATE_EVENT_FAILURE:
            return {
                ...state,
                creating: false,
                created: false,
                error: action.payload
            };
        default:
            return state;
    }
};