const generatePort = () => {
    return process.env.PORT ? +process.env.PORT : 8080;
};

export const serverConfig: { port: number } = {
    port: generatePort(),
};