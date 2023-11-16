import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Request, Response } from "express";

import { IAuthRequest } from "../interfaces";
import { SoapCaller } from "../utils";

export class SubscriptionController {
  private soapCaller: SoapCaller;

  constructor(url: string) {
      this.soapCaller = new SoapCaller(url)
  }

  request() {
    return async (req: Request, res: Response) => {
        // Parse request body
        const { userId, albumId } = req.query;

        if (!userId || !albumId) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: ReasonPhrases.BAD_REQUEST });
        }

        const args = {
            arg0: userId,
            arg1: albumId,
            arg2: req.ip
        }

        try {
            const response = await this.soapCaller.call('subscribe', args);
            res.status(StatusCodes.CREATED).json(response);
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: ReasonPhrases.INTERNAL_SERVER_ERROR,
            });
            return;
        }
    };
  }

  unsubscribe() {
    return async (req: Request, res: Response) => {
        // Parse request body
        const { userId, albumId } = req.query;

        if (!userId || !albumId) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: ReasonPhrases.BAD_REQUEST });
        }

        const args = {
            arg0: userId,
            arg1: albumId,
            arg2: req.ip
        }

        try {
            await this.soapCaller.call("unsubscribe", args);
            return res.status(StatusCodes.OK).json({ message: "OK" });
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: ReasonPhrases.INTERNAL_SERVER_ERROR,
            });
            return;
        }
    };
  }

  verify() {
    return async (req: Request, res: Response) => {
      const { userId, albumId } = req.query;

      if (!userId || !albumId) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: ReasonPhrases.BAD_REQUEST });
      }

      const args = {
        arg0: userId,
        arg1: albumId,
        arg2: req.ip
      };

      try {
        const response = await this.soapCaller.call("verifySubscription", args);
        console.log(response);
        res.status(StatusCodes.OK).json(response);
      } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: ReasonPhrases.INTERNAL_SERVER_ERROR,
        });
        return;
      }
    };
  }

  deleteSubscriptionByAlbumId() {
    return async (req: Request, res: Response) => {

      const args = {
        arg0: Number(req.params.id),
        arg1: req.ip
      };

      try {
        await this.soapCaller.call("removeSubscriptionByAlbumId", args);
        return res.status(StatusCodes.OK).json({ message: "OK" });
      } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: ReasonPhrases.INTERNAL_SERVER_ERROR,
        });
        return;
      }
    };
  }
}
