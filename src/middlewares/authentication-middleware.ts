import { Request, Response, NextFunction } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

import { IAuthRequest, IAuthToken } from "../interfaces";
import { jwtConfig } from "../config";

export class AuthenticationMiddleware {
  authenticate() {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
          res.status(StatusCodes.UNAUTHORIZED).json({
            message: ReasonPhrases.UNAUTHORIZED,
          });
          return;
        }

        (req as IAuthRequest).token = jwt.verify(
          token,
          jwtConfig.secret
        ) as IAuthToken;

        next();
      } catch (error) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          message: ReasonPhrases.UNAUTHORIZED,
        });
      }
    };
  }
}
