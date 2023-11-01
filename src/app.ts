import express, { Express } from "express";
import cors from 'cors';
import morgan from "morgan";
import "reflect-metadata";

import { serverConfig } from "./config/server-config";
import { UserRoute } from "./routes/user-route";
import { SoapRoute } from "./routes/soap-route";

export class App {
    server: Express;

    constructor() {
        const userRoute = new UserRoute();
        const soapRoute = new SoapRoute();

        this.server = express();
        this.server.use((cors as (options: cors.CorsOptions) => express.RequestHandler)({}));
        this.server.use(
            "/api",
            express.json(),
            express.urlencoded({ extended: true }),
            morgan("combined"),
            userRoute.getRoute(),
            soapRoute.getRoute()
        );
    }

    run() {
        this.server.listen(serverConfig.port, () => {
            console.log(`⚡️[server]: Server started at http://localhost:${serverConfig.port}`);
            console.log(`⚡️[server]: using database url ${process.env.DATABASE_URL}`);
        });
    }
}