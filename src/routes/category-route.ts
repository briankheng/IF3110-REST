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
        "/category/:id",
        this.authenticationMiddleware.authenticate(),
        this.categoryController.show()
      )
      .post(
        "/category",
        this.authenticationMiddleware.authenticate(),
        this.categoryController.store()
      )
      .put(
        "/category/:id",
        this.authenticationMiddleware.authenticate(),
        this.categoryController.update()
      )
      .delete(
        "/category/:id",
        this.authenticationMiddleware.authenticate(),
        this.categoryController.destroy()
      );
  }
}
