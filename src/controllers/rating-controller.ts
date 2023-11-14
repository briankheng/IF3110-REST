import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Request, Response } from "express";

import { IRatingRequest } from "../interfaces";
import prisma from "../prisma";

export class RatingController {
  index() {
    return async (req: Request, res: Response) => {
      try {
        const { albumId, userId } = req.query;

        if (!albumId) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: ReasonPhrases.BAD_REQUEST });
        }

        if (userId) {
          const rating = await prisma.rating.findFirst({
            where: {
              albumId: Number(albumId),
              userId: Number(userId),
            },
          });

          return res.status(StatusCodes.OK).json(rating);
        }

        const ratings = await prisma.rating.findMany({
          where: {
            albumId: Number(albumId),
          },
        });

        return res.status(StatusCodes.OK).json(ratings);
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
        const { score, userId, albumId }: IRatingRequest = req.body;
        const rating = await prisma.rating.create({
          data: {
            score,
            userId,
            albumId,
          },
        });
        res.status(StatusCodes.CREATED).json(rating);
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
        const { score, userId, albumId }: IRatingRequest = req.body;
        const rating = await prisma.rating.update({
          where: {
            id: Number(id),
          },
          data: {
            score,
            userId,
            albumId,
          },
        });
        res.status(StatusCodes.OK).json(rating);
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
        const rating = await prisma.rating.delete({
          where: {
            id: Number(id),
          },
        });
        res.status(StatusCodes.OK).json(rating);
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }
    };
  }
}
