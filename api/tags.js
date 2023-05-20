const express = require('express');
const { getAllTags, getPostsByTagName } = require('../db');

const tagsRouter = express.Router();

tagsRouter.use(express.json());

tagsRouter.get('/', async (req, res, next) => {
  try {
    const tags = await getAllTags();
    res.json({ tags });
  } catch (error) {
    next(error);
  }
});

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
  const tagName = req.params.tagName;

  try {
    const posts = await getPostsByTagName(tagName);
    res.json({ posts });
  } catch (error) {
    next(error);
  }
});

module.exports = tagsRouter;
