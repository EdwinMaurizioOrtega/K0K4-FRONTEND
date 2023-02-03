import axios from "axios";
import * as api from '../api/index.js';

export default class CarouselPosts {

    getProductsSmall() {
        //return axios.get('https://coral-app-bsb86.ondigitalocean.app/posts/in_carousel').then((res) => res.data.data);
        return api.fetchPostsInCarouselSlider();

    }
}
