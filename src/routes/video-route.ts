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
        "/video/:id",
        this.authenticationMiddleware.authenticate(),
        this.videoController.show()
      )
      .post(
        "/video",
        this.authenticationMiddleware.authenticate(),
        this.videoController.store()
      )
      .post(
        "/video/notify",
        this.authenticationMiddleware.authenticate(),
        this.videoController.dummynotify()
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
      );
  }
}
