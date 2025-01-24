import prisma from './prismaClient.js'
import { Strategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt'
import {loadFile} from './utils.js'

const JwtStrategy = Strategy;

// Correctly resolve __dirname for ES Modules
let PUB_KEY = loadFile('id_rsa_pub.pem')

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