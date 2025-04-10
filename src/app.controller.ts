import { Controller, Get, Param, Body, Post, Patch } from '@nestjs/common';
import { AppService } from './app.service';
import { PostDto } from './dto/post.dto';
import { UserDto } from './dto/user.dto';
import { CommentDto } from './dto/comment.dto';

@Controller()
export class AppController {

  constructor(private readonly appService: AppService) {}
  @Get()
  getHello(): string {
    return 'Hello World!';
  }

  @Post('signin')
  signIn(@Body() body) {
    console.log('body', body);
    if (!body.username) {
      throw new Error('Username is required');
    }
    if (typeof body.username !== 'string') {
      throw new Error('Username must be a string');
    }

    return this.appService.signIn(body.username);
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

  @Post('comments')
  commentOnPost(@Body() body) {
    console.log('body', body);
    return this.appService.commentOnPost(body);
  }

  @Patch('comments/:commentId')
  editComment(
    @Param('commentId') commentId: number,
    @Body() body: { userId: number; content: string },
  ) {
    return this.appService.editComment(commentId, body.userId, body.content);
  }

  @Get('feed')
  getFeed() {
    return this.appService.getFeed();
  }

  @Get('profile/:userId')
  getUserProfile(@Param('userId') userId: number) {
    return this.appService.getUserProfile(userId);
  }
  @Get('posts/tags/:tag')
  getPostsByTag(@Param('tag') tag: string) {
    return this.appService.getPostsByTag(tag);
  }

}
