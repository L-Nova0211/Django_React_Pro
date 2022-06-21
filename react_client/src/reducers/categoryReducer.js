import { 
    GET_CATEGORIES_REQUEST,
    GET_CATEGORIES_SUCCESS,
    GET_CATEGORIES_FAIL,
    ADD_CATEGORY_REQUEST,
    ADD_CATEGORY_SUCCESS,
    ADD_CATEGORY_FAIL,
    UPDATE_CATEGORY_REQUEST,
    UPDATE_CATEGORY_SUCCESS,
    UPDATE_CATEGORY_FAIL,
    DEL_CATEGORY_REQUEST,
    DEL_CATEGORY_SUCCESS,
    DEL_CATEGORY_FAIL,
    TOGGLE_CATEGORY_REQUEST,
    TOGGLE_CATEGORY_SUCCESS,
    TOGGLE_CATEGORY_FAIL,
} from 'src/actions/categoryActions';

import {
    CHANGE_ACTIVE_CATEGORY
} from 'src/dev/components/ProductListToolbar';

const initialState = {
    categories: [],
    activeCategory: "",
    loading: false,
}

export default function categoryReducer(state = initialState, action) {
    switch (action.type) {
        case GET_CATEGORIES_REQUEST:
            return {
                ...state,
                loading: true,
            };
            break;
        case GET_CATEGORIES_SUCCESS:
            return {
                ...state,
                loading: false,
                categories: action.payload,
                activeCategory: action.payload.length > 0 ? action.payload[0].id : "",
            };
            break;
        case GET_CATEGORIES_FAIL:
            return {
                ...state,
                loading: true,
            };
            break;
        case ADD_CATEGORY_REQUEST:
            return {
                ...state,
                loading: true,
            };
            break;
        case ADD_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                categories: [
                    ...state.categories,
                    action.payload
                ],
            };
            break;
        case ADD_CATEGORY_FAIL:
            return {
                ...state,
                loading: true,
            };
            break;
        case UPDATE_CATEGORY_REQUEST:
            return {
                ...state,
                loading: true,
            };
            break;
        case UPDATE_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                categories: state.categories.map(category => category.id == action.payload.id ? action.payload : category),
            };
            break;
        case UPDATE_CATEGORY_FAIL:
            return {
                ...state,
                loading: true,
            };
            break;
        case DEL_CATEGORY_REQUEST:
            return {
                ...state,
                loading: true,
            };
            break;
        case DEL_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: false,
                categories: state.categories.filter(category => (category.id !== action.payload)),
            };
            break;
        case DEL_CATEGORY_FAIL:
            return {
                ...state,
                loading: true,
            };
            break;
        case CHANGE_ACTIVE_CATEGORY:
            return {
                ...state,
                activeCategory: action.payload,
            }
            break;
        case TOGGLE_CATEGORY_REQUEST:
            return {
                ...state,
                loading: true,
            }
            break;
        case TOGGLE_CATEGORY_SUCCESS:
            return {
                ...state,
                loading: true,
                categories: state.categories.map(category => {
                    if (category.id == action.payload.id) {
                        category.is_scraped = action.payload.is_scraped
                    }
                    return category
                })
            }
            break;
        case TOGGLE_CATEGORY_FAIL:
            return {
                ...state,
                loading: false,
            }
            break;
        default:
            return state;
    }
}