const router = require('express').Router()
const commentCtrl = require('../controllers/comment.controller')
const verifyToken = require('../helpers/verifyToken')

router.post('/comment', verifyToken, commentCtrl.createComment)
router.patch('/comment/:id', verifyToken, commentCtrl.updateComment)
router.patch('/comment/:id/like', verifyToken, commentCtrl.likeComment)
router.patch('/comment/:id/unlike', verifyToken, commentCtrl.unLikeComment)
router.delete('/comment/:id', verifyToken, commentCtrl.deleteComment)

module.exports = router;