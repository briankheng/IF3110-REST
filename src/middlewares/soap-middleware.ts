import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";

import { IValidateRequest } from "../interfaces";
import { SoapService } from "../soap-handler/soap-services";

export class SoapMiddleware {
  soapServices: SoapService;

  constructor() {
    this.soapServices = new SoapService();
  }

  validate() {
    return async (req: Request, res: Response, next: NextFunction) => {
      const { userID, albumID }: IValidateRequest = req.body;
      if (!userID || !albumID) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: ReasonPhrases.BAD_REQUEST,
        });
        return;
      }

      const isValidated = await this.soapServices.validate(userID, albumID);

      if (!isValidated) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          message: ReasonPhrases.UNAUTHORIZED,
        });
        return;
      }

      next();
    };
  }
}
