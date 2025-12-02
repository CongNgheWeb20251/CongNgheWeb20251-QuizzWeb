import passport from 'passport'

export const googleMiddleware = (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err || !user) {
      return next(err)
    }
    req.user = user
    next()
  })(req, res, next)
}