const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20');
const userModel = require("../models/user.model");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/api/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        // console.log(profile);
        const existing = await userModel.findOne({ googleId: profile.id })
        if (existing) {
          return done(null, existing, { message: "Logged in succesfully" })
        }
        const emailExisting = await userModel.findOne({
          email: profile.emails[0].value,
        })
        if (emailExisting) return done({ message: "User already exists" })
        const user = new userModel({
          fullname: profile.displayName.toLowerCase(),
          username: (profile.name.givenName).toLowerCase(),
          email: profile.emails[0].value,
          profilePicture: profile.photos[0]?.value,
          googleId: profile.id,
          verified: true,
        })
        await user.save()
        return done(null, user)
      } catch (error) {
        console.log(error)
        done(error)
      }
    }
  )
)
