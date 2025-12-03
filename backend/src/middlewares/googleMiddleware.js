import passport from 'passport'
import { env } from '~/config/environment'

export const googleMiddleware = (req, res, next) => {
  passport.authenticate('google', { session: false, failureRedirect: `${env.WEBSITE_DOMAIN_DEV}/signin` }, (err, user, info) => {
    if (err || !user) {
      return res.redirect(`${env.WEBSITE_DOMAIN_DEV}/signin`)
    }
    req.user = user
    next()
  })(req, res, next)
}