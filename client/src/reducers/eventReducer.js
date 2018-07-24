import { DELETE_EVENT_BEGIN, DELETE_EVENT_FAILURE, DELETE_EVENT_SUCCESS, FETCH_EVENT_BEGIN, FETCH_EVENT_FAILURE, FETCH_EVENT_SUCCESS } from 'actions/eventActions.js';

const initialState = {
    eventData: {},
    loading: false,
    error: null,
    deleting: false,
    deleted: false,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case FETCH_EVENT_BEGIN:
            return {
                ...state,
                loading: true,
                error: null,
                deleting: false,
                deleted: false
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
                deleted: false
            };
        default:
            return state;
    }
};