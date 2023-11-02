import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

import { IAuthRequest, IAuthToken } from "../interfaces";
import { jwtConfig } from "../config/jwt-config";
import { Hasher } from "../utils";
import prisma from '../prisma';

interface TokenRequest {
    username: string;
    password: string;
}

interface StoreRequest {
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
                    role: true,
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

            const { id, role } = user;
            const isAdmin = role === "ADMIN";
            const payload: IAuthToken = { id, isAdmin };
            const token = jwt.sign(payload, jwtConfig.secret, {
                expiresIn: jwtConfig.expiresIn,
            });

            res.status(StatusCodes.OK).json({
                message: ReasonPhrases.OK,
                token,
            });
        }
    }

    store() {
        return async (req: Request, res: Response) => {
            const { email, username, name, password }: StoreRequest = req.body;
            if (!email || !username || !name || !password) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: ReasonPhrases.BAD_REQUEST,
                });
            }

            const existingUserWithUsername = await prisma.user.findFirst({
                where: { username },
            });

            if (existingUserWithUsername) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: "Username already taken!",
                });
            }

            const existingUserWithEmail = await prisma.user.findFirst({
                where: { email },
            });

            if (existingUserWithEmail) {
                res.status(StatusCodes.BAD_REQUEST).json({
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
                    role: "USER",
                },
            });

            if (!newUser) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: ReasonPhrases.BAD_REQUEST,
                });
                return;
            }

            const { id, role } = newUser;
            const isAdmin = role === "ADMIN";
            const payload: IAuthToken = { id, isAdmin };
            const token = jwt.sign(payload, jwtConfig.secret, {
                expiresIn: jwtConfig.expiresIn,
            });

            res.status(StatusCodes.CREATED).json({
                message: ReasonPhrases.CREATED,
                token,
            });
        }
    }

    index() {
        return async (req: Request, res: Response) => {
            const users = await prisma.user.findMany({
                select: { id: true, name: true },
                where: { role: "USER" }, 
            });

            res.status(StatusCodes.OK).json({
                message: ReasonPhrases.OK,
                data: users,
            });
        }
    }

    admin() {
        return async (req: Request, res: Response) => {
            const admin = await prisma.user.findFirst({
                where: { role: "ADMIN" },
            });

            res.status(StatusCodes.OK).json({
                message: ReasonPhrases.OK,
                data: admin,
            });
        }
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
        }
    }
}
