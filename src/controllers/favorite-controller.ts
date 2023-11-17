import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Request, Response } from "express";

import { IFavoriteRequest } from "../interfaces";
import { SoapCaller, CacheHandler } from "../utils";
import prisma from "../prisma";

export class FavoriteController {
  async index(req: Request, res: Response) {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: ReasonPhrases.BAD_REQUEST });
      }

      const cacheKey = `Favorite-SOAP-${userId}`;

      // Check the cache first
      const cachedResponse = await CacheHandler.handle(cacheKey, async () => {
        // Call SOAP Service
        const soapCaller = new SoapCaller(
          process.env.USE_DOCKER_CONFIG
            ? process.env.SOAP_URL_DOCKER + "/favorite" || ""
            : process.env.SOAP_URL + "/favorite" || ""
        );
        const albumIds = await soapCaller.call("getFavorites", {
          arg0: userId,
          arg1: req.ip,
        });

        if (!albumIds) {
          return [];
        }

        // Convert album IDs to numbers
        const numericAlbumIds = albumIds.data.map((albumId: string) =>
          parseInt(albumId, 10)
        );

        const response = await Promise.all(
          numericAlbumIds.map(async (albumId: number) => {
            const album = await prisma.album.findUnique({
              where: {
                id: albumId,
              },
              include: {
                videos: true,
                ratings: true,
                categories: true,
              },
            });

            return album;
          })
        );

        console.log("response");
        console.log(response);

        // Cache the response
        CacheHandler.put(cacheKey, response);

        return response;
      });

      return res.status(StatusCodes.OK).json(cachedResponse);
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
  }

  verify() {
    return async (req: Request, res: Response) => {
      try {
        const { userId, albumId } = req.query;

        if (!userId || !albumId) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: ReasonPhrases.BAD_REQUEST });
        }

        const args = {
          arg0: userId,
          arg1: albumId,
          arg2: req.ip,
        };

        const soapCaller = new SoapCaller(
          process.env.USE_DOCKER_CONFIG
            ? process.env.SOAP_URL_DOCKER + "/favorite" || ""
            : process.env.SOAP_URL + "/favorite" || ""
        );

        const albumIds = await soapCaller.call("getFavorites", args);
        if (albumIds) {
          const response = albumIds.data.includes(albumId);
          return res.status(StatusCodes.OK).json(response);
        } 
        return res.status(StatusCodes.OK).json(false);
        
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
        const { userId, albumId }: IFavoriteRequest = req.body;

        if (!userId || !albumId) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: ReasonPhrases.BAD_REQUEST });
        }

        const args = {
          arg0: userId,
          arg1: albumId,
          arg2: req.ip,
        };

        // Call SOAP Service
        const soapCaller = new SoapCaller(
          process.env.USE_DOCKER_CONFIG
            ? process.env.SOAP_URL_DOCKER + "/favorite" || ""
            : process.env.SOAP_URL + "/favorite" || ""
        );
        const response = await soapCaller.call("addFavorite", args);

        return res.status(StatusCodes.OK).json(response);
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
        const { userId, albumId }: IFavoriteRequest = req.body;

        if (!userId || !albumId) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: ReasonPhrases.BAD_REQUEST });
        }

        const args = {
          arg0: userId,
          arg1: albumId,
          arg2: req.ip,
        };

        // Call SOAP Service
        const soapCaller = new SoapCaller(
          process.env.USE_DOCKER_CONFIG
            ? process.env.SOAP_URL_DOCKER + "/favorite" || ""
            : process.env.SOAP_URL + "/favorite" || ""
        );
        const response = await soapCaller.call("removeFavorite", args);

        return res.status(StatusCodes.OK).json(response);
      } catch (error) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }
    };
  }

  deleteFavoritesByAlbumId() {
    return async (req: Request, res: Response) => {
      try {
        const args = {
          arg0: Number(req.params.id),
          arg1: req.ip,
        };

        // Call SOAP Service
        const soapCaller = new SoapCaller(
          process.env.USE_DOCKER_CONFIG
            ? process.env.SOAP_URL_DOCKER + "/favorite" || ""
            : process.env.SOAP_URL + "/favorite" || ""
        );
        await soapCaller.call("removeFavoritesByAlbumId", args);

        return res.status(StatusCodes.OK).json({ message: "OK" });
      } catch (error) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }
    };
  }
}
