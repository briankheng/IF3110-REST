import { Router } from "express";

import { RatingController } from "../controllers/rating-controller";

export class RatingRoute {
  ratingController: RatingController;

  constructor() {
    this.ratingController = new RatingController();
  }

  getRoutes() {
    return Router()
      .get("/rating", this.ratingController.index())
      .get("/rating/:id", this.ratingController.show())
      .post("/rating", this.ratingController.store())
      .put("/rating/:id", this.ratingController.update())
      .delete("/rating/:id", this.ratingController.destroy());
  }
}
