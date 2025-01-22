import * as crypto from 'node:crypto'
import * as fs from'node:fs';
import * as path from 'node:path';
import jsonwebtoken from 'jsonwebtoken';

const pathToKey = path.join(import.meta.dirname, "..", "id_rsa_priv.pem");
const PRIV_KEY = fs.readFileSync(pathToKey, "utf8");

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