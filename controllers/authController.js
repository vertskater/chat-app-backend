import {body, validationResult} from 'express-validator';
import {getUserByEmail, saveUser} from '../db/user.js'
import {validPassword, issueJwt, genPassword} from '../utils/utils.js'

const alphaError = "must have Alphabetical characters.";
const lengthError = "must have at least 5 and max 30 characters";

const validationSchema = [
  body("forename")
    .isAlpha()
    .withMessage(`forename ${alphaError}`)
    .isLength({ min: 5, max: 30 })
    .withMessage(`forename ${lengthError}`)
    .trim(),
  body("surname")
    .isAlpha()
    .withMessage(`surname ${alphaError}`)
    .isLength({ min: 5, max: 30 })
    .withMessage(`surname ${lengthError}`)
    .trim(),
  body('email')
    .isEmail()
    .withMessage('must be a valid E-Mail-Address')
    .trim(),
  body("username")
    .isAlpha()
    .withMessage(`Username ${alphaError}`)
    .isLength({ min: 5, max: 30 })
    .withMessage(`Username ${lengthError}`)
    .trim(),
  body("password")
    .trim()
    .isLength({ min: 4 })
    .withMessage("password must have at least 12 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
    .withMessage(
      "Password must be at least 12 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character"
    ),
  body("pass-confirm")
    .trim()
    .custom((value, { req }) => value === req.body.password)
    .withMessage("passwords do not match!"),
];

export const register = [
  validationSchema,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "user credentials not matching requirements",
        errorInfo: errors,
      });
    }
    const saltHash = genPassword(req.body.password);
    const salt = saltHash.salt;
    const hash = saltHash.hash;
    try {
      const user = await saveUser({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        email: req.body.email,
        password: `${hash}.${salt}`,
      });
      if (user) {
        const jwt = issueJwt(user);
        return res
          .status(200)
          .json({ success: true, jwt: jwt.token, expiresIn: jwt.expires });
      }
      res.status(401).json({ success: false });
    } catch (err) {
      next(err);
    }
  },
]

export const login = async (req, res, next) => {
  const {email, password} = req.body;
  try {
    const user = await getUserByEmail(email);
    if(!user) return res.status(401).json({success: false, msg: "could not find user"});
    const hashSalt = user.password.split(".");
    const verifyPassword = validPassword(
      password,
      hashSalt[0],
      hashSalt[1]
    );
    if (verifyPassword) {
      const jwt = issueJwt(user);
      return res.status(200).json({
        success: true,
        msg: "jwt token issued, you are logged in",
        token: jwt.token,
        email: user.email,
        expiresIn: jwt.expires,
      });
    }
    res.status(401).json({ success: false, msg: "wrong password" });
  } catch (err) {
    next(err)
  }
}
