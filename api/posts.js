const express = require('express');
const { getAllPosts, createPost, updatePost, getPostById } = require('../db'); 
const { requireUser } = require('./utils');
const postsRouter = express.Router();
const bodyParser = require('body-parser');

postsRouter.use(bodyParser.json());

postsRouter.post('/', requireUser, async (req, res, next) => {
  try {
    const { title, content, tags = [] } = req.body;

    const postData = {
      title,
      content,
      authorId: req.user.id,
      tags: Array.isArray(tags) ? tags : [tags], // Ensure tags is an array
    };

    const post = await createPost(postData);

    if (post) {
      res.status(201).json({ post });
    } else {
      throw new Error('Failed to create post.');
    }
  } catch (error) {
    next(error);
  }
});

postsRouter.patch('/:postId', requireUser, async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { title, content, tags } = req.body;

    const updateFields = {};

    if (tags && tags.length > 0) {
      updateFields.tags = Array.isArray(tags) ? tags : [tags]; // Ensure tags is an array
    }

    if (title) {
      updateFields.title = title;
    }

    if (content) {
      updateFields.content = content;
    }

    const originalPost = await getPostById(postId);

    if (originalPost.author.id === req.user.id) {
      const updatedPost = await updatePost(postId, updateFields);
      res.json({ post: updatedPost });
    } else {
      throw new Error('You cannot update a post that is not yours');
    }
  } catch (error) {
    next(error);
  }
});

postsRouter.delete('/:postId', requireUser, async (req, res, next) => {
  try {
    console.log("Delete Post Request Received"); // Log the start of the request handling

    const post = await getPostById(req.params.postId);
    console.log("Retrieved Post:", post); // Log the retrieved post

    if (post && post.author.id === req.user.id) {
      console.log("Authorized to delete the post");

      const updatedPost = await updatePost(post.id, { active: false });
      console.log("Updated Post:", updatedPost); // Log the updated post

      res.json({ post: updatedPost });
    } else {
      console.log("Unauthorized to delete the post");

      // if there was a post, throw UnauthorizedUserError, otherwise throw PostNotFoundError
      throw new Error(
        post
          ? "You cannot delete a post which is not yours"
          : "That post does not exist"
      );
    }
  } catch (error) {
    console.log("Error occurred:", error.name, error.message); // Log the error
    next(error);
  }
});

postsRouter.get('/:tagName/posts', async (req, res, next) => {
  try {
    const { tagName } = req.params;

    const allPosts = await getAllPosts();
    
    const posts = allPosts.filter(post => {
      
      if (!post.active && (!req.user || post.author.id !== req.user.id)) {
        return false;
      }

      return post.tags.includes(tagName);
    });

    res.json({ posts });
  } catch (error) {
    next(error);
  }
});



postsRouter.get('/', async (req, res, next) => {
  try {
    const posts = await getAllPosts();
    res.json({ posts }); 
  } catch (error) {
    next(error);
  }
});

module.exports = postsRouter;
