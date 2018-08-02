import { FETCH_EVENTS_BEGIN, FETCH_EVENTS_FAILURE, FETCH_EVENTS_SUCCESS, FILTER_EVENTS, REVERSE_SORT_ORDER, SORT_EVENTS } from 'actions/eventListActions.js';
import { SET_PAGE } from '../actions/eventListActions';

const initialState = {
    items: [],
    pageCount: 1,
    currentPage: 0,
    pageOffset: 6,


    fetching: false,
    fetchingError: null,

    filters: [],
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
                items: action.payload.data,
                pageCount: Math.ceil(action.payload.count / initialState.pageOffset)
            };
        case FETCH_EVENTS_FAILURE:
            return {
                ...state,
                fetching: false,
                items: [],
                pageCount: 1,
                fetchingError: action.payload
            };

        case FILTER_EVENTS:
            if (!action.payload) {
                return {
                    ...state,
                    filters: []
                };
            }
            if (state.filters.includes(action.payload)) {
                return {
                    ...state,
                    filters: state.filters.filter(item => item !== action.payload)
                };
            }
            return {
                ...state,
                filters: [
                    ...state.filters.slice(),
                    action.payload
                ]
            };
        case SORT_EVENTS:
            return {
                ...state,
                sortValue: action.payload
            };
        case REVERSE_SORT_ORDER:
            return {
                ...state,
                sortOrder: !state.sortOrder
            }

        case SET_PAGE:
            return {
                ...state,
                currentPage: action.payload
            };
        default:
            return state;
    }
};