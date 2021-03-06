import { RELOAD_EVENT, CREATE_EVENT_BEGIN, CREATE_EVENT_FAILURE, CREATE_EVENT_SUCCESS, UPDATE_EVENT_BEGIN, UPDATE_EVENT_FAILURE, UPDATE_EVENT_SUCCESS, DELETE_EVENT_BEGIN, DELETE_EVENT_FAILURE, DELETE_EVENT_SUCCESS, FETCH_EVENT_BEGIN, FETCH_EVENT_FAILURE, FETCH_EVENT_SUCCESS, SUBSCRIBE_BEGIN, SUBSCRIBE_FAILURE, SUBSCRIBE_SUCCESS, UNSUBSCRIBE_SUCCESS } from 'actions/eventActions.js';

const initialState = {
    eventData: {},
    reloadEvent: false,

    fetching: false,
    fetchError: null,

    deleting: false,
    deleted: false,
    deletionError: null,

    creating: false,
    created: false,
    creationError: null,

    updating: false,
    updated: false,
    updateError: null,

    subscribing: false,
    subscribed: false,
    subscriptionError: null
};

export default (state = initialState, action) => {
    switch (action.type) {
        case FETCH_EVENT_BEGIN:
            return {
                ...initialState,
                fetching: true
            };
        case FETCH_EVENT_SUCCESS:
            return {
                ...state,
                fetching: false,
                eventData: action.payload
            };
        case FETCH_EVENT_FAILURE:
            return {
                ...state,
                fetching: false,
                fetchError: action.payload,
                eventData: {}
            };
        case RELOAD_EVENT:
            return {
                ...state,
                reloadEvent: true
            };
        
        case DELETE_EVENT_BEGIN:
            return {
                ...state,
                deleting: true,
                deleted: false,
                deletionError: null
            };
        case DELETE_EVENT_SUCCESS:
            return {
                ...state,
                deleting: false,
                deleted: true,
                deletionError: null
            };
        case DELETE_EVENT_FAILURE:
            return {
                ...state,
                deleting: false,
                deleted: false,
                deletionError: action.payload
            };

        case CREATE_EVENT_BEGIN:
            return {
                ...state,
                creating: true,
                created: false,
                creationError: null
            };
        case CREATE_EVENT_SUCCESS:
            return {
                ...state,
                creating: false,
                created: true,
                creationError: null
            };
        case CREATE_EVENT_FAILURE:
            return {
                ...state,
                creating: false,
                created: false,
                creationError: action.payload
            };

        case UPDATE_EVENT_BEGIN:
            return {
                ...state,
                updating: true,
                updated: false,
                updateError: null
            };
        case UPDATE_EVENT_SUCCESS:
            return {
                ...state,
                updating: false,
                updated: true,
                updateError: null
            };
        case UPDATE_EVENT_FAILURE:
            return {
                ...state,
                updating: false,
                updated: false,
                updateError: action.payload
            };

        case SUBSCRIBE_BEGIN:
            return {
                ...state,
                subscribing: true,
                subscriptionError: null
            };
        case SUBSCRIBE_SUCCESS:
            return {
                ...state,
                subscribing: false,
                subscribed: true,
                subscriptionError: null,
                eventData: {
                    ...state.eventData,
                    interested: action.payload
                }
            };
        case UNSUBSCRIBE_SUCCESS:
            return {
                ...state,
                subscribing: false,
                subscribed: false,
                subscriptionError: null,
                eventData: {
                    ...state.eventData,
                    interested: action.payload
                }
            };
        case SUBSCRIBE_FAILURE:
            return {
                ...state,
                subscribing: false,
                subscriptionError: action.payload
            };
        default:
            return state;
    }
};