import express from 'express';

import {
    getPosts,
    getPostsInCarousel,
    getPostsBySearch,
    getPostsByCreator,
    getPostsByIdCreator,
    getPost,
    createPost,
    updatePost,
    topPost,
    likePost,
    commentPost,
    deletePost,
    getPostsByCity
} from '../controllers/posts.js';

const router = express.Router();
import auth from "../middleware/auth.js";

router.get('/in_carousel', getPostsInCarousel);

router.get('/creator', getPostsByCreator);
router.get('/city', getPostsByCity);
router.get('/id_creator', getPostsByIdCreator);
router.get('/search', getPostsBySearch);
router.get('/', getPosts);
router.get('/:id', getPost);


router.post('/', auth,  createPost);
router.patch('/:id', auth, updatePost);

router.put('/:id', topPost);
router.delete('/:id', auth, deletePost);
router.patch('/:id/likePost', auth, likePost);
router.post('/:id/commentPost', commentPost);

export default router;