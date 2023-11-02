import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import prisma from "../prisma";

interface IVideoRequest {
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  views: number;
  album_id: number;
}

export class VideoController {
  index() {
    return async (req: Request, res: Response) => {
      try {
        const videos = await prisma.video.findMany({
          include: {
            comments: true,
          },
        });
        res.status(StatusCodes.OK).json(videos);
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
        const video = await prisma.video.findUnique({
          where: {
            id: Number(id),
          },
          include: {
            comments: true,
          },
        });
        res.status(StatusCodes.OK).json(video);
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
        const {
          title,
          description,
          url,
          thumbnail,
          views,
          album_id,
        }: IVideoRequest = req.body;
        const video = await prisma.video.create({
          data: {
            title,
            description,
            url,
            thumbnail,
            views,
            album_id,
          },
        });
        res.status(StatusCodes.CREATED).json(video);
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
        const {
          title,
          description,
          url,
          thumbnail,
          views,
          album_id,
        }: IVideoRequest = req.body;
        const video = await prisma.video.update({
          where: {
            id: Number(id),
          },
          data: {
            title,
            description,
            url,
            thumbnail,
            views,
            album_id,
          },
        });
        res.status(StatusCodes.OK).json(video);
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
        const video = await prisma.video.delete({
          where: {
            id: Number(id),
          },
        });
        res.status(StatusCodes.OK).json(video);
      } catch (error) {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }
    };
  }
}
