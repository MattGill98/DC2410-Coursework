import { FETCH_EVENTS_BEGIN, FETCH_EVENTS_FAILURE, FETCH_EVENTS_SUCCESS, FILTER_EVENTS, REVERSE_SORT_ORDER, SORT_EVENTS } from 'actions/eventListActions.js';

const initialState = {
    items: [],
    fetching: false,
    fetchingError: null,

    filters: {
        me: false,
        subscribed: false,
        sport: false,
        culture: false,
        others: false
    },
    sortValue: null,
    sortOrder: false
};

export default (state = initialState, action) => {
    switch (action.type) {
        case FETCH_EVENTS_BEGIN:
            return {
                ...state,
                fetching: true,
                fetchingError: null
            };
        case FETCH_EVENTS_SUCCESS:
            return {
                ...state,
                fetching: false,
                items: action.payload
            };
        case FETCH_EVENTS_FAILURE:
            return {
                ...state,
                fetching: false,
                items: [],
                fetchingError: action.payload
            };

        case FILTER_EVENTS:
            return {
                ...state,
                filters: {
                    ...state.filters,
                    [action.payload]: !state.filters[action.payload]
                }
            };
        case SORT_EVENTS:
            return {
                ...state,
                sortValue: action.payload
            };
        case REVERSE_SORT_ORDER:
            return {
                ...state,
                sortOrder : !state.sortOrder
            }
        default:
            return state;
    }
};