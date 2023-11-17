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
      try {
        const { username, password }: TokenRequest = req.body;
        if (!username || !password) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            message: ReasonPhrases.BAD_REQUEST,
          });
        }

        const user = await prisma.user.findFirst({
          select: {
            id: true,
            password: true,
            isAdmin: true,
          },
          where: {
            username: username,
          },
        });

        if (!user) {
          return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "Invalid credentials",
          });
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
          return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "Invalid credentials",
          });
        }

        const { id, isAdmin } = user;
        const payload: IAuthToken = { id, isAdmin: isAdmin };
        const token = jwt.sign(payload, jwtConfig.secret, {
          expiresIn: jwtConfig.expiresIn,
        });

        return res.status(StatusCodes.OK).json({
          message: ReasonPhrases.OK,
          token,
        });
      } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: ReasonPhrases.INTERNAL_SERVER_ERROR,
        });
      }
    };
  }

  store() {
    return async (req: Request, res: Response) => {
      try {
        const { email, username, name, password }: IUserRequest = req.body;
        if (!email || !username || !name || !password) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            message: ReasonPhrases.BAD_REQUEST,
          });
        }

        const existingUserWithUsername = await prisma.user.findFirst({
          where: { username },
        });

        if (existingUserWithUsername) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Username already taken!",
          });
        }

        const existingUserWithEmail = await prisma.user.findFirst({
          where: { email },
        });

        if (existingUserWithEmail) {
          return res.status(StatusCodes.BAD_REQUEST).json({
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
            isAdmin: false,
          },
        });

        if (!newUser) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            message: ReasonPhrases.BAD_REQUEST,
          });
        }

        const { id, isAdmin } = newUser;
        const payload: IAuthToken = { id, isAdmin: isAdmin };
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
        where: { isAdmin: false },
      });

      return res.status(StatusCodes.OK).json({
        message: ReasonPhrases.OK,
        data: users,
      });
    };
  }

  show() {
    return async (req: Request, res: Response) => {
      try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({
          where: { id: Number(id) },
        });

        return res.status(StatusCodes.OK).json(user);
      } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: ReasonPhrases.INTERNAL_SERVER_ERROR,
        });
      }
    };
  }

  admin() {
    return async (req: Request, res: Response) => {
      const admin = await prisma.user.findFirst({
        where: { isAdmin: true },
      });

      return res.status(StatusCodes.OK).json({
        message: ReasonPhrases.OK,
        data: admin,
      });
    };
  }

  check() {
    return async (req: Request, res: Response) => {
      const { token } = req as IAuthRequest;
      if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: ReasonPhrases.UNAUTHORIZED,
        });
      }

      return res.status(StatusCodes.OK).json({
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
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: ReasonPhrases.BAD_REQUEST,
        });
      }

      try {
        // Convert userIds to an array of strings
        const userIdsArray = userIds.split(",");

        // Query the database to get user emails by ids
        const users = await prisma.user.findMany({
          select: { id: true, email: true },
          where: { id: { in: userIdsArray.map((id) => parseInt(id, 10)) } },
        });

        // Extract emails from the database result
        const emails = users.map((user) => user.email);

        return res.status(StatusCodes.OK).json({
          message: ReasonPhrases.OK,
          data: emails,
        });
      } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
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

        return res.status(StatusCodes.OK).json(user);
      } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: ReasonPhrases.INTERNAL_SERVER_ERROR,
        });
      }
    };
  }

  buyVideo() {
    return async (req: Request, res: Response) => {
      const { token } = req as IAuthRequest;
      const { id } = req.params;

      try {
        const user = await prisma.user.update({
          where: { id: token?.id },
          data: {
            coins: {
              decrement: 10,
            },
            videos: {
              connect: {
                id: parseInt(id),
              },
            },
          },
        });

        return res.status(StatusCodes.OK).json(user);
      } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: ReasonPhrases.INTERNAL_SERVER_ERROR,
        });
      }
    };
  }
}
