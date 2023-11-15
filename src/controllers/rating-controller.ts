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

        return res.status(StatusCodes.CREATED).json(rating);
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
        const { score, userId, albumId }: IRatingRequest = req.body;

        // Find the record based on userId and albumId
        const existingRating = await prisma.rating.findFirst({
          where: {
            albumId: Number(albumId),
            userId: Number(userId),
          },
        });

        if (!existingRating) {
          // Handle the case where the record is not found
          return res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: 'Rating not found' });
        }

        // Use the retrieved id to update the record
        const rating = await prisma.rating.update({
          where: {
            id: existingRating.id,
          },
          data: {
            score: score,
          },
        });

        return res.status(StatusCodes.OK).json(rating);
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
        const { userId, albumId }: IRatingRequest = req.body;
        // Find the record based on userId and albumId
        const existingRating = await prisma.rating.findFirst({
          where: {
            albumId: Number(albumId),
            userId: Number(userId),
          },
        });

        if (!existingRating) {
          // Handle the case where the record is not found
          return res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: 'Rating not found' });
        }

        const rating = await prisma.rating.delete({
          where: {
            id: existingRating.id,
          },
        });

        return res.status(StatusCodes.OK).json(rating);
      } catch (error) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }
    };
  }
}
