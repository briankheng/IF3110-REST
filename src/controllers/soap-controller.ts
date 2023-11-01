import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Request, Response } from "express";

import { AuthRequest } from "../middlewares/authentication-middleware";
import { SoapCaller } from "../utils";

interface SubscriptionRequest {
    userID: number;
    albumID: number;
}

interface SubscriptionData {
    userID: number;
    albumID: number;
    userName: string;
    albumName: string;
}

export class SoapController {
    private soapCaller: SoapCaller

    constructor(url: string) {
        this.soapCaller = new SoapCaller(url)
    }

    accept() {
        return async (req: Request, res: Response) => {
            const { token } = req as AuthRequest;
            if (!token || !token.isAdmin) {
                // Admin only
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: ReasonPhrases.UNAUTHORIZED,
                });
                return;
            }

            // Parse request body
            const { userID, albumID }: SubscriptionRequest = req.body;
            const args = {
                arg0: userID,
                arg1: albumID,
            }

            try {
                const response = await this.soapCaller.call('acceptSubscription', args);
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
            const { token } = req as AuthRequest;
            if (!token || !token.isAdmin) {
                // Admin only
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: ReasonPhrases.UNAUTHORIZED,
                });
                return;
            }

            // Parse request body
            const { userID, albumID }: SubscriptionRequest = req.body;
            const args = {
                arg0: userID,
                arg1: albumID,
            }

            try {
                const response = await this.soapCaller.call('rejectSubscription', args);
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
            const { token } = req as AuthRequest;
            if (!token || !token.isAdmin) {
                // Endpoint hanya bisa diakses oleh admin
                res.status(StatusCodes.UNAUTHORIZED).json({
                    message: ReasonPhrases.UNAUTHORIZED,
                });
                return;
            }

            let subscriptionData: SubscriptionData[] = [];
            try {
                const response = await this.soapCaller.call('getSubscriptions');
                /* results.forEach((result: any) => {
                    subscriptionData.push({
                        creatorID: result.creatorID[0],
                        subscriberID: result.subscriberID[0],
                        creatorName: result.creatorName[0],
                        subscriberName: result.subscriberName[0],
                    });
                }); */

                console.log(response);
            } catch (error) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: ReasonPhrases.INTERNAL_SERVER_ERROR,
                });
                return;
            }
        };
    }
}