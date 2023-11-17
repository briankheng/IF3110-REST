import { Router } from "express";

import { AuthenticationMiddleware } from "../middlewares";
import { CategoryController } from "../controllers";

export class CategoryRoute {
  authenticationMiddleware: AuthenticationMiddleware;
  categoryController: CategoryController;

  constructor() {
    this.authenticationMiddleware = new AuthenticationMiddleware();
    this.categoryController = new CategoryController();
  }

  getRoutes() {
    return Router()
      .get(
        "/category",
        this.authenticationMiddleware.authenticate(),
        this.categoryController.index()
      )
      .get(
        "/category/search",
        this.authenticationMiddleware.authenticate(),
        this.categoryController.getAlbums()
      )
      .get(
        "/category/:id",
        this.authenticationMiddleware.authenticate(),
        this.categoryController.show()
      );
  }
}
