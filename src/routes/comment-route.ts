import { Router } from "express";

import { CommentController } from "./../controllers/comment-controller";

export class CommentRoute {
  commentController: CommentController;

  constructor() {
    this.commentController = new CommentController();
  }

  getRoutes() {
    return Router()
      .get("/comment", this.commentController.index())
      .get("/comment/:id", this.commentController.show())
      .post("/comment", this.commentController.store())
      .put("/comment/:id", this.commentController.update())
      .delete("/comment/:id", this.commentController.destroy());
  }
}
