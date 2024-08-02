import mongoose from "mongoose";
export const baseURL = "http://localhost:3000";
export interface IContext {
  params: { _id: string };
}

export interface Ireplies {
  _id?: string;
  author: mongoose.Types.ObjectId;
  reply: string;
  file?: [String];
  likes?: mongoose.Types.ObjectId;
  createdAt: Date;
}
export type LinkType = {
  path: String;
  title: String;
};
export interface Isession {
  user: { email: string };
  expires: string;
}
export interface IPost {
  _id?: mongoose.Types.ObjectId;
  title: string;
  content: string;
  file?: Array<string>;
  author: mongoose.Types.ObjectId;
  comments?: Array<mongoose.Types.ObjectId>;
  likes?: Array<mongoose.Types.ObjectId>;
  createdAt?: Date;
}
export interface IComment {
  _id: mongoose.Types.ObjectId;
  content: string;
  file?: Array<string>;
  post: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  likes?: Array<mongoose.Types.ObjectId | string>;
  replies?: Array<Ireplies>;
  createdAt?: Date;
  _v: number;
}
export interface ICommentClient {
  content: string;
  files?: FileList | [];
}
// to be checked later
export interface IUser {
  _id?: string;
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserModel extends IUser {
  _id?: string;
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
  createdAt?: Date;
  updatedAt?: Date;
  profilePic?: BinaryData;
}

export interface IMetaData {
  title: string;
  description?: string;
  keywords?: string;
}

export interface IMetaTemplate {
  title: {
    default: string;
    template: string;
  };
  description?: string;
  keywords?: string;
}
