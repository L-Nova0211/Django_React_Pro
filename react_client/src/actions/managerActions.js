import axios from 'axios';
import { BASE_API_URL } from '../config';
import store from 'src/store';

export const GET_ALL_USERS_REQUEST = "GET_ALL_USERS_REQUEST"
export const GET_ALL_USERS_SUCCESS = "GET_ALL_USERS_SUCCESS"
export const GET_ALL_USERS_FAIL = "GET_ALL_USERS_FAIL"

export const UPDATE_PRODUCT_REQUEST = "UPDATE_PRODUCT_REQUEST"
export const UPDATE_PRODUCT_SUCCESS = "UPDATE_PRODUCT_SUCCESS"
export const UPDATE_PRODUCT_FAIL = "UPDATE_PRODUCT_FAIL"

export const UPDATE_PRODUCT_INFO_REQUEST = "UPDATE_PRODUCT_INFO_REQUEST"
export const UPDATE_PRODUCT_INFO_SUCCESS = "UPDATE_PRODUCT_INFO_SUCCESS"
export const UPDATE_PRODUCT_INFO_FAIL = "UPDATE_PRODUCT_INFO_FAIL"

export const doGetAllUsers = (dispatch) => {
    dispatch({
        type: GET_ALL_USERS_REQUEST,
    })
    axios.get(`${BASE_API_URL}api/member/getAllUsers`)
    .then(({data}) => {
        let {code, content, errors} = data;
        let data_server = JSON.parse(content)
        let users = []
        switch (code) {
            case 200:
                for (let i = 0; i < data_server.length; i ++) {
                    users.push({
                        id: data_server[i]['pk'],
                        email: data_server[i]['fields']['email'],
                        nickname: data_server[i]['fields']['nickname'],
                        is_active: data_server[i]['fields']['is_active'],
                        amazon_email: data_server[i]['fields']['amazon_email'],
                        role: data_server[i]['fields']['role'],
                        date_joined: data_server[i]['fields']['date_joined'],
                    })
                }
                dispatch({
                    type: GET_ALL_USERS_SUCCESS,
                    payload: users,
                })
                break;
            default:
                dispatch({
                    type: GET_ALL_USERS_FAIL,
                })  
        }
    }).catch(err => {
        dispatch({
            type: GET_ALL_USERS_FAIL,
            payload: "Unknown Error",
        });
    })
}

export const updateProductDetail = (dispatch, updateData) => {
    console.log(updateData)
    dispatch({
        type: UPDATE_PRODUCT_REQUEST,
    })
    axios.post(`${BASE_API_URL}api/product/updateProductDetail`, updateData)
    .then(({data}) => {
        console.log(data)
        let {code, content, errors} = data;
        let product = {}
        switch (code) {
            case 200:
                product = {
                    id: content.id,
                    asin: content.asin,
                    own_description: content.own_description,
                    title: content.title,
                }
                dispatch({
                    type: UPDATE_PRODUCT_SUCCESS,
                    payload: product,
                })
                break;
            default:
                dispatch({
                    type: UPDATE_PRODUCT_FAIL,
                })  
        }
    }).catch(err => {
        dispatch({
            type: UPDATE_PRODUCT_FAIL,
            payload: "Unknown Error",
        });
    })
}

export const updateProductInfo = (dispatch, updateData) => {
    dispatch({
        type: UPDATE_PRODUCT_INFO_REQUEST,
    }) 
    axios.post(`${BASE_API_URL}api/product/updateProductInfo`, updateData)
    .then(({data}) => {
        console.log(data)
        let {code, content, errors} = data;
        let data_server = JSON.parse(content)
        let productInfo = {}
        switch (code) {
            case 200:
                productInfo = {
                    id: data_server['info_id'],
                    seller: data_server['seller'],
                    stocks: data_server['stocks'],
                    shipper: data_server['shipper'],
                    price: data_server['price'],
                }
                dispatch({
                    type: UPDATE_PRODUCT_INFO_SUCCESS,
                    payload: [],
                })
                break;
            default:
                dispatch({
                    type: UPDATE_PRODUCT_INFO_FAIL,
                })  
        }
    }).catch(err => {
        dispatch({
            type: UPDATE_PRODUCT_INFO_FAIL,
            payload: "Unknown Error",
        });
    })
}
