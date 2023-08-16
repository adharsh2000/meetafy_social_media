const router = require('express').Router()
const verifyToken = require('../helpers/verifyToken')
const notifyCtrl = require('../controllers/notify.controller')

router.post('/notify', verifyToken, notifyCtrl.createNotify)
router.delete('/notify/:id', verifyToken, notifyCtrl.removeNotify)
router.get('/notifies',verifyToken,  notifyCtrl.getNotifies)
router.patch('/isReadNotify/:id', verifyToken, notifyCtrl.isReadNotify)
router.delete('/deleteAllNotify', verifyToken, notifyCtrl.deleteAllNotifies)

module.exports = router