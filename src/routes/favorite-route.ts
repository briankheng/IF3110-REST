import { Router } from "express";

import { AuthenticationMiddleware } from "../middlewares";
import { FavoriteController } from "../controllers";

export class FavoriteRoute {
  authenticationMiddleware: AuthenticationMiddleware;
  favoriteController: FavoriteController;

  constructor() {
    this.authenticationMiddleware = new AuthenticationMiddleware();
    this.favoriteController = new FavoriteController();
  }

  getRoutes() {
    return Router()
      .get(
        "/favorite",
        // this.authenticationMiddleware.authenticate(),
        this.favoriteController.index()
      )
      .post(
        "/favorite",
        this.authenticationMiddleware.authenticate(),
        this.favoriteController.store()
      )
      .delete(
        "/favorite",
        this.authenticationMiddleware.authenticate(),
        this.favoriteController.destroy()
      );
  }
}
