const express = require('express');
const { getAllPosts } = require('../db'); 

const postsRouter = express.Router();


postsRouter.get('/', async (req, res, next) => {
  try {
    const posts = await getAllPosts();
    res.json({ posts }); 
  } catch (error) {
    next(error);
  }
});

module.exports = postsRouter;
