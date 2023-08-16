const Admin = require('../models/admin.model');


const adminCtrl = {
    login: async (req,res) => {
        try {
            console.log("admin login section");
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: error.message })
        }
    }
}

module.exports = adminCtrl;