import { Router } from "express";

import { AuthenticationMiddleware, SoapMiddleware } from "../middlewares";
import { SoapController } from "../controllers";

export class SoapRoute {
  authenticationMiddleware: AuthenticationMiddleware;
  soapController: SoapController;
  soapMiddleware: SoapMiddleware;

  constructor() {
    this.authenticationMiddleware = new AuthenticationMiddleware();
    this.soapController = new SoapController(
      process.env.SOAP_URL ? process.env.SOAP_URL : ""
    );
    this.soapMiddleware = new SoapMiddleware();
  }

  getRoutes() {
    return Router()
      .post(
        "/subscribe/accept",
        this.authenticationMiddleware.authenticate(),
        this.soapController.accept()
      )
      .post(
        "/subscribe/reject",
        this.authenticationMiddleware.authenticate(),
        this.soapController.reject()
      )
      .get(
        "/subscribe",
        this.authenticationMiddleware.authenticate(),
        this.soapController.index()
      );
  }
}
