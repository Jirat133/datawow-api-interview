import { CommentDto } from './comment.dto';
export interface PostDto {
    id: number; 
    title: string; 
    content: string; 
    tag: string; 
    author: string; 
    createdAt: Date; 
    updatedAt?: Date; 
    comments?: CommentDto[]; 
}

export interface PostResponseDto {
    id: number; 
    title: string; 
    content: string; 
    tag: string; 
    author: string; 
    createdAt: Date; 
    updatedAt?: Date;
    comments?: CommentDto[]; 
}