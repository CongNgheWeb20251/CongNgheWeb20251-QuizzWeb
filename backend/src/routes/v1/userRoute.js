import express from 'express'
import { userValidation } from '~/validations/userValidation'
import { userController } from '~/controllers/userController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { multerUploadMiddleware } from '~/middlewares/multerUploadMiddleware'
import passport from 'passport'
import { googleMiddleware } from '~/middlewares/googleMiddleware'
import { facebookMiddleware } from '~/middlewares/facebookMiddleware'

const Router = express.Router()

Router.route('/register')
  .post(userValidation.createNew, userController.createNew)

Router.route('/verify')
  .put(userValidation.verifyAccount, userController.verifyAccount)

Router.route('/login')
  .post(userValidation.login, userController.login)

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

Router.route('/logout')
  .delete(userController.logout)

Router.route('/refresh_token')
  .get(userController.refreshToken)

Router.route('/update')
  .put(
    authMiddleware.isAuthorized,
    multerUploadMiddleware.upload.single('avatar'),
    userValidation.update,
    userController.update
  )

Router.route('/me')
  .get(authMiddleware.isAuthorized, userController.getCurrentUser)

export const userRoute = Router