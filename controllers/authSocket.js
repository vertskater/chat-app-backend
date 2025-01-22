import jwt from 'jsonwebtoken'
import * as path from 'node:path'
import * as fs from 'node:fs'


const pathToKey = path.join(import.meta.dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

const authenticateSocket = (socket, next) => {
  const token = socket.handshake.auth.token; // Extract the token
  const rawToken = token.split(' ')[1];
  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }
  try {
    jwt.verify(rawToken, PUB_KEY, { algorithms: ["RS256"] }, (err, decoded) => {
      if (err) {
        return next(new Error('Authentication error: Invalid token'));
      }
      // Attach user data to the socket
      socket.user = decoded.sub;
      next();
    }); // Attach the user for later use
  } catch (err) {
    return next(new Error("Authentication error: Invalid token"));
  }
}

export default authenticateSocket;