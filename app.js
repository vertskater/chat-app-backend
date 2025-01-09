import express from 'express';
import passport from 'passport'
import passportConfig from './utils/passportConfig.js'
import authRoutes from './routes/authRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
const app = express();

// Middleware
app.use(express.json());
passportConfig(passport);
app.use(passport.initialize());

app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);

export default app;