import { Router } from "express";

import { AuthenticationMiddleware } from "../middlewares";
import { RatingController } from "../controllers";

export class RatingRoute {
  authenticationMiddleware: AuthenticationMiddleware;
  ratingController: RatingController;

  constructor() {
    this.authenticationMiddleware = new AuthenticationMiddleware();
    this.ratingController = new RatingController();
  }

  getRoutes() {
    return Router()
      .get(
        "/rating",
        this.authenticationMiddleware.authenticate(),
        this.ratingController.index()
      )
      .post(
        "/rating",
        this.authenticationMiddleware.authenticate(),
        this.ratingController.modify()
      )
      .delete(
        "/rating",
        this.authenticationMiddleware.authenticate(),
        this.ratingController.destroy()
      );
  }
}
