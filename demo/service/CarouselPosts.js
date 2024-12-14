import axios from "axios";
import * as api from '../api';
import {fetchByCityPostsInCarouselSlider} from "../api";

export default class CarouselPosts {

    getPostsInCarousel(category, city) {
        //return axios.get('https://coral-app-bsb86.ondigitalocean.app/posts/in_carousel').then((res) => res.data.data);
        return api.fetchPostsInCarouselSlider(category, city);

    };

    // getCarouselPostByCity(name) {
    //     //return axios.get('https://coral-app-bsb86.ondigitalocean.app/posts/in_carousel').then((res) => res.data.data);
    //     return api.fetchByCityPostsInCarouselSlider(name);
    //
    // }
}
