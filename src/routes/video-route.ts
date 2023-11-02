import { Router } from "express";

import { VideoController } from "../controllers/video-controller";

export class VideoRoute {
  videoController: VideoController;

  constructor() {
    this.videoController = new VideoController();
  }

  getRoutes() {
    return Router()
      .get("/video", this.videoController.index())
      .get("/video/:id", this.videoController.show())
      .post("/video", this.videoController.store())
      .put("/video/:id", this.videoController.update())
      .delete("/video/:id", this.videoController.destroy());
  }
}
