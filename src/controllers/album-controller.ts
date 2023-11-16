import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Request, Response } from "express";

import { IAlbumRequest } from "../interfaces";
import prisma from "../prisma";
import { Shuffle } from "../utils";

export class AlbumController {
  index() {
    return async (req: Request, res: Response) => {
      try {
        const albums = await prisma.album.findMany({
          include: {
            videos: true,
            ratings: true,
            categories: true,
          },
        });

        return res.status(StatusCodes.OK).json(albums);
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

        const album = await prisma.album.findUnique({
          where: {
            id: Number(id),
          },
          include: {
            videos: true,
            ratings: true,
            categories: true,
          },
        });

        return res.status(StatusCodes.OK).json(album);
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
        const { title, description, thumbnail, categoryIds }: IAlbumRequest =
          req.body;

        const album = await prisma.album.create({
          data: {
            title,
            description,
            thumbnail,
            categories: {
              connect: categoryIds.map((categoryId) => ({
                id: categoryId,
              })),
            },
          },
        });

        return res.status(StatusCodes.CREATED).json(album);
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
        const { title, description, thumbnail, categoryIds }: IAlbumRequest =
          req.body;

        const album = await prisma.album.update({
          where: {
            id: Number(id),
          },
          data: {
            title,
            description,
            thumbnail,
            categories: {
              connect: categoryIds.map((categoryId) => ({
                id: categoryId,
              })),
            },
          },
        });

        return res.status(StatusCodes.OK).json(album);
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

        const album = await prisma.album.delete({
          where: {
            id: Number(req.params.id),
          },
        });

        return res.status(StatusCodes.OK).json(album);
      } catch (error) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }
    };
  }

  search() {
    return async (req: Request, res: Response) => {
      try {
        const { title } = req.query;

        const albums = await prisma.album.findMany({
          where: {
            title: {
              contains: title as string,
              mode: "insensitive", // makes the search case insensitive
            },
          },
          include: {
            videos: true,
            ratings: true,
            categories: true,
          },
        });

        return res.status(StatusCodes.OK).json(albums);
      } catch (error) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }
    };
  }

  recommend() {
    return async (req: Request, res: Response) => {
      try {
        const albums = await prisma.album.findMany({
          include: {
            videos: true,
            ratings: true,
            categories: true,
          },
        });

        const shuffledAlbums = Shuffle(albums);
        const videosYouMightLike = shuffledAlbums.slice(0, 6);

        return res.status(StatusCodes.OK).json(videosYouMightLike);
      } catch (error) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }
    };
  }
}
