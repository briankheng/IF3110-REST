const generatePort = () => {
  return process.env.PORT ? parseInt(process.env.PORT) : 8080;
};

const generateDB = () => {
  return process.env.USE_DOCKER_CONFIG ? process.env.DATABASE_URL_DOCKER : process.env.DATABASE_URL;
};

export const serverConfig: { port: number; db: String | undefined } = {
  port: generatePort(),
  db: generateDB(),
};
