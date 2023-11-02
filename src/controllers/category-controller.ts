import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Request, Response } from "express";

import { ICategoryRequest } from "../interfaces";
import prisma from "../prisma";

export class CategoryController {
  index() {
    return async (req: Request, res: Response) => {
      try {
        const categories = await prisma.category.findMany({
          include: {
            albums: true,
          },
        });
        res.status(StatusCodes.OK).json(categories);
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
        const category = await prisma.category.findUnique({
          where: {
            id: Number(id),
          },
          include: {
            albums: true,
          },
        });
        res.status(StatusCodes.OK).json(category);
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
        const { name }: ICategoryRequest = req.body;
        const category = await prisma.category.create({
          data: {
            name,
          },
        });
        res.status(StatusCodes.CREATED).json(category);
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
        const { name }: ICategoryRequest = req.body;
        const category = await prisma.category.update({
          where: {
            id: Number(id),
          },
          data: {
            name,
          },
        });
        res.status(StatusCodes.OK).json(category);
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
        const category = await prisma.category.delete({
          where: {
            id: Number(id),
          },
        });
        res.status(StatusCodes.OK).json(category);
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }
    };
  }
}
