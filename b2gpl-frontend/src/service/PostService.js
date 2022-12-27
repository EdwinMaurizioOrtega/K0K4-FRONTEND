import axios from "axios";

const API_URL = "http://192.168.1.16:8080/api/post/";

const getPublished = () => {
    return axios.get(API_URL + "published");
}

const PostService = {
    getPublished
}

export default PostService
