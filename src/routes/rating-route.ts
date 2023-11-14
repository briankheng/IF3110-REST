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
        this.ratingController.store()
      )
      .put(
        "/rating/:id",
        this.authenticationMiddleware.authenticate(),
        this.ratingController.update()
      )
      .delete(
        "/rating/:id",
        this.authenticationMiddleware.authenticate(),
        this.ratingController.destroy()
      );
  }
}
