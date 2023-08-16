const router = require('express').Router()
const userCtrl = require('../controllers/user.controller')
const verifyToken = require('../helpers/verifyToken')

router.get('/user/search', verifyToken, userCtrl.searchUser)
router.get('/user/userdetails', verifyToken, userCtrl.getUserDetails)
router.get('/user/:id', verifyToken, userCtrl.getUser)
router.patch('/user', verifyToken, userCtrl.updateUser)
router.patch('/user/:id/follow', verifyToken, userCtrl.follow)
router.patch('/user/:id/unfollow', verifyToken, userCtrl.unfollow)
router.get('/suggestionsUser', verifyToken, userCtrl.suggestionsUser)


module.exports = router;

