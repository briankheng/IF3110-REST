import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Request, Response } from "express";

import prisma from "../prisma";
import { SoapCaller } from "../utils";

export class TokenController {
  checkToken() {
    return async (req: Request, res: Response) => {
      try {
        const { token } = req.body;

        // Create soapCaller
        const soapCaller = new SoapCaller(process.env.SOAP_URL + "/token");

        const args = {
          arg0: token,
          arg1: req.ip,
        };

        // Call the SOAP service
        const response = await soapCaller.call('checkToken', args);

        // If the token exists in the database
        if (response != null) {
          res.status(StatusCodes.OK).json({
            valid: true,
            message: response.coinValue,
          });
        } else {
          res.status(StatusCodes.OK).json({
            valid: false,
            message: "Token does not exist.",
          });
        }
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }
    };
  }

  addCoins() {
    return async (req: Request, res: Response) => {
      try {
        const { userId, coinValue } = req.body;
        const user = await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            coins: {
              increment: coinValue,
            },
          },
        });
        res.status(StatusCodes.OK).json(user);
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }
    };
  }
}
