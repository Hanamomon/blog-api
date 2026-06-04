import "dotenv/config";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { findUserByUsername } from "../repository/userRepository.js";
import bcrypt from "bcryptjs";

const local = new LocalStrategy({ session: false }, async (username, password, done) => {
  try {
    const user = await findUserByUsername(username);
    
    if (!user)
      return done(null, false);

    const isValid = await bcrypt.compare(password, user.hash);
    if (!isValid)
      return done(null, false);

    return done(null, { id: user.id, username: user.username, role: user.role });
  } catch(err) {
    done(err);
  }
});

const jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
const secret = process.env.JWT_SECRET;

const token = new JwtStrategy({ secretOrKey: secret , jwtFromRequest }, async (jwt_payload, done) => {
  try {
    const { id, username, role } = await findUserByUsername(jwt_payload.username);
    const user = { id, username, role };

    if (!user)
      return done(null, false);

    return done(null, user);
  } catch(err) {
    done(err);
  }
})

passport.use('local' ,local);

passport.use('jwt' ,token);

export { passport };