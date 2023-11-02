import { Request } from "express";

// Authentication Interface
export interface IAuthToken {
  id: number;
  isAdmin: boolean;
}

export interface IAuthRequest extends Request {
  token: IAuthToken;
}

// Subscription Interface
export interface ISubscriptionRequest {
  userID: number;
  albumID: number;
}

export interface ISubscriptionData {
  userID: number;
  albumID: number;
  userName: string;
  albumName: string;
}

// Album Interface
export interface IAlbumRequest {
  title: string;
  description: string;
  thumbnail: string;
}

// Category Interface
export interface ICategoryRequest {
  name: string;
}

// Comment Interface
export interface ICommentRequest {
  text: string;
  user_id: number;
  video_id: number;
}

// Rating Interface
export interface IRatingRequest {
  score: number;
  user_id: number;
  album_id: number;
}

// Video Interface
export interface IVideoRequest {
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  views: number;
  is_premium: boolean;
  album_id: number;
}

// SOAP Interface
export interface IValidateRequest {
  userID: number;
  albumID: number;
}
