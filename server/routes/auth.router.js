const router = require('express').Router()
const authCtrl = require('../controllers/auth.controller')
const verifyToken = require('../helpers/verifyToken')
const passport = require('passport')

router.post('/register', authCtrl.register)
router.post('/login', authCtrl.login)
router.post('/logout', authCtrl.logout)
router.get('/:id/verify', authCtrl.verifyAccount)
router.post('/refresh-token', authCtrl.generateRefreshToken)

router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  )

router.get("/auth/google/callback", authCtrl.googleAuthentication)
router.get("/auth/google/failure", authCtrl.failedGoogleAuthentication)

module.exports = router;