import { Request, Response, NextFunction } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

import { IAuthRequest, IAuthToken } from "../interfaces";

export class AdminMiddleware {
  authenticate() {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { token } = req as IAuthRequest;

        if (!token) {
          return res.status(StatusCodes.UNAUTHORIZED).json({
            message: ReasonPhrases.UNAUTHORIZED,
          });
        }

        if (!token.isAdmin) {
          return res.status(StatusCodes.FORBIDDEN).json({
            message: ReasonPhrases.FORBIDDEN,
          });
        }

        next();
      } catch (error) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          message: ReasonPhrases.UNAUTHORIZED,
        });
      }
    };
  }
}
