import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

import { IAuthRequest, IAuthToken } from "../interfaces";
import { jwtConfig } from "../config/jwt-config";
import { Hasher } from "../utils";
import prisma from "../prisma";
import url from "url";

interface TokenRequest {
  username: string;
  password: string;
}

interface IUserRequest {
  email: string;
  username: string;
  name: string;
  password: string;
}

export class UserController {
  token() {
    return async (req: Request, res: Response) => {
      const { username, password }: TokenRequest = req.body;
      if (!username || !password) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: ReasonPhrases.BAD_REQUEST,
        });
      }

      const user = await prisma.user.findFirst({
        select: {
          id: true,
          password: true,
          is_admin: true,
        },
        where: {
          username: username,
        },
      });

      if (!user) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          message: "Invalid credentials",
        });
        return;
      }

      const isMatch = await bcryptjs.compare(password, user.password);
      if (!isMatch) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          message: "Invalid credentials",
        });
        return;
      }

      const { id, is_admin } = user;
      const payload: IAuthToken = { id, isAdmin: is_admin };
      const token = jwt.sign(payload, jwtConfig.secret, {
        expiresIn: jwtConfig.expiresIn,
      });

      res.status(StatusCodes.OK).json({
        message: ReasonPhrases.OK,
        token,
      });
    };
  }

  store() {
    return async (req: Request, res: Response) => {
      try {
        const { email, username, name, password }: IUserRequest = req.body;
        if (!email || !username || !name || !password) {
          throw res.status(StatusCodes.BAD_REQUEST).json({
            message: ReasonPhrases.BAD_REQUEST,
          });
        }

        const existingUserWithUsername = await prisma.user.findFirst({
          where: { username },
        });

        if (existingUserWithUsername) {
          throw res.status(StatusCodes.BAD_REQUEST).json({
            message: "Username already taken!",
          });
        }

        const existingUserWithEmail = await prisma.user.findFirst({
          where: { email },
        });

        if (existingUserWithEmail) {
          throw res.status(StatusCodes.BAD_REQUEST).json({
            message: "Email already taken!",
          });
        }

        const hashedPassword = await Hasher(password);
        const newUser = await prisma.user.create({
          data: {
            email,
            username,
            name,
            password: hashedPassword,
            is_admin: false,
          },
        });

        if (!newUser) {
          throw res.status(StatusCodes.BAD_REQUEST).json({
            message: ReasonPhrases.BAD_REQUEST,
          });
        }

        const { id, is_admin } = newUser;
        const payload: IAuthToken = { id, isAdmin: is_admin };
        const token = jwt.sign(payload, jwtConfig.secret, {
          expiresIn: jwtConfig.expiresIn,
        });

        return res.status(StatusCodes.CREATED).json(token);
      } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: ReasonPhrases.INTERNAL_SERVER_ERROR,
        });
      }
    };
  }

  index() {
    return async (req: Request, res: Response) => {
      const users = await prisma.user.findMany({
        select: { id: true, name: true },
        where: { is_admin: false },
      });

      res.status(StatusCodes.OK).json({
        message: ReasonPhrases.OK,
        data: users,
      });
    };
  }

  admin() {
    return async (req: Request, res: Response) => {
      const admin = await prisma.user.findFirst({
        where: { is_admin: true },
      });

      res.status(StatusCodes.OK).json({
        message: ReasonPhrases.OK,
        data: admin,
      });
    };
  }

  check() {
    return async (req: Request, res: Response) => {
      const { token } = req as IAuthRequest;
      if (!token) {
        res.status(StatusCodes.UNAUTHORIZED).json({
          message: ReasonPhrases.UNAUTHORIZED,
        });
        return;
      }

      res.status(StatusCodes.OK).json({
        id: token.id,
        isAdmin: token.isAdmin,
      });
    };
  }

  getEmailsByIds() {
    return async (req: Request, res: Response) => {
      const parsedUrl = url.parse(req.url, true);
      const queryParams = parsedUrl.query;
      const userIds = queryParams.userIds;

      // Check if userIds is not present or not an array
      if (userIds === undefined || typeof userIds !== "string") {
        res.status(StatusCodes.BAD_REQUEST).json({
          message: ReasonPhrases.BAD_REQUEST,
        });
        return;
      }

      try {
        // Convert userIds to an array of strings
        const userIdsArray = userIds.split(",");
        console.log(userIdsArray);

        // Query the database to get user emails by ids
        const users = await prisma.user.findMany({
          select: { id: true, email: true },
          where: { id: { in: userIdsArray.map((id) => parseInt(id, 10)) } },
        });

        // Extract emails from the database result
        const emails = users.map((user) => user.email);

        res.status(StatusCodes.OK).json({
          message: ReasonPhrases.OK,
          data: emails,
        });
      } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: ReasonPhrases.INTERNAL_SERVER_ERROR,
        });
      }
    };
  }

  me() {
    return async (req: Request, res: Response) => {
      const { token } = req as IAuthRequest;

      try {
        const user = await prisma.user.findUnique({
          where: { id: token?.id },
          include: {
            comments: true,
            ratings: true,
            videos: true,
          },
        });

        res.status(StatusCodes.OK).json(user);
      } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: ReasonPhrases.INTERNAL_SERVER_ERROR,
        });
      }
    };
  }
}
