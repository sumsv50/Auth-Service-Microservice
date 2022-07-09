import  passport from 'passport';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import { ExtractJwt } from 'passport-jwt';
import { AccountHasBeenBlockedError } from '@shared/errors';
import AuthConfig from '@configs/authentication';
import { UserDTO } from '@dto/user.dto';
import { userRepo } from '@repos/user.repo';

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: AuthConfig.JWT_SECRET
};

passport.use(new JwtStrategy(opts, async function (jwt_payload, done) {
  try {
    const user = await userRepo.findOne({ _id: jwt_payload.sub });
    
    if (user) {
      if (user.isBlocked) {
        return done(new AccountHasBeenBlockedError(), false);
      }
      return done(null, <UserDTO>{ id: user._id });
    }
    done(null, false);
  } catch (err) {
    done(err, false);
  }
}));

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
  },
  async function (email, password, done) {
    try {
      const user = await userRepo.checkCredential(email, password);
      
      if (user) {
        if (user.isBlocked) {
          return done(new AccountHasBeenBlockedError(), false);
        }
        return done(null, {
          id: user._id,
          email: user.email,
          picture: user.picture,
          name: user.name
        });
      }
      return done(null, false);

    } catch (err) {
      console.log(err);
      return done(err, false);
    }
  }
));

function jwtAuth() {
  return passport.authenticate('jwt', { session: false });
}

export  { passport, jwtAuth };