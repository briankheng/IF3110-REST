import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Request, Response } from "express";

import { ICommentRequest } from "../interfaces";
import prisma from "../prisma";

export class CommentController {
  index() {
    return async (req: Request, res: Response) => {
      try {
        const { videoId } = req.query;

        if (!videoId) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: ReasonPhrases.BAD_REQUEST });
        }

        const comments = await prisma.comment.findMany({
          where: {
            videoId: Number(videoId),
          },
        });

        return res.status(StatusCodes.OK).json(comments);
      } catch (error) {
        return res
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

        return res.status(StatusCodes.CREATED).json(comment);
      } catch (error) {
        return res
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

        return res.status(StatusCodes.OK).json(comment);
      } catch (error) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }
    };
  }

  patch(){
    return async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const { text }: ICommentRequest = req.body;

        const comment = await prisma.comment.update({
          where: {
            id: Number(id),
          },
          data: {
            text,
          },
        });

        return res.status(StatusCodes.OK).json(comment);
      } catch (error) {
        return res
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

        return res.status(StatusCodes.OK).json(comment);
      } catch (error) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }
    };
  }
}
