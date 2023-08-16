const router = require('express').Router()
const postCtrl = require('../controllers/post.controller')
const verifyToken = require('../helpers/verifyToken')

router.post('/post/createpost', verifyToken, postCtrl.createPost)
router.get('/post',verifyToken, postCtrl.getPosts)
router.patch('/post/:id/like', verifyToken, postCtrl.likePost)
router.patch('/post/:id/unlike', verifyToken, postCtrl.unLikePost)
router.patch('/post/savepost/:id',verifyToken, postCtrl.savePost)
router.patch('/post/unsavepost/:id',verifyToken, postCtrl.unSavePost)
router.route('/post/:id')
    .patch(verifyToken, postCtrl.updatePost)
    .get(verifyToken, postCtrl.getPost)
    .delete(verifyToken, postCtrl.deletePost)

router.get('/user_posts/:id', verifyToken, postCtrl.getUserPosts)
router.get('/getSavePosts', verifyToken, postCtrl.getSavePosts)
router.get('/postdiscover', verifyToken, postCtrl.getPostsDicover)

module.exports = router;