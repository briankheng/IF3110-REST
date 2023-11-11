require("dotenv").config();

import express, { Express } from "express";
import cors from "cors";
import morgan from "morgan";
import "reflect-metadata";

import { serverConfig } from "./config/server-config";
import {
  AlbumRoute,
  VideoRoute,
  CategoryRoute,
  CommentRoute,
  RatingRoute,
  SoapRoute,
  UserRoute
} from "./routes";

export class App {
  server: Express;

  constructor() {
    const userRoute = new UserRoute();
    const albumRoute = new AlbumRoute();
    const videoRoute = new VideoRoute();
    const categoryRoute = new CategoryRoute();
    const commentRoute = new CommentRoute();
    const ratingRoute = new RatingRoute();
    const soapRoute = new SoapRoute();

    this.server = express();
    // this.server.use((cors as (options: cors.CorsOptions) => express.RequestHandler)({}));
    cors({
      origin: 'http://localhost:3003', // Replace with your allowed domain
      methods: ['GET', 'POST', 'OPTIONS'], // Specify allowed HTTP methods
      allowedHeaders: ['Content-Type', 'Authorization', 'api-key'], // Specify allowed headers
      credentials: true, // Allow credentials (cookies, HTTP authentication)
    })
    this.server.use(
      "/api",
      express.json(),
      express.urlencoded({ extended: true }),
      morgan("combined"),
      userRoute.getRoutes(),
      albumRoute.getRoutes(),
      videoRoute.getRoutes(),
      categoryRoute.getRoutes(),
      commentRoute.getRoutes(),
      ratingRoute.getRoutes(),
      soapRoute.getRoutes()
    );
  }

  run() {
    this.server.listen(serverConfig.port, () => {
      console.log(`⚡️[server]: Server started at http://localhost:${serverConfig.port}`);
      console.log(`⚡️[server]: using database url ${process.env.USE_DOCKER_CONFIG ? process.env.DATABASE_URL_DOCKER : process.env.DATABASE_URL}`);
    });
  }
}
