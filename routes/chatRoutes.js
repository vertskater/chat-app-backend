import express from 'express';
import passport from 'passport';
import {getMessages, saveMessages} from '../controllers/messagesController.js';
const router = express.Router();

router.get('/messages', passport.authenticate('jwt', { session: false }), getMessages)
router.post('/messages', passport.authenticate('jwt', { session: false }), saveMessages)

export default router;