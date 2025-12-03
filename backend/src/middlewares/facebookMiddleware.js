import passport from 'passport'
import { env } from '~/config/environment'

export const facebookMiddleware = (req, res, next) => {
  passport.authenticate('facebook', { session: false, failureRedirect: `${env.WEBSITE_DOMAIN_DEV}/signin` }, (err, user, info) => {
    if (err || !user) {
      res.redirect(`${env.WEBSITE_DOMAIN_DEV}/signin`)
      return next(err)
    }
    req.user = user
    next()
  })(req, res, next)
}