import { Router } from "express";

import { AdminMiddleware, AuthenticationMiddleware } from "../middlewares";
import { AlbumController } from "../controllers";

export class AlbumRoute {
  authenticationMiddleware: AuthenticationMiddleware;
  adminMiddleware: AdminMiddleware;
  albumController: AlbumController;

  constructor() {
    this.authenticationMiddleware = new AuthenticationMiddleware();
    this.adminMiddleware = new AdminMiddleware();
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
        this.adminMiddleware.authenticate(),
        this.albumController.store()
      )
      .put(
        "/album/:id",
        this.authenticationMiddleware.authenticate(),
        this.adminMiddleware.authenticate(),
        this.albumController.update()
      )
      .delete(
        "/album/:id",
        this.authenticationMiddleware.authenticate(),
        this.adminMiddleware.authenticate(),
        this.albumController.destroy()
      );
  }
}
