import passport from 'passport'
import { WEBSITE_DOMAIN } from '~/utils/constants'

export const facebookMiddleware = (req, res, next) => {
  passport.authenticate('facebook', { session: false, failureRedirect: `${WEBSITE_DOMAIN}/signin` }, (err, user, info) => {
    if (err || !user) {
      return res.redirect(`${WEBSITE_DOMAIN}/signin`)
    }
    req.user = user
    next()
  })(req, res, next)
}