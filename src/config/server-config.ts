const generatePort = () => {
    return process.env.PORT ? +process.env.PORT : 8080;
};

const generateDB_URL = () => {
    return process.env.DATABASE_URL ? process.env.DATABASE_URL : "postgres://postgres:michaeleon16606@localhost:9906/tubes_wbd_rest?schema=public";
}

export const serverConfig: { port: number, db_url: String } = {
    port: generatePort(),
    db_url: generateDB_URL()
};