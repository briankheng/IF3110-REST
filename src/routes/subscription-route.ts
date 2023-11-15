import { Router } from "express";

import { AuthenticationMiddleware } from "../middlewares";
import { SubscriptionController } from "../controllers";

export class SubscriptionRoute {
    authenticationMiddleware: AuthenticationMiddleware;
    soapController: SubscriptionController;

    constructor() {
        this.authenticationMiddleware = new AuthenticationMiddleware();
        this.soapController = new SubscriptionController(process.env.USE_DOCKER_CONFIG ? process.env.SOAP_URL_DOCKER + "/subscription" || '' : process.env.SOAP_URL + "/subscription" || '');
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
                this.authenticationMiddleware.authenticate(),
                this.soapController.request())
            .post("/subscribe/unsubscribe",
                this.authenticationMiddleware.authenticate(),
                this.soapController.unsubscribe())
            .get("/subscribe",
                this.authenticationMiddleware.authenticate(),
                this.soapController.verify())
    }
}
