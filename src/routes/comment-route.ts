import { Router } from "express";

import { AuthenticationMiddleware } from "../middlewares";
import { CommentController } from "../controllers";

export class CommentRoute {
  authenticationMiddleware: AuthenticationMiddleware;
  commentController: CommentController;

  constructor() {
    this.authenticationMiddleware = new AuthenticationMiddleware();
    this.commentController = new CommentController();
  }

  getRoutes() {
    return Router()
      .get(
        "/comment",
        this.authenticationMiddleware.authenticate(),
        this.commentController.index()
      )
      .get(
        "/comment/:id",
        this.authenticationMiddleware.authenticate(),
        this.commentController.show()
      )
      .post(
        "/comment",
        this.authenticationMiddleware.authenticate(),
        this.commentController.store()
      )
      .put(
        "/comment/:id",
        this.authenticationMiddleware.authenticate(),
        this.commentController.update()
      )
      .delete(
        "/comment/:id",
        this.authenticationMiddleware.authenticate(),
        this.commentController.destroy()
      );
  }
}
