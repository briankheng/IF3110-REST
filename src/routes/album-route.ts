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
        "/album",
        this.authenticationMiddleware.authenticate(),
        this.albumController.index()
      )
      .get(
        "/album/search",
        this.authenticationMiddleware.authenticate(),
        this.albumController.search()
      )
      .get(
        "/album/recommend",
        this.authenticationMiddleware.authenticate(),
        this.albumController.recommend()
      )
      .get(
        "/album/:id",
        this.authenticationMiddleware.authenticate(),
        this.albumController.show()
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
