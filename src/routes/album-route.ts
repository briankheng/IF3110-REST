import { Router } from "express";

import { AuthenticationMiddleware } from "../middlewares";
import { AlbumController } from "../controllers";

export class AlbumRoute {
  authenticationMiddleware: AuthenticationMiddleware;
  albumController: AlbumController;

  constructor() {
    this.authenticationMiddleware = new AuthenticationMiddleware();
    this.albumController = new AlbumController();
  }

  getRoutes() {
    return Router()
      .get(
        "/album/search",
        this.authenticationMiddleware.authenticate(),
        this.albumController.search()
      )
      .get(
        "/album/:id",
        this.authenticationMiddleware.authenticate(),
        this.albumController.show()
      )
      .get(
        "/album",
        this.authenticationMiddleware.authenticate(),
        this.albumController.index()
      )
      .post(
        "/album",
        this.authenticationMiddleware.authenticate(),
        this.albumController.store()
      )
      .put(
        "/album/:id",
        this.authenticationMiddleware.authenticate(),
        this.albumController.update()
      )
      .delete(
        "/album/:id",
        this.authenticationMiddleware.authenticate(),
        this.albumController.destroy()
      );
  }
}
