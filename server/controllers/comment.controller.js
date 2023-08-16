const Comment = require('../models/comment.model')
const Post = require('../models/post.model')

const commentCtrl = {
    createComment: async (req, res) => {
        try {
            const {postId, content, tag, reply, postUserId } = req.body

            const post = await Post.findById(postId)
            if(!post) return res.status(400).json({msg: "This post does not exist."})

            if(reply){
                const cm = await Comment.findById(reply)
                if(!cm) return res.status(400).json({msg: "This comment does not exist."})
            }

            const newComment = new Comment({
                user: req.userId, content, tag, reply, postUserId, postId
            })
         
            await Post.findOneAndUpdate({_id: postId}, {
                $push: {comments: newComment._id}
            }, {new: true})
           
            await newComment.save()

            res.json({newComment})
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: error.message })
        }
    },
    updateComment: async (req,res) => {
        try {
            const {content} = req.body;
            
            await Comment.findOneAndUpdate({
                _id:req.params.id, user:req.userId
            },{content});
            res.json({msg: 'Comment Updated!'})
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: error.message })
        }
    },
    likeComment: async (req, res) => {
        try {
            const comment = await Comment.find({_id: req.params.id, likes: req.userId})
            if(comment.length > 0) return res.status(400).json({msg: "You liked this post."})

            await Comment.findOneAndUpdate({_id: req.params.id}, {
                $push: {likes: req.userId}
            }, {new: true})
            // console.log('liked');
            res.json({msg: 'Liked Comment!'})

        } catch (error) {
            console.log(error);
            return res.status(500).json({msg: err.message})
        }
    },
    unLikeComment: async (req, res) => {
        try {

            await Comment.findOneAndUpdate({_id: req.params.id}, {
                $pull: {likes: req.userId}
            }, {new: true})
            // console.log('unliked');
            res.json({msg: 'UnLiked Comment!'})

        } catch (error) {
            console.log(error);
            return res.status(500).json({msg: err.message})
        }
    },
    deleteComment: async (req, res) => {
        try {
            const comment = await Comment.findOneAndDelete({
                _id: req.params.id,
                $or: [
                    {user: req.userId},
                    {postUserId: req.userId}
                ]
            })

            await Post.findOneAndUpdate({_id: comment.postId}, {
                $pull: {comments: req.params.id}
            })

            res.json({msg: 'Deleted Comment!'})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
}

module.exports = commentCtrl;