import express from 'express'
import { userValidation } from '~/validations/userValidation'
import { userController } from '~/controllers/userController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { multerUploadMiddleware } from '~/middlewares/multerUploadMiddleware'
import passport from 'passport'
import { googleMiddleware } from '~/middlewares/googleMiddleware'
import { facebookMiddleware } from '~/middlewares/facebookMiddleware'
import { authRateLimit, userRateLimit } from '~/middlewares/rateLimit'

const Router = express.Router()

Router.route('/register')
  .post(authRateLimit, userValidation.createNew, userController.createNew)

Router.route('/verify')
  .put(authRateLimit, userValidation.verifyAccount, userController.verifyAccount)

Router.route('/login')
  .post(authRateLimit, userValidation.login, userController.login)

Router.route('/google')
  .get(passport.authenticate('google', {
    authType: 'reauthenticate',
    scope: ['profile', 'email']
  }))

Router.route('/google/callback')
  .get(
    googleMiddleware,
    userController.googleOAuthCallback
  )

Router.route('/facebook')
  .get(passport.authenticate('facebook', {
    authType: 'reauthenticate',
    scope: ['email', 'public_profile']
  }))

Router.route('/facebook/callback')
  .get(
    facebookMiddleware,
    userController.googleOAuthCallback
  )

Router.route('/:id/logout')
  .delete(userController.logout)

Router.route('/refresh_token')
  .get(userController.refreshToken)

Router.route('/forgot-password')
  .post(authRateLimit, userController.forgotPassword)

Router.route('/reset-password')
  .post(authRateLimit, userValidation.resetPassword, userController.resetPassword)

Router.route('/update')
  .put(
    authMiddleware.isAuthorized,
    userRateLimit,
    multerUploadMiddleware.upload.single('avatar'),
    userValidation.update,
    userController.update
  )

Router.route('/me')
  .get(authMiddleware.isAuthorized, userRateLimit, userController.getCurrentUser)

Router.route('/get_2fa_qr_code')
  .get(authMiddleware.isAuthorized, userRateLimit, userController.get2FA_QRCode)

Router.route('/setup_2fa')
  .post(authMiddleware.isAuthorized, userRateLimit, userController.setup2FA)

Router.route('/verify_2fa')
  .put(authMiddleware.isAuthorized, userRateLimit, userController.verify2FA)

export const userRoute = Router