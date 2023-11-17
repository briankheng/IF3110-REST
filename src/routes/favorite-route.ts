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
        "/favorite/verify",
        this.authenticationMiddleware.authenticate(),
        this.favoriteController.verify()
      )
      .get(
        "/favorite",
        this.authenticationMiddleware.authenticate(),
        (req, res) => this.favoriteController.index(req, res)
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
      )
      .delete(
        "/favorite/:id",
        this.authenticationMiddleware.authenticate(),
        this.favoriteController.deleteFavoritesByAlbumId()
      );
  }
}
