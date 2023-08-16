require('dotenv').config()
const Users = require('../models/user.model')
const passport = require('passport')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Token = require('../models/token.model')
const sendEmail = require('../utils/nodeMailer')
const crypto = require('crypto')



const authCtrl = {
    register: async (req, res) => {
        try {
            const { fullname, username, email, password, gender } = req.body
            let correctedUsername = username.toLowerCase().replace(/ /g, '');

            const newUsername = await Users.findOne({ username: correctedUsername })
            if (newUsername) return res.status(400).json({ msg: "This username already exists." })

            const userEmail = await Users.findOne({ email: email })
            if (userEmail) return res.status(400).json({ msg: "This email already exists." })

            if (password.length > 6) {
                return res.status(400).json({ msg: "Password must be at least 6 characters." })
            }

            const hashedPassword = await bcrypt.hash(password, 10)

            let newUser = await new Users({
                fullname, username: correctedUsername, email, password: hashedPassword, gender
            }).save()

            const token = await new Token({
                userId: newUser._id,
                token: crypto.randomBytes(32).toString("hex")
            }).save();
            // `<p>Please click the following link to verify your email:</p> ${process.env.BASE_URL}${newUser._id}/verify`
            // const url = `${process.env.BASE_URL}${newUser._id}/verify`;
            const url =  `Please click the following link to verify your email: ${process.env.BASE_URL}${newUser._id}/verify`;
            await sendEmail(newUser.email, "MEETAFY Verify Email", url);
            res.json({
                msg: "An Email sent to your account please verify"
            })

        } catch (error) {
            return res.status(500).json({ msg: error.message, success: false })
        }
    },
    verifyAccount: async (req, res) => {
        try {
            // console.log("entered to account verify");
            const user = await Users.findOne({ _id: req.params.id })
            // console.log("1");
            if (!user) return res.status(400).json({ msg: 'invalid link!' })
            // console.log("5");
            await Users.updateOne(
                { _id: user._id },
                { $set: { verified: true } }
            );
            // console.log("6");
            res.status(200).json({ msg: 'Email verified Successfully' })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    login: async (req, res) => {
        try {
            // console.log('1212');
            const { email, password } = req.body
            // console.log(email,password+"inc");
            const user = await Users.findOne({ email })
            .populate("followers following", "profilePicture username fullname followers following")

            if (!user) return res.status(400).json({ msg: "This email does not exist." })

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) return res.status(400).json({ msg: "Password is incorrect." })

            //not need
            if (!user.verified) {
                let token = await Token.findOne({ userId: user._id });
                if (!token) {
                    token = await new Token({
                        userId: user._id,
                        token: crypto.randomBytes(32).toString("hex"),
                    }).save();
                    const url = `${process.env.BASE_URL}${user.id}/verify/${token.token}`;
                    await sendEmail(user.email, "Verify Email", url);
                }

                return res
                    .status(400)
                    .json({ msg: "An Email sent to your account please verify" });
            }

            const accessToken = createAccessToken({ id: user._id })
            const refreshToken = createRefreshToken({ id: user._id })

            res.json({
                success: true,
                msg: 'Login Success!',
                accessToken,
                refreshToken,
                user: {
                    ...user._doc,
                    password: ''
                }
            })
        } catch (error) {
            return res.status(500).json({ msg: err.message, success: false })
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', { path: '/api/refresh_token' })
            return res.json({ msg: "Loggedout Successfully!" })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },


    generateRefreshToken: (req, res) => {
        const refreshToken = req.body.refreshToken;

        // Check if the refresh token exists and is valid
        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token not provided' });
        }

        jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, async (err, result) => {
            if (err) return res.status(400).json({ msg: "Please login now." })

            const user = await Users.findById(result.id)

            if (!user) return res.status(400).json({ msg: "This does not exist." })
            const accessToken = createAccessToken({ id: result.id })
            const refreshToken = createRefreshToken({ id: result.id })
            // Send the new access token to the client
            res.status(200).json({ accessToken, refreshToken });
        })
    },
    googleAuthentication: (req, res) => {
        // console.log("called")
        passport.authenticate("google", { session: false }, async (err, user) => {
            try {
                if (err) {
                    throw err
                }
                // console.log('token called');
                // const token = createAccessToken(user._id)
                const token = createAccessToken({ id: user._id })
                // res.cookie("googleToken", token)
                console.log(token)
                res.redirect(`http://localhost:3000/login?googleToken=${token}`)
            } catch (error) {
                console.log(error)
                return res.redirect(
                    "http://localhost:3000/login?authentication=failed"
                )
            }
        })(req, res)
    },
    failedGoogleAuthentication : async (req, res) => {
        res.redirect("http://localhost:3000/login?authentication=failed")
    }
}


const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
}

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' })
}

module.exports = authCtrl;  