import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Request, Response } from "express";

import { IFavoriteRequest } from "../interfaces";
import { SoapCaller } from "../utils";

export class FavoriteController {
  index() {
    return async (req: Request, res: Response) => {
      try {
        const { userId }: IFavoriteRequest = req.body;

        const args = {
          arg0: userId,
          arg1: req.ip,
        };

        // Call SOAP Service
        const soapCaller = new SoapCaller(
          process.env.USE_DOCKER_CONFIG
            ? process.env.SOAP_URL_DOCKER + "/favorite" || ""
            : process.env.SOAP_URL + "/favorite" || ""
        );
        const response = await soapCaller.call("getFavorites", args);

        res.status(StatusCodes.OK).json(response);
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }
    };
  }

  store() {
    return async (req: Request, res: Response) => {
      try {
        const { userId, albumId }: IFavoriteRequest = req.body;

        const args = {
          arg0: userId,
          arg1: albumId,
          arg2: req.ip,
        };

        // Call SOAP Service
        const soapCaller = new SoapCaller(
          process.env.USE_DOCKER_CONFIG
            ? process.env.SOAP_URL_DOCKER + "/favorite" || ""
            : process.env.SOAP_URL + "/favorite" || ""
        );
        const response = await soapCaller.call("addFavorite", args);

        res.status(StatusCodes.OK).json(response);
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }
    };
  }

  destroy() {
    return async (req: Request, res: Response) => {
      try {
        const { userId, albumId }: IFavoriteRequest = req.body;

        const args = {
          arg0: userId,
          arg1: albumId,
          arg2: req.ip,
        };

        // Call SOAP Service
        const soapCaller = new SoapCaller(
          process.env.USE_DOCKER_CONFIG
            ? process.env.SOAP_URL_DOCKER + "/favorite" || ""
            : process.env.SOAP_URL + "/favorite" || ""
        );
        const response = await soapCaller.call("removeFavorite", args);

        res.status(StatusCodes.OK).json(response);
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }
    };
  }
}
