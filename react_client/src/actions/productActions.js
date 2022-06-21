import axios from 'axios';
import { BASE_API_URL } from '../config';
import store from 'src/store';

export const GET_ALL_PRODUCT_REQUEST = "GET_ALL_PRODUCT_REQUEST"
export const GET_ALL_PRODUCT_SUCCESS = "GET_ALL_PRODUCT_SUCCESS"
export const GET_ALL_PRODUCT_FAIL = "GET_ALL_PRODUCT_FAIL"

export const doGetAllProducts = (dispatch) => {
    dispatch({
        type: GET_ALL_PRODUCT_REQUEST,
    })
    axios.get(`${BASE_API_URL}api/product/getAllProducts`)
    .then(({data}) => {
        let {code, content, errors} = data;
        let data_server = JSON.parse(content)
        let products = []
        switch (code) {
            case 200:
                for (let i = 0; i < data_server.length; i ++) {
                    products.push({
                        id: data_server[i]['id'],
                        asin: data_server[i]['asin'],
                        title: data_server[i]['title'],
                        url: data_server[i]['url'],
                        own_description: data_server[i]['own_description'],
                        is_prime: data_server[i]['is_prime'],
                        contents: data_server[i]['contents'],
                        imgurls: data_server[i]['imgurls'],
                        info_list: data_server[i]['info_list'],
                        avg_price: data_server[i]['avg_price'],
                        total_stocks: data_server[i]['total_stocks'],
                        category_id: data_server[i]['category_id'],
                    })
                }
                dispatch({
                    type: GET_ALL_PRODUCT_SUCCESS,
                    payload: products,
                })
                break;
            default:
                alert("Unknown error. Please contact the developer")
                dispatch({
                    type: GET_ALL_PRODUCT_FAIL,
                })  
        }
    }).catch(err => {
        alert("Unknown error. Please contact the developer")
        dispatch({
            type: GET_ALL_PRODUCT_FAIL,
            payload: "Unknown Error",
        });
    })
}
