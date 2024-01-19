import dotenv from "dotenv";
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const required = (key, defaultValue = undefined) => {
  const value = process.env[key] || defaultValue;
  if (value == null) {
    throw new Error(`Key ${key} is undefined`);
  }
  return value;
};

export const config = {
  server: {
    url: required("SERVER_URL", "http://localhost:8080"),
  },
  port: parseInt(required("PORT", 8080)),
  cors: {
    allowedOrigin: required("CORS_ALLOW_ORIGIN"),
  },
  session: {
    secret: required("SESSION_SECRET"),
  },
  db: {
    constDB: required("CONST_DB_URL"),
    userDB: required("USER_DB_URL"),
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
  aws: {
    accessKeyId: required("AWS_ACCESS_KEY_ID"),
    secretAccessKey: required("AWS_SECRET_ACCESS_KEY"),
    bucketName: required("AWS_BUCKET_NAME"),
    region: required("AWS_REGION"),
  },
};

export const corsOption = {
  origin: config.cors.allowedOrigin,
  optionsSuccessStatus: 200,
  credentials: true,
};

const sessionOptions = {
  secret: config.session.secret,
  resave: false,
  saveUninitialized: false,
};

export const getSessions = () => {
  if (process.env.NODE_ENV === "dev") return sessionOptions;

  return {
    ...sessionOptions,
    cookie: { secure: true },
  };
};
