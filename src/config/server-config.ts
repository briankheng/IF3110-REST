const generatePort = () => {
  return process.env.PORT ? parseInt(process.env.PORT) : 8080;
};

const generateDB = () => {
  return process.env.DATABASE_URL ? process.env.DATABASE_URL : "";
};

export const serverConfig: { port: number; db: String } = {
  port: generatePort(),
  db: generateDB(),
};
