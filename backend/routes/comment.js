const { getCommentsFromPost, deleteComment, toggleLike, createComment } = require('../controllers/commentController')
const verifyToken = require('../middlewares/auth')
const commentRouter = require('express').Router()

// get all comments from post
commentRouter.get('/:postId', getCommentsFromPost)

// create a comment
commentRouter.post('/', verifyToken, createComment)

// delete a comment
commentRouter.delete('/:commentId', verifyToken, deleteComment)

// like/unlike a comment
commentRouter.put('/toggleLike/:commentId', verifyToken, toggleLike)

module.exports = commentRouter