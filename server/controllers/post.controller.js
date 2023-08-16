const Post = require('../models/post.model');
const User = require('../models/user.model');
const Comment = require('../models/comment.model');
const formidable = require('formidable');

class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    paginating() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 9;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}

const postCtrl = {
    createPost: async (req, res) => {
        try {
            const formData = new formidable.IncomingForm();

            formData.parse(req, async (err, fields, files) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ msg: 'Server error' });
                }

                const { description } = fields;

                if (!description) {
                    return res.status(400).json({ msg: 'Please provide a description' });
                }

                const images = fields.images;
                const user = fields.user;
                const userDetails = JSON.parse(user);

                if (!images) {
                    return res.status(400).json({ msg: 'No images uploaded' });
                }
                const mediaData = JSON.parse(images)

                const newPost = new Post({
                    content: description.toString(),
                    images: mediaData,
                    user: userDetails._id,
                })

                const post = await newPost.save()

                res.json({ msg: 'post created successfully',
                 post:{
                    ...post._doc,
                    user:userDetails
                 }
                 });
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: "oops! post can't uploaded , check later", message: error.message })
        }
    },
    getPosts: async (req, res) => {
        try {
            const user = await User.findById(req.userId);

            const following = Array.isArray(user.following) ? user.following : [];

            const features = new APIfeatures(Post.find({
                user: [...following, req.userId]
            }), req.query).paginating()

            const posts = await features.query.sort('-createdAt').lean()
                .populate("user likes", "profilePicture username fullname followers")
                .populate({
                    path: "comments",
                    populate: {
                        path: "user likes",
                        select: "-password"
                    }
                })

            // const uniquePosts = [...new Map(posts.map(post => [post._id.toString(), post])).values()];
            // console.log(uniquePosts);
            res.json({ posts: posts, result: posts.length, msg: 'success!' })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: error.message })
        }
    },
    likePost: async (req, res) => {
        try {
            const post = await Post.find({ _id: req.params.id, likes: req.userId })
            if (post.length > 0) return res.status(400).json({ msg: "you liked this post already!" })

            const like = await Post.findOneAndUpdate({ _id: req.params.id }, {
                $push: { likes: req.userId }
            }, { new: true })

            if (!like) return res.status(400).json({ msg: "This post doesn't exists!" })

            res.json({ msg: "Liked Post!" })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: error.message })
        }
    },
    unLikePost: async (req, res) => {
        try {
            const like = await Post.findByIdAndUpdate({ _id: req.params.id }, {
                $pull: { likes: req.userId }
            }, { new: true })
            if (!like) return res.status(400).json({ msg: 'This post does not exist.' })

            res.json({ msg: 'UnLiked Post!' })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: error.message })
        }
    },
    savePost: async (req, res) => {
        try {
            // console.log("save");
            const user = await User.find({ _id: req.userId, saved: req.params.id })
            if (user.length > 0) return res.status(400).json({ msg: "You saved this post!" })

            const save = await User.findOneAndUpdate({ _id: req.userId }, {
                $push: { saved: req.params.id }
            }, { new: true })

            if (!save) return res.status(400).json({ msg: 'This user does not exist.' })

            res.json({ msg: 'Saved Post!' })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: error.message })
        }
    },
    unSavePost: async (req, res) => {
        try {
            const save = await User.findOneAndUpdate({ _id: req.userId }, {
                $pull: { saved: req.params.id }
            }, { new: true })

            if (!save) return res.status(400).json({ msg: 'This user does not exist.' })

            res.json({ msg: 'unSaved Post!' })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: error.message })
        }
    },
     updatePost: async (req,res) => {
        try {
            const { content, images } = req.body
            const post = await Post.findOneAndUpdate({_id: req.params.id}, {
                content, images
            }).populate("user likes", "profilePicture username fullname")
            .populate({
                path: "comments",
                populate: {
                    path: "user likes",
                    select: "-password"
                }
            })

            res.json({
                msg: "Post Updated Successfully!",
                newPost: {
                    ...post._doc,
                    content, images
                }
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: error.message })
        }
    },
    getUserPosts: async (req, res) => {
        try {
            const features = new APIfeatures(Post.find({user: req.params.id}), req.query)
            .paginating()
            const posts = await features.query.sort("-createdAt")

            res.json({
                posts,
                result: posts.length
            })

        //     const uniquePosts = [...new Set(posts.map((post) => post?._id))].map((postId) =>
        //     posts.find((post) => post?._id === postId)
        //   );
        //   console.log(uniquePosts.length);
        //   res.json({
        //     posts: uniquePosts,
        //     result: uniquePosts.length,
        //   });

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getSavePosts: async (req, res) => {
        try {
            const user = await User.findById(req.userId);
            const features = new APIfeatures(Post.find({
                _id: {$in: user.saved}
            }), req.query).paginating()

            const savePosts = await features.query.sort("-createdAt")

            res.json({
                savePosts,
                result: savePosts.length
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getPost: async (req, res) => {
        try {
            const post = await Post.findById(req.params.id)
            .populate("user likes", "profilePicture username fullname followers")
            .populate({
                path: "comments",
                populate: {
                    path: "user likes",
                    select: "-password"
                }
            })

            if(!post) return res.status(400).json({msg: 'This post does not exist.'})

            res.json({
                post
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getPostsDicover: async (req, res) => {
        try {
            // console.log("idjj"+req.userId);
            const user = await User.findById(req.userId);
            // console.log(user);
            const newArr = [...user.following, user._id]
            // console.log(newArr);
            const num  = req.query.num || 9

            const posts = await Post.aggregate([
                { $match: { user : { $nin: newArr } } },
                { $sample: { size: Number(num) } },
            ])

            return res.json({
                msg: 'Success!',
                result: posts.length,
                posts
            })

        } catch (err) {
            console.log(err);
            return res.status(500).json({msg: err.message})
        }
    },
    deletePost: async (req, res) => {
        try {
            const user = await User.findById(req.userId);
            const post = await Post.findOneAndDelete({_id: req.params.id, user: req.userId})
            await Comment.deleteMany({_id: {$in: post.comments }})
            console.log("deleted post");
            res.json({
                msg: 'Deleted Post!',
                newPost: {
                    ...post,
                    user: user
                }
            })
            // res.json({msg:"deleted"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
}

module.exports = postCtrl;