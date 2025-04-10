export interface CommentDto {
    id: number; // Unique identifier for the comment
    postId: number; // ID of the post the comment belongs to
    content: string; // Content of the comment
    author: string; // Author of the comment
    createdAt: Date; // Timestamp when the comment was created
    updatedAt: Date; // Timestamp when the comment was last updated
}