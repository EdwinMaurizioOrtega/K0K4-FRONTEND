import {
    START_LOADING,
    END_LOADING,
    FETCH_ALL,
    FETCH_POST,
    FETCH_BY_SEARCH,
    CREATE, UPDATE,
    DELETE,
    TOPPOST,
    LIKE,
    COMMENT,
    FETCH_BY_CREATOR,
    FETCH_BY_ID_CREATOR,
    FETCH_CAROUSEL_POST
} from '../constants/actionTypes';

import * as api from '../api/index.js';

export const getPost = (id) => async (dispatch) => {
    try {
        dispatch({type: START_LOADING});

        const {data} = await api.fetchPost(id);

        console.log("data:" + JSON.stringify(data));

        dispatch({type: FETCH_POST, payload: {post: data}});
        dispatch({type: END_LOADING});

    } catch (error) {
        console.log(error);
    }
};


export const getPosts = (page, category, city) => async (dispatch) => {
    try {
        dispatch({type: START_LOADING});
        const {data: {data, currentPage, numberOfPages}} = await api.fetchPosts(page, category, city);

        dispatch({type: FETCH_ALL, payload: {data, currentPage, numberOfPages}});
        dispatch({type: END_LOADING});
    } catch (error) {
        console.log(error);
    }
};

//Post en el Carousel / Slider home
export const getPostsInCarousel = () => async (dispatch) => {
    try {
        dispatch({type: START_LOADING});
        const {data: {data}} = await api.fetchPostsInCarouselSlider();
        dispatch({type: FETCH_CAROUSEL_POST, payload: {data}});
        dispatch({type: END_LOADING});
    } catch (error) {
        console.log(error);
    }
};

export const getPostsByCreator = (name) => async (dispatch) => {
    try {
        dispatch({type: START_LOADING});
        const {data: {data}} = await api.fetchPostsByCreator(name);

        dispatch({type: FETCH_BY_CREATOR, payload: {data}});
        dispatch({type: END_LOADING});
    } catch (error) {
        console.log(error);
    }
};

export const getPostsBySearch = (searchQuery) => async (dispatch) => {
    try {
        dispatch({type: START_LOADING});
        const {data: {data}} = await api.fetchPostsBySearch(searchQuery);

        dispatch({type: FETCH_BY_SEARCH, payload: {data}});
        dispatch({type: END_LOADING});
    } catch (error) {
        console.log(error);
    }
};

export const getPostsByCity = (searchQuery) => async (dispatch) => {
    try {
        dispatch({type: START_LOADING});
        const {data: {data}} = await api.fetchPostsByCity(searchQuery);

        dispatch({type: FETCH_BY_SEARCH, payload: {data}});
        dispatch({type: END_LOADING});
    } catch (error) {
        console.log(error);
    }
};

export const createPost = (post, history) => async (dispatch) => {
    try {
        dispatch({type: START_LOADING});

        //console.log("post_post: "+JSON.stringify( post));

        const {data} = await api.createPost(post);

        dispatch({type: CREATE, payload: data});

        history.push(`/${data.category}/${data.city}/${data._id.$oid}`);
    } catch (error) {
        console.log(error);
    }
};

export const updatePost = (id, post) => async (dispatch) => {
    try {
        const {data} = await api.updatePost(id, post);

        dispatch({type: UPDATE, payload: data});
    } catch (error) {
        console.log(error);
    }
};

export const likePost = (id) => async (dispatch) => {
    const user = JSON.parse(localStorage.getItem('profile'));

    try {
        const {data} = await api.likePost(id, user?.token);

        dispatch({type: LIKE, payload: data});
    } catch (error) {
        console.log(error);
    }
};

export const commentPost = (value, id) => async (dispatch) => {
    try {
        const {data} = await api.comment(value, id);

        dispatch({type: COMMENT, payload: data});

        return data.comments;
    } catch (error) {
        console.log(error);
    }
};

export const deletePost = (id) => async (dispatch) => {
    try {
        await api.deletePost(id);
        dispatch({type: DELETE, payload: id});
    } catch (error) {
        console.log(error);
    }
};

export const topBannerUploadedIn = (id, history) => async (dispatch) => {
    try {
        await api.topPost(id);
        // dispatch({ type: TOPPOST, payload: id });
        history.push(`/`);
    } catch (error) {
        console.log(error);
    }
}


//Buscar los posts por el id del creador
export const getPostsByIdCreator = (id) => async (dispatch) => {
    //console.log("ididididid: "+id);
    try {
        dispatch({type: START_LOADING});
        const {data: {data}} = await api.fetchPostsByIdCreator(id);

        dispatch({type: FETCH_BY_ID_CREATOR, payload: {data}});
        dispatch({type: END_LOADING});
    } catch (error) {
        console.log(error);
    }
};
