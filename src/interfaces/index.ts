import { Request, Response } from 'express';

export type handlerType = (
    req: Request,
    res: Response,
) => Promise<Response<any, Record<string, any>>>;

export interface ISubscription {
    userId: number;
    albumId: number;
    status: string;
}