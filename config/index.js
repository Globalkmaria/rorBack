import dotenv from "dotenv";
dotenv.config();

const required = (key, defaultValue = undefined) => {
  const value = process.env[key] || defaultValue;
  if (value == null) {
    throw new Error(`Key ${key} is undefined`);
  }
  return value;
};

export const config = {
  port: parseInt(required("PORT", 8080)),
  cors: {
    allowedOrigin: required("CORS_ALLOW_ORIGIN"),
  },
  session: {
    secret: required("SESSION_SECRET"),
  },
  db: {
    url: required("DB_URL"),
    name: required("DB_NAME"),
  },
  google: {
    clientId: required("GOOGLE_CLIENT_ID"),
    clientSecret: required("GOOGLE_CLIENT_SECRET"),
    callbackURL: required("GOOGLE_CALLBACK_URL"),
    userProfileURL: required("GOOGLE_USER_PROFILE_URL"),
  },
  frontend: {
    url: required("FRONTEND_URL"),
  },
};

export const corsOption = {
  origin: config.cors.allowedOrigin,
  optionsSuccessStatus: 200,
  credentials: true,
};

export const sessionOptions = {
  secret: config.session.secret,
  resave: false,
  saveUninitialized: false,
};
