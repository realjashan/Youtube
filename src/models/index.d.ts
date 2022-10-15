import { ModelInit, MutableModel } from "@aws-amplify/datastore";

type VideoMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type CommentMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type UserMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Video {
  readonly id: string;
  readonly title: string;
  readonly thumbnail: string;
  readonly videoUrl: string;
  readonly duration: number;
  readonly views: number;
  readonly tags?: string | null;
  readonly likes: number;
  readonly dislikes: number;
  readonly userID: string;
  readonly Comments?: (Comment | null)[] | null;
  readonly User?: User | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Video, VideoMetaData>);
  static copyOf(source: Video, mutator: (draft: MutableModel<Video, VideoMetaData>) => MutableModel<Video, VideoMetaData> | void): Video;
}

export declare class Comment {
  readonly id: string;
  readonly comment: string;
  readonly likes: number;
  readonly dislikes: number;
  readonly replies: number;
  readonly videoID: string;
  readonly User?: User | null;
  readonly Video?: Video | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly commentUserId?: string | null;
  constructor(init: ModelInit<Comment, CommentMetaData>);
  static copyOf(source: Comment, mutator: (draft: MutableModel<Comment, CommentMetaData>) => MutableModel<Comment, CommentMetaData> | void): Comment;
}

export declare class User {
  readonly id: string;
  readonly name: string;
  readonly image?: string | null;
  readonly subscribers?: number | null;
  readonly Videos?: (Video | null)[] | null;
  readonly sub?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<User, UserMetaData>);
  static copyOf(source: User, mutator: (draft: MutableModel<User, UserMetaData>) => MutableModel<User, UserMetaData> | void): User;
}