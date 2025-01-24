import express from 'express';
import passport from 'passport'
import passportConfig from './utils/passportConfig.js'
import authRoutes from './routes/authRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import cors from 'cors';
const app = express();
app.use(express.json());
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
app.use(cors());

/*{
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }*/

// Middleware
passportConfig(passport);
app.use(passport.initialize());

app.use('/auth',  authRoutes);
app.use('/chat', chatRoutes);


export default app;