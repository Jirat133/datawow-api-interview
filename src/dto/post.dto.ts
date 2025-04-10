import { CommentDto } from './comment.dto';
export interface PostDto {
    id: number; // Unique identifier for the post
    title: string; // Title of the post
    content: string; // Content of the post
    tags: string[]; // Tag associated with the post
    author: string; // Author of the post
    createdAt: Date; // Timestamp when the post was created
    updatedAt?: Date; // Optional timestamp for when the post was last updated
    comments?: CommentDto[]; // Optional list of comments associated with the post
}

export interface PostResponseDto {
    id: number; // Unique identifier for the post
    title: string; // Title of the post
    content: string; // Content of the post
    tags: string[]; // Tag associated with the post
    author: string; // Author of the post
    createdAt: Date; // Timestamp when the post was created
    updatedAt?: Date; // Optional timestamp for when the post was last updated
    comments?: CommentDto[]; // Optional list of comments associated with the post
}