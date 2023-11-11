const generateHost = () => {
  return process.env.USE_DOCKER_CONFIG ? process.env.SOAP_HOST : process.env.SOAP_HOST_DOCKER;
};

const generatePort = () => {
  return process.env.SOAP_PORT ? parseInt(process.env.SOAP_PORT) : 3003;
};

const generateKey = () => {
  return process.env.SOAP_API_KEY
    ? process.env.SOAP_API_KEY
    : "1a5b0c4d8e1f8f6a9b0e0b0a6c9f4e4d3c9i8b3a7f6f0d5g4h9i6j8b3c9o0p8b";
};

export const soapConfig: { host: string | undefined; port: number; key: string } = {
  host: generateHost(),
  port: generatePort(),
  key: generateKey(),
};
