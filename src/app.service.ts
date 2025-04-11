import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PostDto, PostResponseDto } from './dto/post.dto';
import { UserDto } from './dto/user.dto';
import { CommentDto } from './dto/comment.dto';
import { Response } from './dto/response.dto';


@Injectable()
export class AppService {
  private users: UserDto[] = [];
  private posts: PostDto[] = [];
  private comments: CommentDto[] = [];
  private currentUser: UserDto;

  

  signIn(username: string): UserDto {
    const existingUser = this.users.find(u => {
      return (u.username === username)
    });
    let user
    if (!existingUser) {
      user = { id: this.users.length + 1, username }
      this.users.push(user);
    }
    if (existingUser) {
      user = existingUser
    }
    this.currentUser = user
    return user;
  }

  getPostDetail(postId: number): PostDto | null {
    const post = this.posts.find(p => p.id === postId);
    if (!post) {
      return null;
    }
    return post
  }


  createPost(post: PostDto): Response {
    const userExists = this.users.find(u => u.username === post.author);
    if (!userExists) {
      throw new BadRequestException('User does not exist.');
    }
    if(!(post.tag) || !(post.content) || !(post.title)){
      throw new BadRequestException('Post content, title or tag is missing.');
    }
    const maxId = this.posts.length > 0 ? Math.max(...this.posts.map(p => p.id)) : 0;
    post.id = maxId + 1;
    post.createdAt = new Date();
    post.updatedAt = new Date();
    this.posts.push(post);
    return {
      statusCode: 201,
      message: 'Post created successfully',
      data: post,
    };
  }

  commentOnPost(comment: CommentDto): Response {
    if (!comment.content) {
      throw new BadRequestException('Comment content is required.');
    }
    const userExists = this.users.find(u => u.username === comment.author);
    const postExists = this.posts.find(p => p.id === comment.postId);
    if (!userExists) {
      throw new NotFoundException('User does not exist.');
    }
    if (!postExists) {
      throw new NotFoundException('Post does not exist.');
    }
    comment.createdAt = new Date();
    comment.updatedAt = new Date();
    const maxId = this.comments.length > 0 ? Math.max(...this.comments.map(p => p.id)) : 0;
    comment.id = maxId + 1;
    this.comments.push(comment);
    const postIndex = this.posts.findIndex(p => p.id === comment.postId);

    if (!this.posts[postIndex].comments) {
      this.posts[postIndex].comments = [];
    }
    this.posts[postIndex].comments.push(comment);
    return {
      statusCode: 201,
      message: 'Comment added successfully',
      data: this.posts[postIndex],
    };
  }

  editComment(commentId: number, author: string, newContent: string): Response{
    const user = this.users.find(u => u.username === author);
    if(!user) {
      throw new NotFoundException('User not found.');
    }
    if(!newContent) {
      throw new BadRequestException('Comment content is required.');
    }
    const comment = this.comments.find(c => c.id === commentId && c.author === author);
    if (!comment) {
      throw new NotFoundException('Comment not found or you are not the author.');
    }
    comment.content = newContent;
    comment.updatedAt = new Date();
    const index = this.comments.findIndex(c => c.id === commentId);
    if (index !== -1) {
      this.comments[index] = comment;
    }
    return {
      statusCode: 200,
      message: 'Comment updated successfully',
      data: comment,
    };
  }

  getFeed(): PostResponseDto[] {
    return this.posts;
  }

  getUserProfile(id: number): { posts: PostDto[]; } {
    const userPosts = this.posts.filter(p => p.author === this.users.find(u => u.id === id)?.username);
    return { posts: userPosts };
  }

  getPostsByTag(tag: string): PostDto[] {
    return this.posts.filter(post => post.tag.includes(tag));
  }

  deletePost(postId: number): Response {
    const postIndex = this.posts.findIndex(p => p.id === postId && p.author === this.currentUser.username);

    if (postIndex === -1) {
      throw new NotFoundException('Post not found.');
    }

    //Delete comments associated with the post
    this.comments = this.comments.filter(c => c.postId !== postId);
    //Delete post
    const deletedPost = this.posts[postIndex];
    this.posts.splice(postIndex, 1);


    return {
      statusCode: 200,
      message: 'Post deleted successfully',
      data: deletedPost,
    };
  }

  deleteComment(commentId: number, body: any): Response {
    const commentIndex = this.comments.findIndex(c => c.id === commentId);
    const commentAuthor = this.comments.find(c => c.id === commentId && c.author === body.author);
    if (!commentAuthor) {
      throw new BadRequestException('You are not the author.');
    }
    if (commentIndex === -1) {
      throw new NotFoundException('Comment not found.');
    }
    const deletedComment = this.comments[commentIndex];
    //Delete comment
    this.comments.splice(commentIndex, 1);
    //Delete comment from post
    const postIndex = this.posts.findIndex(p => p.id === deletedComment.postId);
    if (postIndex !== -1) {
      this.posts[postIndex].comments = this.posts[postIndex].comments?.filter(c => c.id !== commentId) || [];
    }
    return {
      statusCode: 200,
      message: 'Comment deleted successfully',
      data: deletedComment,
    };
  }

  editPost(postId: number, body: PostDto): Response {
    const { author, title, content, tag } = body;
    const user = this.users.find(u => u.username === author);
    const post = this.posts.find(p => p.id === postId && p.author === user?.username);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    if (!post) {
      throw new NotFoundException('You are not the writer or post doesn\'t exist.');
    }
    if(!title || !content || !tag) {
      throw new BadRequestException('Post title, content or tag is missing.');
    }
    post.title = title;
    post.content = content;
    post.tag = tag;
    post.updatedAt = new Date();
    const index = this.posts.findIndex(p => p.id === postId);
    if (index !== -1) {
      this.posts[index] = post;
    }
    return {
      statusCode: 200,
      message: 'Post updated successfully',
      data: post,
    };
  }

}
