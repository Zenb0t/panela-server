import dotenv from "dotenv";
dotenv.config();

interface ENV {
  PORT: string | undefined;
  AUTH0_CLIENT_ID: string | undefined;
  AUTH0_DOMAIN: string | undefined;
  AUTH0_CLIENT_SECRET: string | undefined;
  URI_MONGODB: string | undefined;
  SESSION_SECRET: string | undefined;
  AUTH0_CALLBACK_URL: string | undefined;
  MONGO_PSWD: string | undefined;
  AUDIENCE: string | undefined;
}

interface Config {
  PORT: string;
  AUTH0_CLIENT_ID: string;
  AUTH0_DOMAIN: string;
  AUTH0_CLIENT_SECRET: string;
  URI_MONGODB: string;
  SESSION_SECRET: string;
  AUTH0_CALLBACK_URL: string;
  MONGO_PSWD: string;
  AUDIENCE: string;
}

const getConfig = (): ENV => {
  return {
    PORT: process.env.PORT,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
    URI_MONGODB: process.env.URI_MONGODB,
    SESSION_SECRET: process.env.SESSION_SECRET,
    AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL,
    MONGO_PSWD: process.env.MONGO_PSWD,
    AUDIENCE: process.env.AUDIENCE,
  };
};

const getSanitzedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(
        `Missing key ${key} in config.env, please verify your config.env file or .env file`,
      );
    }
  }
  return config as Config;
};

const config = getConfig();

const sanitizedConfig = getSanitzedConfig(config);

export default sanitizedConfig;
