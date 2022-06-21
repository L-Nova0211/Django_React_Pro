import { 
    GET_ALL_PRODUCT_REQUEST,
    GET_ALL_PRODUCT_SUCCESS,
    GET_ALL_PRODUCT_FAIL,
} from 'src/actions/productActions';

import {
    
    UPDATE_PRODUCT_REQUEST,
    UPDATE_PRODUCT_SUCCESS,
    UPDATE_PRODUCT_FAIL,

    UPDATE_PRODUCT_INFO_REQUEST,
    UPDATE_PRODUCT_INFO_SUCCESS,
    UPDATE_PRODUCT_INFO_FAIL,
} from 'src/actions/managerActions';

const initialState = {
    products: [],
    loading: true,
}

export default function authReducer(state = initialState, action) {
    switch(action.type) {
        case GET_ALL_PRODUCT_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case GET_ALL_PRODUCT_SUCCESS:
            return {
                ...state,
                loading: false,
                products: action.payload,
            }
        case GET_ALL_PRODUCT_FAIL:
            return {
                ...state,
                loading: false,
            }
        case UPDATE_PRODUCT_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case UPDATE_PRODUCT_SUCCESS:
            return {
                ...state,
                loading: false,
                products: state.products.map(product => {
                    if (product.id == action.payload.id) {
                        product.asin = action.payload.asin
                        product.title = action.payload.title
                        product.own_description = action.payload.own_description
                    }
                    return product;
                }),
            }
        case UPDATE_PRODUCT_FAIL:
            return {
                ...state,
                loading: false,
            }
        default:
            return state
    }
}