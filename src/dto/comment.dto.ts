export interface CommentDto {
    id: number;
    postId: number;
    content: string;
    author: string;
    createdAt: Date;
    updatedAt: Date;
}