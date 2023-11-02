import { Router } from "express";

import { CategoryController } from "../controllers/category-controller";

export class CategoryRoute {
  categoryController: CategoryController;

  constructor() {
    this.categoryController = new CategoryController();
  }

  getRoutes() {
    return Router()
      .get("/category", this.categoryController.index())
      .get("/category/:id", this.categoryController.show())
      .post("/category", this.categoryController.store())
      .put("/category/:id", this.categoryController.update())
      .delete("/category/:id", this.categoryController.destroy());
  }
}
