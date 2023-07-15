import express from 'express';
import mongoose from 'mongoose';

import PostMessage from '../models/postMessage.js';

const router = express.Router();

//Obtiene los anuncios
export const getPosts = async (req, res) => {
    const { page, category, city } = req.query;

    try {
        const LIMIT = 30;
        const startIndex = (Number(page) - 1) * LIMIT; // obtener el índice de inicio de cada página

        let query = {};

        if (typeof category !== 'undefined' && category !== 'undefined') {
            query.category = category; // agregar la categoría a la consulta si está presente
        }

        if (typeof city !== 'undefined' && city !== 'undefined') {
            query.city = city; // Agregar la condición de la ciudad a la consulta si está presente
        }

        const total = await PostMessage.countDocuments(query);
        const posts = await PostMessage.find(query).sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

        res.json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT)});
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getPostsInCarousel = async (req, res) => {

    try {
            const posts = await PostMessage.find({inCarousel: true, topBannerUploadedIn: {$exists: true}})
                .sort({topBannerUploadedIn: -1})
                .limit(10);
            res.json({data: posts});

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getPostsInCarouselByCity = async (req, res) => {

    console.log(req.query.city);
    const city = req.query.city;

    try {
        const posts = await PostMessage.find({inCarousel: true, city: city, topBannerUploadedIn: {$exists: true}})
            .sort({topBannerUploadedIn: -1})
            .limit(10);
        res.json({data: posts});

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getPostsBySearch = async (req, res) => {
    const { searchQuery, tags } = req.query;

    try {
        const title = new RegExp(searchQuery, "i");

        const posts = await PostMessage.find({ $or: [ { title }, { tags: { $in: tags.split(',') } } ]});

        res.json({ data: posts });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getPostsByCreator = async (req, res) => {
    const { name } = req.query;

    try {
        const posts = await PostMessage.find({ name });

        res.json({ data: posts });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getPostsByIdCreator = async (req, res) => {
    const { creator } = req.query;

    try {
        const posts = await PostMessage.find({ creator });

        res.json({ data: posts });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getPostsByCity = async (req, res) => {
    const { city } = req.query;

    try {
        const posts = await PostMessage.find({ city });

        res.json({ data: posts });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getPost = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await PostMessage.findById(id);

        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createPost = async (req, res) => {
    const post = req.body;

    const newPostMessage = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() })

    try {
        await newPostMessage.save();

        res.status(201).json(newPostMessage);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, cellphone, city, message, creator, selectedFile, tags } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`Anuncio no encontrado con el id: ${id}`);

    const updatedPost = { creator, title, cellphone, city, message, tags, selectedFile, _id: id };

    await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });

    res.json(updatedPost);
}

export const deletePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    await PostMessage.findByIdAndRemove(id);

    res.json({ message: "Post deleted successfully." });
}

export const likePost = async (req, res) => {
    const { id } = req.params;

    if (!req.userId) {
        return res.json({ message: "Unauthenticated" });
      }

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const post = await PostMessage.findById(id);

    const index = post.likes.findIndex((id) => id ===String(req.userId));

    if (index === -1) {
      post.likes.push(req.userId);
    } else {
      post.likes = post.likes.filter((id) => id !== String(req.userId));
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

    res.status(200).json(updatedPost);
}

export const commentPost = async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;

    const post = await PostMessage.findById(id);

    post.comments.push(value);

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

    res.json(updatedPost);
};

export const topPost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No hay publicación con identificación: ${id}`);

    const updatedPost = {inCarousel: true, topBannerUploadedIn: new Date(), _id: id };

    await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });

    res.json(updatedPost);
}

export default router;