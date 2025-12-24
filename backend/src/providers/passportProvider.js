import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { userModel } from '~/models/userModel.js'
import { env } from '~/config/environment'
import { CALLBACK_URL } from '~/utils/constants'
import { Strategy as FacebookStrategy } from 'passport-facebook'

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${CALLBACK_URL}/v1/users/google/callback`,
      passReqToCallback: true
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        // Tìm user theo googleId
        let user = await userModel.findOneByGoogleId(profile.id)
        // chưa có user thì tạo mới
        if (!user) {
          // Tìm theo email xem có user chưa (trường hợp đăng ký bằng email/password rồi sau đó đăng nhập google)
          const localUser = await userModel.findOneByEmail(profile.emails[0].value)
          if (!localUser) {
            const newUserData = {
              email: profile.emails[0].value,
              username: profile.displayName,
              fullName: profile.displayName,
              authProvider: 'google',
              googleId: profile.id,
              avatar: profile?.photos[0]?.value || null,
              isActive: true
            }
            const newUser = await userModel.createNew(newUserData)
            user = await userModel.findOneById(newUser.insertedId)
          }
          else {
            // đã có user thì cập nhật thêm googleId và chuyển authProvider thành hybrid
            const updatedData = {
              googleId: profile.id,
              authProvider: 'hybrid',
              avatar: profile?.photos[0]?.value || null,
              isActive: true
            }
            user = await userModel.update(localUser._id, updatedData)
          }
        }
        done(null, user)
      } catch (error) {
        // Handle error
        done(error, null)
      }
    }
  )
)

passport.use(
  new FacebookStrategy(
    {
      clientID: env.FACEBOOK_APP_ID,
      clientSecret: env.FACEBOOK_APP_SECRET,
      callbackURL: `${CALLBACK_URL}/v1/users/facebook/callback`,
      profileFields: ['id', 'displayName', 'emails', 'photos'],
      passReqToCallback: true
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        // Tìm user theo facebookId
        let user = await userModel.findOneByFacebookId(profile.id)
        // chưa có user thì tạo mới
        if (!user) {
          // Tìm theo email xem có user chưa (trường hợp đăng ký bằng email/password rồi sau đó đăng nhập facebook)
          const localUser = await userModel.findOneByEmail(profile.emails[0].value)
          if (!localUser) {
            const newUserData = {
              email: profile.emails[0].value || null,
              username: profile.displayName,
              fullName: profile.displayName,
              authProvider: 'facebook',
              facebookId: profile.id,
              avatar: profile?.photos[0]?.value || null,
              isActive: true
            }
            const newUser = await userModel.createNew(newUserData)
            user = await userModel.findOneById(newUser.insertedId)
          }
          else {
            // đã có user thì cập nhật thêm facebookId và chuyển authProvider thành hybrid
            const updatedData = {
              facebookId: profile.id,
              authProvider: 'hybrid',
              avatar: profile?.photos[0]?.value || null,
              isActive: true
            }
            user = await userModel.update(localUser._id, updatedData)
          }
        }
        done(null, user)
      } catch (error) {
        // Handle error
        done(error, null)
      }
    }
  )
)