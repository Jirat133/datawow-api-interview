import { Controller, Get, Param, Body, Post, Patch, Delete } from '@nestjs/common';
import { AppService } from './app.service';
import { PostDto } from './dto/post.dto';
import { UserDto } from './dto/user.dto';
import { CommentDto } from './dto/comment.dto';
import { Response } from './dto/response.dto';

@Controller()
export class AppController {

  constructor(private readonly appService: AppService) { }
  @Get()
  getHello(): string {
    return 'Hello World!';
  }

  @Post('signin')
  signIn(@Body() body) {
    if (!body.username) {
      throw new Error('Username is required');
    }
    if (typeof body.username !== 'string') {
      throw new Error('Username must be a string');
    }

    return this.appService.signIn(body.username);
  }

  @Get('feed')
  getFeed() {
    return this.appService.getFeed();
  }

  @Get('posts/tags/:tag')
  getPostsByTag(@Param('tag') tag: string) {
    return this.appService.getPostsByTag(tag);
  }

  @Get('postDetail/:postId')
  getPostDetail(@Param('postId') postId: number) {
    const post = this.appService.getPostDetail(postId);
    if (!post) {
      return {
        status: 'error',
        message: 'Post not found',
        data: null,
      };
    }
    return post;
  }

  @Post('posts')
  createPost(@Body() body: PostDto) {
    return this.appService.createPost(body);
  }

  @Patch('posts/:postId')
  editPost(
    @Param('postId') postId: number,
    @Body() body,
  ) {
    return this.appService.editPost(postId, body);
  }

  @Post('comments')
  commentOnPost(@Body() body) {
    return this.appService.commentOnPost(body);
  }

  @Patch('comments/:commentId')
  editComment(
    @Param('commentId') commentId: number,
    @Body() body,
  ) {
    return this.appService.editComment(commentId, body.author, body.content);
  }

  @Delete('posts/:postId')
  deletePost(@Param('postId') postId: number) {
    return this.appService.deletePost(postId);
  }

  @Delete('comments/:commentId')
  deleteComment(
    @Param('commentId') commentId: number,
    @Body() body
  ) {
    return this.appService.deleteComment(commentId, body);
  }

}
