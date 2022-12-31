import express from 'express';

import {
    getPosts,
    getPostsBySearch,
    getPostsByCreator,
    getPostsByIdCreator,
    getPost,
    createPost,
    updatePost,
    likePost,
    commentPost,
    deletePost,
    getPostsByCity
} from '../controllers/posts.js';

const router = express.Router();
import auth from "../middleware/auth.js";

router.get('/creator', getPostsByCreator);
router.get('/city', getPostsByCity);
router.get('/id_creator', getPostsByIdCreator);
router.get('/search', getPostsBySearch);
router.get('/', getPosts);
router.get('/:id', getPost);

router.post('/', auth,  createPost);
router.patch('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);
router.patch('/:id/likePost', auth, likePost);
router.post('/:id/commentPost', commentPost);

export default router;