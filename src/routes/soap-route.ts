import { Router } from "express";

import { AuthenticationMiddleware } from "../middlewares";
import { SoapController } from "../controllers";

export class SoapRoute {
    authenticationMiddleware: AuthenticationMiddleware;
    soapController: SoapController;

    constructor() {
        this.authenticationMiddleware = new AuthenticationMiddleware();
        this.soapController = new SoapController(process.env.SOAP_URL ? process.env.SOAP_URL : "");
    }

    getRoutes() {
        return Router()
            .post("/subscribe/accept",
                this.authenticationMiddleware.authenticate(),
                this.soapController.accept())
            .post("/subscribe/reject", 
                this.authenticationMiddleware.authenticate(),
                this.soapController.reject())
            .post("/subscribe/request", 
                this.soapController.request())
            .get("/subscribe",
                this.authenticationMiddleware.authenticate(),
                this.soapController.index())
    }
}
