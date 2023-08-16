const userModel = require("../models/user.model");


const userCtrl = {
    searchUser: async (req, res) => {
        try {
            const users = await userModel.find({username: {$regex: req.query.username}})
            .limit(10).select("fullname username profilePicture")
            
            res.json({users})
        } catch (error) {
            console.log(error);
            return res.status(500).json({msg: err.message})
        }
    },
    getUserDetails: async (req,res) => {
        try {
            const id  = req.userId
            const user = await userModel.findById(id).select('-password')
            .populate("followers following", "-password")
            res.json(user)
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: error.message })
        }
    },
    getUser: async (req, res) => {
        try {
            const user = await userModel.findById(req.params.id).select('-password')
            .populate("followers following", "-password")
            if(!user) return res.status(400).json({msg: "User does not exist."})
            res.json({user})
        } catch (error) {
            console.log(error);
            return res.status(500).json({msg: err.message})
        }
    },
    updateUser: async (req, res) => {
        try {
            const { profilePicture, fullname, mobile, address, bio, gender } = req.body
            // console.log({ profilePicture, fullname, mobile, address, bio, gender });
            if(!fullname) return res.status(400).json({msg: "Please add your full name."})

            await userModel.findOneAndUpdate({_id: req.userId}, {
                profilePicture, fullname, mobile, address, bio, gender
            })

            res.json({msg: "Update Success!"})

        } catch (error) {
            console.log(error);
            return res.status(500).json({msg: error.message})
        }
    },
    follow: async (req, res) => {
        try {
            const user = await userModel.find({_id: req.params.id, followers: req.userId})
            if(user.length > 0) return res.status(500).json({msg: "You followed this user."})

            const newUser = await userModel.findOneAndUpdate({_id: req.params.id}, { 
                $push: {followers: req.userId}
            }, {new: true}).populate("followers following", "-password")

            await userModel.findOneAndUpdate({_id: req.userId}, {
                $push: {following: req.params.id}
            }, {new: true})

            res.json({newUser})

        } catch (error) {
            console.log(error);
            return res.status(500).json({msg: error.message})
        }
    },
    unfollow: async (req, res) => {
        try {

            const newUser = await userModel.findOneAndUpdate({_id: req.params.id}, { 
                $pull: {followers: req.userId}
            }, {new: true}).populate("followers following", "-password")

            await userModel.findOneAndUpdate({_id: req.userId}, {
                $pull: {following: req.params.id}
            }, {new: true})

            res.json({newUser})

        } catch (error) {
            console.log(error);
            return res.status(500).json({msg: error.message})
        }
    },
    suggestionsUser: async (req, res) => {
        try {
            
            const user = await userModel.findById(req.userId)
            const newArr = [...user.following, user._id]

            const num  = req.query.num || 10

            const users = await userModel.aggregate([
                { $match: { _id: { $nin: newArr } } },
                { $sample: { size: Number(num) } },
                { $lookup: { from: 'users', localField: 'followers', foreignField: '_id', as: 'followers' } },
                { $lookup: { from: 'users', localField: 'following', foreignField: '_id', as: 'following' } },
            ]).project("-password")

            return res.json({
                users,
                result: users.length
            })

        } catch (err) {
            console.log(err);
            return res.status(500).json({msg: err.message})
        }
    },
}

module.exports = userCtrl;