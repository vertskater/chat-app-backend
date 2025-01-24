import fs from 'node:fs';
import path from 'node:path';
import prisma from './prismaClient.js'
import { Strategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt'
const JwtStrategy = Strategy;

const pathToKey = path.join(import.meta.dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithm: ['RS256']
};

const strategy = new JwtStrategy(options, async (payload, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: payload.sub
      }
    })
    if(user) {
      return done(null, user);
    }else {
      return done(null, false);
    }
  }catch(err) {
    done(err, false);
  }
});

export default (passport) => {
  passport.use(strategy);
}