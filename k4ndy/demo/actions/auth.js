import {AUTH} from '../constants/actionTypes';
import * as api from '../api/index.js';

// Iniciar sesión
export const signin = (formData, router) => async (dispatch) => {

    try {
        const {data} = await api.signIn(formData);
        //console.log("los datos estan llegando: " + data)
        dispatch({type: AUTH, data});
        router.push('/');
    } catch (error) {
        const data = error.response && error.response.data;
        //console.log("Data: "+data);
        //Muy importante para consumir desde el Frontend -_-
        dispatch({type: AUTH, data});
    }
};

//Reguistrarse
export const signup = (formData, router) => async (dispatch) => {
    try {
        const {data} = await api.signUp(formData);

        dispatch({type: AUTH, data});

        router.push('/');
    } catch (error) {
        console.log(error);
        const response = error.response;
        const data = response && response.data;
        //const statusCode = response && response.status;

        // console.log("Data:", data);
        // console.log("Status Code:", statusCode);

        dispatch({ type: AUTH, data });
    }
};
