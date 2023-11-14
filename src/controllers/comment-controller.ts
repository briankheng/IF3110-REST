import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Request, Response } from "express";

import { ICommentRequest } from "../interfaces";
import prisma from "../prisma";

export class CommentController {
  index() {
    return async (req: Request, res: Response) => {
      try {
        const comments = await prisma.comment.findMany();
        res.status(StatusCodes.OK).json(comments);
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }
    };
  }

  show() {
    return async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const comment = await prisma.comment.findUnique({
          where: {
            id: Number(id),
          },
        });
        res.status(StatusCodes.OK).json(comment);
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }
    };
  }

  store() {
    return async (req: Request, res: Response) => {
      try {
        const { text, userId, videoId }: ICommentRequest = req.body;
        const comment = await prisma.comment.create({
          data: {
            text,
            userId,
            videoId,
          },
        });
        res.status(StatusCodes.CREATED).json(comment);
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }
    };
  }

  update() {
    return async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const { text, userId, videoId }: ICommentRequest = req.body;
        const comment = await prisma.comment.update({
          where: {
            id: Number(id),
          },
          data: {
            text,
            userId,
            videoId,
          },
        });
        res.status(StatusCodes.OK).json(comment);
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }
    };
  }

  destroy() {
    return async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const comment = await prisma.comment.delete({
          where: {
            id: Number(id),
          },
        });
        res.status(StatusCodes.OK).json(comment);
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }
    };
  }
}
