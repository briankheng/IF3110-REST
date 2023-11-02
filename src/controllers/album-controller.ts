import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import prisma from "../prisma";

interface IAlbumRequest {
  title: string;
  description: string;
  thumbnail: string;
}

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
        res.status(StatusCodes.OK).json(albums);
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
        res.status(StatusCodes.OK).json(album);
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
        const { title, description, thumbnail }: IAlbumRequest = req.body;
        const album = await prisma.album.create({
          data: {
            title,
            description,
            thumbnail,
          },
        });
        res.status(StatusCodes.CREATED).json(album);
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
        const { title, description, thumbnail }: IAlbumRequest = req.body;
        const album = await prisma.album.update({
          where: {
            id: Number(id),
          },
          data: {
            title,
            description,
            thumbnail,
          },
        });
        res.status(StatusCodes.OK).json(album);
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
        const album = await prisma.album.delete({
          where: {
            id: Number(id),
          },
        });
        res.status(StatusCodes.OK).json(album);
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }
    };
  }
}
