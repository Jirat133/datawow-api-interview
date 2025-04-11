import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommentDto } from './dto/comment.dto';
import { PostDto } from './dto/post.dto';
import { UserDto } from './dto/user.dto';
import { Response } from './dto/response.dto';
import { title } from 'process';
import { create } from 'domain';

describe('AppController', () => {
  let appController: AppController; // Removed duplicate declaration
  const toDay = new Date('2023-01-01T00:00:00Z'); // Mock consistent date for tests
  const mockPost: PostDto = {
    id: 1,
    title: 'Post 1',
    content: 'Post content',
    tag: 'Exercise',
    author: 'John Doe',
    createdAt: new Date(),
    updatedAt: new Date(),
    comments: [],
  }

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });
  describe('AppController', () => {
    let appController: AppController;
    let appService: AppService;

    beforeEach(async () => {
      const app: TestingModule = await Test.createTestingModule({
        controllers: [AppController],
        providers: [AppService],
      }).compile();

      appController = app.get<AppController>(AppController);
      appService = app.get<AppService>(AppService);
    });

    describe('getHello', () => {
      it('should return "Hello World!"', () => {
        expect(appController.getHello()).toBe('Hello World!');
      });
    });

    describe('signIn', () => {
      it('should throw an error if username is not provided', () => {
        expect(() => appController.signIn({})).toThrow('Username is required');
      });

      it('should throw an error if username is not a string', () => {
        expect(() => appController.signIn({ username: 123 })).toThrow('Username must be a string');
      });

      it('should return a user object when a valid username is provided', () => {
        const mockUser: UserDto = { id: 1, username: 'John Doe' };
        const signInSpy = jest.spyOn(appService, 'signIn').mockReturnValue(mockUser);
        expect(appController.signIn({ username: 'John Doe' })).toEqual(mockUser);
        expect(signInSpy).toHaveBeenCalledWith('John Doe');
      }
      );
    });

    describe('createPost', () => {
      it('should call appService.createPost with the correct data', async () => {
        // Mock the signIn method to simulate a user being signed in
        const mockUser: UserDto = { id: 1, username: 'John Doe' };
        appService.signIn(mockUser.username); // Removed unnecessary await
        const createPost = appService.createPost(mockPost); // Removed unnecessary await
        expect(createPost).toEqual({
          statusCode: 201,
          message: 'Post created successfully',
          data: mockPost,
        });
      });
    });

    describe('getFeed', () => {
      it('should return the feed from appService', () => {
        const feed = [mockPost];
        jest.spyOn(appService, 'getFeed').mockReturnValue(feed);
        expect(appController.getFeed()).toBe(feed);
      });
    });

    describe('getPostsByTag', () => {
      it('should return posts by tag from appService', async () => {
        // Mock the signIn method to simulate a user being signed in
        const mockUser: UserDto = { id: 1, username: 'John Doe' };
        await appService.signIn(mockUser.username);
        await appService.createPost(mockPost);
        expect(appController.getPostsByTag('Exercise')).toEqual([mockPost]);
        expect(appController.getPostsByTag('xDxD')).toEqual([]);

      });
    });

    describe('getPostDetail', () => {

      it('should return post details if post exists', async () => {
        const mockUser: UserDto = { id: 1, username: 'John Doe' };
        await appService.signIn(mockUser.username);
        await appService.createPost(mockPost);
        expect(appController.getPostDetail(1)).toBe(mockPost);
      });

      it('should return an error response if post does not exist', async () => {
        const mockUser: UserDto = { id: 1, username: 'John Doe' };
        await appService.signIn(mockUser.username);
        await appService.createPost(mockPost);
        expect(appController.getPostDetail(2)).toEqual({ data: null, message: "Post not found", status: "error" });
      });
    });



    describe('commentOnPost', () => {
      it('should call appService.commentOnPost with the correct data', async () => {
        //Mock signIn and create post
        const mockUser: UserDto = { id: 1, username: 'John Doe' };
        await appService.signIn(mockUser.username);
        await appService.createPost(mockPost);

        const commentDto = { postId: 1, content: 'Nice post!', author: 'John Doe' };
        const mockPostWithComment = {
          ...mockPost,
          comments: [
            {
              id: 1,
              postId: 1,
              content: 'Nice post!',
              author: 'John Doe',
              createdAt: expect.any(Date), // Use expect.any(Date) to match any Date object
              updatedAt: expect.any(Date), // Use expect.any(Date) to match any Date object
            },
          ],
        };
        const result = appController.commentOnPost(commentDto);
        expect(result).toEqual({
          statusCode: 201,
          message: 'Comment added successfully',
          data: {
            ...mockPost,
            comments: [
              {
                id: 1,
                postId: 1,
                content: 'Nice post!',
                author: 'John Doe',
                createdAt: expect.any(Date), // Match any Date object
                updatedAt: expect.any(Date), // Match any Date object
              },
            ],
          }

        });
        expect(result.data.comments[0].createdAt).toBeInstanceOf(Date);
        expect(result.data.comments[0].updatedAt).toBeInstanceOf(Date);
      });
    });

      describe('editComment', () => {
        it('should call appService.editComment with the correct data', async () => {
          const mockUser: UserDto = { id: 1, username: 'John Doe' };
          await appService.signIn(mockUser.username);
          await appService.createPost(mockPost);
          const commentDto = { postId: 1, content: 'Nice post!', author: 'John Doe' };
          await appController.commentOnPost(commentDto);
          const updatedCommentDto = { content: 'Updated comment!', author: 'John Doe' };
          expect(appController.editComment(1, updatedCommentDto)).toEqual({
              statusCode: 200,
              message: 'Comment updated successfully',
              data: {
                ...updatedCommentDto,
                id: 1,
                postId: 1,
                createdAt: expect.any(Date), // Match any Date object
                updatedAt: expect.any(Date), // Match any Date object
              },
          });
        });
      });

      describe('deletePost', () => {
        it('should call appService.deletePost with the correct postId', async () => {
          const mockUser: UserDto = { id: 1, username: 'John Doe' };
          await appService.signIn(mockUser.username);
          await appService.createPost(mockPost);
          const postId = 1;
          expect(appController.deletePost(postId)).toEqual({
            statusCode: 200,
            message: 'Post deleted successfully',
            data: mockPost,
          });
        });
      });

      describe('deleteComment', () => {
        it('should call appService.deletePost with the correct postId', async () => {
          const mockUser: UserDto = { id: 1, username: 'John Doe' };
          await appService.signIn(mockUser.username);
          await appService.createPost(mockPost);
          const commentDto = { postId: 1, content: 'Nice post!', author: 'John Doe' };
          const createdComment = await appController.commentOnPost(commentDto);
          const commentId = 1;
          console.log(createdComment.data.comments[0]);
          expect(appController.deleteComment(commentId, commentDto)).toEqual({
            statusCode: 200,
            message: 'Comment deleted successfully',
            data: {
              ...commentDto,
              id: 1,
              createdAt: expect.any(Date), // Match any Date object
              updatedAt: expect.any(Date), // Match any Date object
            },
          });
        });
      });

      describe('editPost', () => {
        it('should call appService.editPost with the correct data', async () => {
          const mockUser: UserDto = { id: 1, username: 'John Doe' };
          await appService.signIn(mockUser.username);
          await appService.createPost(mockPost);
          const updatedPostDto = { title: 'Updated Post', content: 'Updated content', tag: 'Updated Tag', author: 'John Doe' };
          expect(appController.editPost(1, updatedPostDto)).toEqual({
            statusCode: 200,
            message: 'Post updated successfully',
            data: {
              ...updatedPostDto,
              id: 1,
              createdAt: expect.any(Date), // Match any Date object
              updatedAt: expect.any(Date), // Match any Date object
              comments: [],
            },
          });
        });
      });
  });


});
