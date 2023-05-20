const express = require('express')
const  { getAllTags } = require('../db')

const tagsRouter = express.Router();

tagsRouter.get('/', async (req, res, next) => {
  try {
    const tags = await getAllTags();
    res.json({ tags });
  } catch (error) {
    next(error);
  }
});

module.exports = tagsRouter;