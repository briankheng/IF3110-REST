import { Router } from "express";

import { AuthenticationMiddleware } from "../middlewares/authentication-middleware";
import { UserController } from "../controllers/user-controller";

export class UserRoute {
    authenticationMiddleware: AuthenticationMiddleware;
    userController: UserController;

    constructor() {
        this.authenticationMiddleware = new AuthenticationMiddleware();
        this.userController = new UserController();
    }

    getRoutes() {
        return Router()
            .post("/user/token", 
                this.userController.token())
            .post("/user", 
                this.userController.store())
            .get("/user", 
                this.userController.index())
            .get("/user/check", 
                this.authenticationMiddleware.authenticate(),
                this.userController.check())
            .get("/user/admin",
                this.userController.admin())
            .get("/user/emails",
                this.userController.getEmailsByIds())
    }
}