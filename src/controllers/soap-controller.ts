import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Request, Response } from "express";

import {
  IAuthRequest,
  ISubscriptionRequest,
  ISubscriptionData,
} from "../interfaces";
import { SoapCaller } from "../utils";

export class SoapController {
  private soapCaller: SoapCaller;

    constructor(url: string) {
        this.soapCaller = new SoapCaller(url)
    }

    request() {
        return async (req: Request, res: Response) => {
            // Parse request body
            const { userID, albumID }: ISubscriptionRequest = req.body;
            const args = {
                arg0: userID,
                arg1: albumID,
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
      const { userID, albumID }: ISubscriptionRequest = req.body;
      const args = {
        arg0: userID,
        arg1: albumID,
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
      const { userID, albumID }: ISubscriptionRequest = req.body;
      const args = {
        arg0: userID,
        arg1: albumID,
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

  index() {
    return async (req: Request, res: Response) => {
      const { token } = req as IAuthRequest;
      if (!token || !token.isAdmin) {
        // Endpoint hanya bisa diakses oleh admin
        res.status(StatusCodes.UNAUTHORIZED).json({
          message: ReasonPhrases.UNAUTHORIZED,
        });
        return;
      }

      let IsubscriptionData: ISubscriptionData[] = [];
      try {
        const response = await this.soapCaller.call("getSubscriptions");
        /* results.forEach((result: any) => {
                    IsubscriptionData.push({
                        creatorID: result.creatorID[0],
                        subscriberID: result.subscriberID[0],
                        creatorName: result.creatorName[0],
                        subscriberName: result.subscriberName[0],
                    });
                }); */

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
}
