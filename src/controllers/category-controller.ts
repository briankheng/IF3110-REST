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

        return res.status(StatusCodes.OK).json(categories);
      } catch (error) {
        return res
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

        return res.status(StatusCodes.OK).json(category);
      } catch (error) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }
    };
  }

  getAlbums() {
    return async (req: Request, res: Response) => {
      try {
        const { id } = req.query;

        // Find the category with the specified ID
        const category = await prisma.category.findUnique({
          where: {
            id: Number(id),
          },
          include: {
            albums: true,
          },
        });

        if (!category) {
          // Return a 404 response if the category is not found
          res
            .status(StatusCodes.NOT_FOUND)
            .json({ message: ReasonPhrases.NOT_FOUND });
          return;
        }

        // Access the albums property of the category to get all associated albums
        const albums = category.albums;

        res.status(StatusCodes.OK).json(albums);
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }
    };
  }
}
