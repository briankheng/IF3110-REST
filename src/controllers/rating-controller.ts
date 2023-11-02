import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import prisma from "../prisma";

interface IRatingRequest {
  score: number;
  user_id: number;
  album_id: number;
}

export class RatingController {
  index() {
    return async (req: Request, res: Response) => {
      try {
        const ratings = await prisma.rating.findMany();
        res.status(StatusCodes.OK).json(ratings);
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
        const rating = await prisma.rating.findUnique({
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

  store() {
    return async (req: Request, res: Response) => {
      try {
        const { score, user_id, album_id }: IRatingRequest = req.body;
        const rating = await prisma.rating.create({
          data: {
            score,
            user_id,
            album_id,
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
        const { score, user_id, album_id }: IRatingRequest = req.body;
        const rating = await prisma.rating.update({
          where: {
            id: Number(id),
          },
          data: {
            score,
            user_id,
            album_id,
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
