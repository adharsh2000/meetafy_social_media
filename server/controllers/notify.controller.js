const Notifies = require('../models/notify.model');
const userModel = require('../models/user.model');

const notifyCtrl = {
    createNotify: async (req, res) => {
        try {
            const { id, recipients, url, text, content, image, user } = req.body

            // console.log({ id, recipients, url, text, content, image, user });
            if(recipients.includes(user._id.toString())) return;

            const notify = new Notifies({
                id, recipients, url, text, content, image, user:user._id
            })

            await notify.save()
            return res.json({notify})
            // return res.json({ id, recipients, url, text, content, image, user })
        } catch (err) {
            console.log(err);
            return res.status(500).json({msg: err.message})
        }
    },
    removeNotify: async (req, res) => {
        try {
    
            const notify = await Notifies.findOneAndDelete({
                id: req.params.id, url: req.query.url
            })
    
            return res.json({notify})
        } catch (err) {
            console.log(err);
            return res.status(500).json({msg: err.message})
        }
    },
    getNotifies: async (req, res) => {
        try {
            const user = await userModel.findById(req.userId);
            const notifies = await Notifies.find({recipients: user._id})
            .sort('-createdAt').populate('user', 'profilePicture username')
            return res.json({notifies})
        } catch (err) {
            console.log(err);
            return res.status(500).json({msg: err.message})
        }
    },
    isReadNotify: async (req, res) => {
        try {
            const notifies = await Notifies.findOneAndUpdate({_id: req.params.id}, {
                isRead: true
            })

            return res.json({notifies})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteAllNotifies: async (req, res) => {
        try {
            // const user = await userModel.findById(req.userId);
            const notifies = await Notifies.deleteMany({recipients: req.userId})
            
            return res.json({notifies})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
}

module.exports = notifyCtrl