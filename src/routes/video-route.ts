import { Router } from "express";

import { AuthenticationMiddleware } from "../middlewares";
import { VideoController } from "../controllers";

export class VideoRoute {
  authenticationMiddleware: AuthenticationMiddleware;
  videoController: VideoController;

  constructor() {
    this.authenticationMiddleware = new AuthenticationMiddleware();
    this.videoController = new VideoController();
  }

  getRoutes() {
    return Router()
      .get(
        "/video",
        this.authenticationMiddleware.authenticate(),
        this.videoController.index()
      )
      .get(
        "/video/:id",
        this.authenticationMiddleware.authenticate(),
        this.videoController.show()
      )
      .get(
        "/video/search",
        this.authenticationMiddleware.authenticate(),
        this.videoController.search()
      )
      .post(
        "/video",
        this.authenticationMiddleware.authenticate(),
        this.videoController.store()
      )
      .put(
        "/video/:id",
        this.authenticationMiddleware.authenticate(),
        this.videoController.update()
      )
      .delete(
        "/video/:id",
        this.authenticationMiddleware.authenticate(),
        this.videoController.destroy()
      )
      .post(
        "/video/notify",
        this.videoController.dummynotify()
      );
  }
}
