import { Router } from "express";

import { AuthenticationMiddleware } from "../middlewares";
import { TokenController } from "../controllers";

export class TokenRoute {
  authenticationMiddleware: AuthenticationMiddleware;
  tokenController: TokenController;

  constructor() {
    this.authenticationMiddleware = new AuthenticationMiddleware();
    this.tokenController = new TokenController();
  }

  getRoutes() {
    return Router()
      .post(
        "/token/check",
        this.authenticationMiddleware.authenticate(),
        this.tokenController.checkToken()
      )

      .post(
        "/token/addCoins",
        this.authenticationMiddleware.authenticate(),
        this.tokenController.addCoins()
      );
  }
}
