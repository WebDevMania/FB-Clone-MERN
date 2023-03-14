const User = require("../models/User");
const Post = require("../models/Post");

const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        return res.status(200).json(post);
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

const getUserPosts = async (req, res) => {
    try {
        const userPosts = await Post.find({ userId: req.params.id });
        if (userPosts == false || userPosts.length <= 0) {
            throw new Error("No posts from this user");
        } else {
            return res.status(200).json(userPosts);
        }
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

const createPost = async (req, res) => {
    try {
        const isEmpty = Object.values(req.body).some((v) => !v);
        if (isEmpty) {
            throw new Error("Fill all fields!");
        }

        const post = await Post.create({ ...req.body, userId: req.user.id });
        return res.status(201).json(post)
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

const updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (post.userId === req.body.userId) {
            const updatedPost = await Post.findByIdAndUpdate(
                req.body.userId,
                { $set: req.body },
                { new: true }
            );

            return res.status(200).json(updatedPost);
        } else {
            throw new Error("You can only update your own posts");
        }
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (post.userId === req.body.userId) {
            await post.delete()
            console.log('hey');
            return res.status(200).json({ msg: "Successfully deleted post" });
        } else {
            throw new Error("You can only delete your own posts");
        }
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            throw new Error("No such post");
        }

        const isLikedByCurrentUser = post.likes.includes(req.user.id);
        if (isLikedByCurrentUser) {
            throw new Error("Can't like a post two times");
        } else {
            await Post.findByIdAndUpdate(
                req.params.postId,
                { $push: { likes: req.user.id } },
                { new: true }
            );
            return res.status(200).json({ msg: "Post has been successfully liked" });
        }
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

const dislikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            throw new Error("No such post");
        }

        const isLikedByCurrentUser = post.likes.includes(req.user.id);
        if (isLikedByCurrentUser) {
            await Post.findByIdAndUpdate(
                req.params.postId,
                { $pull: { likes: req.user.id } },
                { new: true }
            );
            return res.status(200).json({ msg: "Post has been successfully liked" });
        } else {
            throw new Error("Can't dislike that you haven't liked");
        }
    } catch (error) {
        return res.status(500).json(error.message);
    }
};

const getTimelinePosts = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        const userPosts = await Post.find({ userId: currentUser._id });
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({ userId: friendId })
            })
        );
        return res.json(userPosts.concat(...friendPosts).sort((a, b) => b.createdAt - a.createdAt))
    } catch (err) {
        res.status(500).json(err);
    }
}

module.exports = {
    getPost,
    getUserPosts,
    createPost,
    updatePost,
    deletePost,
    likePost,
    dislikePost,
    getTimelinePosts
};