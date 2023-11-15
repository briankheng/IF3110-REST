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
            const response = await this.soapCaller.call('unsubscribe', args);
            res.status(StatusCodes.CREATED).json(response);
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: ReasonPhrases.INTERNAL_SERVER_ERROR,
            });
            return;
        }
    };
  }

  accept() {
    return async (req: Request, res: Response) => {
      const { token } = req as IAuthRequest;
      if (!token || !token.isAdmin) {
        // Admin only
        res.status(StatusCodes.UNAUTHORIZED).json({
          message: ReasonPhrases.UNAUTHORIZED,
        });
        return;
      }

      // Parse request body
      const { userId, albumId } = req.body;

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
        const response = await this.soapCaller.call("acceptSubscription", args);
        res.status(StatusCodes.OK).json(response);
      } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: ReasonPhrases.INTERNAL_SERVER_ERROR,
        });
        return;
      }
    };
  }

  reject() {
    return async (req: Request, res: Response) => {
      const { token } = req as IAuthRequest;
      if (!token || !token.isAdmin) {
        // Admin only
        res.status(StatusCodes.UNAUTHORIZED).json({
          message: ReasonPhrases.UNAUTHORIZED,
        });
        return;
      }

      // Parse request body
      const { userId, albumId } = req.body;

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
        const response = await this.soapCaller.call("rejectSubscription", args);
        res.status(StatusCodes.OK).json(response);
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
        res.status(StatusCodes.OK).json(response);
      } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: ReasonPhrases.INTERNAL_SERVER_ERROR,
        });
        return;
      }
    };
  }
}
