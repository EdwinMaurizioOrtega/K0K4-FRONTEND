import axios from 'axios';

const API = axios.create({ baseURL: 'https://coral-app-bsb86.ondigitalocean.app' });
//const API = axios.create({ baseURL: 'http://localhost:3000' });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('profile')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
  }

  return req;
});

export const fetchPost = (id) => API.get(`/posts/${id}`);
export const fetchPosts = (page, category, city) => API.get(`/posts?page=${page}&category=${category}&city=${city}`);

//Listar los Post que van en el Carousel / Slider
export const fetchPostsInCarouselSlider = (category, city) => API.get(`/posts/in_carousel?category=${category}&city=${city}`).then((res) => res.data.data);
//export const fetchByCityPostsInCarouselSlider = (name) => API.get(`/posts/in_carousel_by_city?city=${name}`).then((res) => res.data.data);
export const fetchPostsByCreator = (name) => API.get(`/posts/creator?name=${name}`);
//Listar por el id del creador del los post
export const fetchPostsByIdCreator = (creator) => API.get(`/posts/id_creator?creator=${creator}`);

export const fetchPostsByCity = (city) => API.get(`/posts/city?city=${city}`);

export const fetchPostsBySearch = (searchQuery) => API.get(`/posts/search?searchQuery=${searchQuery.search || 'none'}&tags=${searchQuery.tags}`);
export const createPost = (newPost) => API.post('/posts', newPost);
export const likePost = (id) => API.patch(`/posts/${id}/likePost`);
export const comment = (value, id) => API.post(`/posts/${id}/commentPost`, { value });
export const updatePost = (id, updatedPost) => API.patch(`/posts/${id}`, updatedPost);
export const deletePost = (id) => API.delete(`/posts/${id}`);
export const topPost = (id) => API.put(`/posts/${id}`)

export const signIn = (formData) => API.post('/user/signin', formData);
export const signUp = (formData) => API.post('/user/signup', formData);
