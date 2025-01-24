import * as fs from 'fs';
import * as path from 'path';
import prisma from './prismaClient.js'
import { Strategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt'
const JwtStrategy = Strategy;


const __dirname = path.dirname(new URL(import.meta.url).pathname);
// Ensure the file path resolves correctly even in different environments
const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');

// Read the public key
let PUB_KEY;
try {
  PUB_KEY = fs.readFileSync(pathToKey, 'utf8');
} catch (err) {
  console.error(`Failed to read public key at ${pathToKey}:`, err.message);
  throw new Error('Public key file not found or unreadable.');
}

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