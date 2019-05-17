import passport from 'koa-passport';
import { Strategy as GitHubStrategy } from 'passport-github2';

export default () => {
  passport.use(new GitHubStrategy({
    clientID: process.env.GH_CLIENT_ID,
    clientSecret: process.env.GH_CLIENT_SECRET,
  }, (accessToken, refreshToken, profile, done) => {
    done(null, profile);
  }));
};
