import axios from 'axios';
import { BASE_API_URL } from '../config';
import store from 'src/store';

export const ADD_CATEGORY_REQUEST = "ADD_CATEGORY_REQUEST"
export const ADD_CATEGORY_SUCCESS = "ADD_CATEGORY_SUCCESS"
export const ADD_CATEGORY_FAIL = "ADD_CATEGORY_FAIL"

export const UPDATE_CATEGORY_REQUEST = "UPDATE_CATEGORY_REQUEST"
export const UPDATE_CATEGORY_SUCCESS = "UPDATE_CATEGORY_SUCCESS"
export const UPDATE_CATEGORY_FAIL = "UPDATE_CATEGORY_FAIL"

export const DEL_CATEGORY_REQUEST = "DEL_CATEGORY_REQUEST"
export const DEL_CATEGORY_SUCCESS = "DEL_CATEGORY_SUCCESS"
export const DEL_CATEGORY_FAIL = "DEL_CATEGORY_FAIL"

export const TOGGLE_CATEGORY_REQUEST = "TOGGLE_CATEGORY_REQUEST"
export const TOGGLE_CATEGORY_SUCCESS = "TOGGLE_CATEGORY_SUCCESS"
export const TOGGLE_CATEGORY_FAIL = "TOGGLE_CATEGORY_FAIL"

export const GET_CATEGORIES_REQUEST = "GET_CATEGORIES_REQUEST"
export const GET_CATEGORIES_SUCCESS = "GET_CATEGORIES_SUCCESS"
export const GET_CATEGORIES_FAIL = "GET_CATEGORIES_FAIL"

export const proposeCategory = (dispatch, postData) => {
    dispatch({
        type: ADD_CATEGORY_REQUEST
    });
    axios.post(`${BASE_API_URL}api/category/proposeCategory`, postData)
    .then(({data}) => {
        let { code, content } = data;
        console.log(content)
        switch(code) {
            case 200:
                alert("Successfully proposed. please wait for ready")
                dispatch({
                    type: ADD_CATEGORY_SUCCESS,
                    payload: content
                })
                break;
            case 300:
                alert("Invalid arguments");
                dispatch({
                    type: ADD_CATEGORY_FAIL,
                    payload: "Unknown error"
                })
                break;
            case 404:
                alert("Already exist");
                dispatch({
                    type: ADD_CATEGORY_FAIL,
                    payload: "Unknown error"
                })
                break;
            default:
                alert("Please contact developer");
                dispatch({
                    type: ADD_CATEGORY_FAIL,
                    payload: "Unknown error"
                })
                break;
        }
    }).catch(err => {
        alert("Please contact developer");
        dispatch({
            type: ADD_CATEGORY_FAIL,
            payload: "Unknown error"
        })
    })
}

export const updateCategory = (dispatch, postData) => {
    dispatch({
        type: UPDATE_CATEGORY_REQUEST
    });
    axios.post(`${BASE_API_URL}api/category/updateCategory`, postData)
    .then(({data}) => {
        let { code, content } = data;
        console.log(content)
        switch(code) {
            case 200:
                dispatch({
                    type: UPDATE_CATEGORY_SUCCESS,
                    payload: content
                })
                break;
            case 304:
                alert("You ran out of bid. please contact to manager");
                dispatch({
                    type: UPDATE_CATEGORY_FAIL,
                    payload: "Ran out of bid"
                })
            case 300:
                alert("Invalid arguments");
                dispatch({
                    type: UPDATE_CATEGORY_FAIL,
                    payload: "Unknown error"
                })
                break;
            case 404:
                alert("Already exist");
                dispatch({
                    type: UPDATE_CATEGORY_FAIL,
                    payload: "Unknown error"
                })
                break;
            default:
                alert("Please contact developer");
                dispatch({
                    type: UPDATE_CATEGORY_FAIL,
                    payload: "Unknown error"
                })
                break;
        }
    }).catch(err => {
        alert("Please contact developer");
        dispatch({
            type: UPDATE_CATEGORY_FAIL,
            payload: "Unknown error"
        })
    })
}

export const getCategories = (dispatch) => {
    dispatch({
        type: GET_CATEGORIES_REQUEST
    });
    axios.get(`${BASE_API_URL}api/category/getAllCategories`)
    .then(({data}) => {
        console.log(data)
        let { code, content } = data;
        let categories = []
        categories = content
        switch(code) {
            case 200:
                dispatch({
                    type: GET_CATEGORIES_SUCCESS,
                    payload: categories
                })
                break;
            default:
                alert("Please contact developer");
                dispatch({
                    type: GET_CATEGORIES_FAIL,
                    payload: "Unknown error"
                })
                break;
        }
    }).catch(err => {
        alert("Please contact developer");
        dispatch({
            type: GET_CATEGORIES_FAIL,
            payload: "Unknown error"
        })
    })
}

export const deleteCategory = (dispatch, postData) => {
    dispatch({
        type: DEL_CATEGORY_REQUEST
    });
    axios.post(`${BASE_API_URL}api/category/deleteCategory`, postData)
    .then(({data}) => {
        let { code } = data;
        switch(code) {
            case 200:
                dispatch({
                    type: DEL_CATEGORY_SUCCESS,
                    payload: postData.id
                })
                break;
            default:
                alert("Please contact developer");
                dispatch({
                    type: DEL_CATEGORY_FAIL,
                    payload: "Unknown error"
                })
                break;
        }
    }).catch(err => {
        alert("Please contact developer");
        dispatch({
            type: DEL_CATEGORY_FAIL,
            payload: "Unknown error"
        })
    })
}

export const toggleCategory = (dispatch, postData) => {
    dispatch({
        type: TOGGLE_CATEGORY_REQUEST
    });
    console.log("AA")
    axios.post(`${BASE_API_URL}api/category/toggleCategory`, postData)
    .then(({data}) => {
        let { code, is_scraped } = data;
        switch(code) {
            case 200:
                dispatch({
                    type: TOGGLE_CATEGORY_SUCCESS,
                    payload: {
                        id: postData.id,
                        is_scraped: is_scraped,
                    },
                })
                break;
            default:
                alert("Please contact developer");
                dispatch({
                    type: TOGGLE_CATEGORY_FAIL,
                    payload: "Unknown error"
                })
                break;
        }
    }).catch(err => {
        alert("Please contact developer");
        dispatch({
            type: TOGGLE_CATEGORY_FAIL,
            payload: "Unknown error"
        })
    })
}


export const proposeScraping = (dispatch) => {
    console.log("ASDASD")
    axios.post(`${BASE_API_URL}api/category/proposeScrape`)
    .then(({data}) => {
        let { code, content } = data;
        console.log(content)
        switch(code) {
            case 200:
                alert("Successfully proposed. please wait for ready")
                break;
            case 300:
                alert("Invalid arguments");
                break;
            case 404:
                alert("Already exist");
                break;
            default:
                alert("Please contact developer");
                break;
        }
    }).catch(err => {
        alert("Please contact developer");
    })
}