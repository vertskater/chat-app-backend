import * as crypto from 'node:crypto'
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import jsonwebtoken from 'jsonwebtoken';



export const loadFile = (file) => {
  // Correctly resolve __dirname for ES Modules
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
// Resolve the path to the public key
  const pathToKey = path.resolve(__dirname, '..', file);
// Read the public key
  try {
    return fs.readFileSync(pathToKey, 'utf8');
  } catch (err) {
    console.error(`Failed to read public key at ${pathToKey}:`, err.message);
    throw new Error('Public key file not found or unreadable.');
  }
}
let PRIV_KEY = loadFile('id_rsa_priv.pem');

export const genPassword = (password) => {
  const salt = crypto.randomBytes(32).toString("hex");
  const genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "SHA512")
    .toString("hex");
  return {
    salt: salt,
    hash: genHash,
  };
};

export const verifyPassword = (password, hash, salt) => {
  const hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return hash === hashVerify;
}
export const validPassword = (password, hash, salt) => {
  const hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return hash === hashVerify;
}
function hashApiKey(key) {
  return crypto.createHash("sha256").update(key).digest("hex");
}

export const issueJwt = (user) => {
  const _id = user.id;
  const expiresIn = "1d";
  const payload = {
    sub: _id,
    iat: Date.now()
  };

  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {
    expiresIn: expiresIn,
    algorithm: "RS256",
  });

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn,
  };
};