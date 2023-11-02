import { Router } from "express";

import { AlbumController } from "../controllers/album-controller";

export class AlbumRoute {
  albumController: AlbumController;

  constructor() {
    this.albumController = new AlbumController();
  }

  getRoutes() {
    return Router()
      .get("/album", this.albumController.index())
      .get("/album/:id", this.albumController.show())
      .post("/album", this.albumController.store())
      .put("/album/:id", this.albumController.update())
      .delete("/album/:id", this.albumController.destroy());
  }
}
