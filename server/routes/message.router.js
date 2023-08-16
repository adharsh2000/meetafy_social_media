const router = require('express').Router()
const messageCtrl = require('../controllers/message.controller')
const verifyToken = require('../helpers/verifyToken')


router.post('/message', verifyToken, messageCtrl.createMessage);
router.get('/conversations', verifyToken, messageCtrl.getConversations);
router.get('/message/:id', verifyToken, messageCtrl.getMessages);
router.delete('/message/:id', verifyToken, messageCtrl.deleteMessages);
router.delete('/conversation/:id', verifyToken, messageCtrl.deleteConversation);


module.exports = router;