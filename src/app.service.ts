import { Injectable } from '@nestjs/common';
import { PostDto, PostResponseDto } from './dto/post.dto';
import { UserDto } from './dto/user.dto';
import { CommentDto } from './dto/comment.dto';

@Injectable()
export class AppService {
  private users: UserDto[] = [];
  private posts: PostDto[] = [];
  private comments: CommentDto[] = [];
  private currentUser: UserDto;

  signIn(username: string): UserDto {
    const existingUser = this.users.find(u => {
      console.log('SignIn:', u.username, username);
      console.log('SignIn:', u.username === username);
      return (u.username === username)
    });
    let user
    if (!existingUser) {
      user = { id: this.users.length + 1, username }
      this.users.push(user);
      console.log('User created:', user, this.users);
    }
    if (existingUser) {
      user = existingUser
    }
    this.currentUser = user
    console.log('user', this.users)
    console.log('user created:', user);
    return user;
  }

  getPostDetail(postId: number): PostDto | null {
    const post = this.posts.find(p => p.id === postId);
    if (!post) {
      return null;
    }
    return post
  }


  createPost(post: PostDto): PostDto {
    const userExists = this.users.find(u => u.username === post.author);
    if (!userExists) {
      throw new Error('User does not exist.');
    }
    const maxId = this.posts.length > 0 ? Math.max(...this.posts.map(p => p.id)) : 0;
    post.id = maxId + 1;
    post.createdAt = new Date();
    post.updatedAt = new Date();
    this.posts.push(post);
    return post;
  }

  commentOnPost(comment: CommentDto): PostDto {
    if (!comment.author) {
      throw new Error('Comment author is undefined.');
    }
    const userExists = this.users.find(u => u.username === comment.author);
    const postExists = this.posts.find(p => p.id === comment.postId);
    console.log('post', this.posts)
    console.log('comment', comment)
    if (!userExists) {
      throw new Error('User does not exist.');
    }
    if (!postExists) {
      throw new Error('Post does not exist.');
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
    console.log('THIS.POSTS', this.posts)
    return this.posts[postIndex];
  }

  editComment(commentId: number, author: string, newContent: string): CommentDto {
    console.log(`Params: ${commentId}, ${author}, ${newContent}`);
    const user = this.users.find(u => u.username === author);
    if(!user) {
      throw new Error('User not found.');
    }
    const comment = this.comments.find(c => c.id === commentId && c.author === author);
    if (!comment) {
      throw new Error('Comment not found or you are not the userId.');
    }
    comment.content = newContent;
    comment.updatedAt = new Date();
    const index = this.comments.findIndex(c => c.id === commentId);
    if (index !== -1) {
      this.comments[index] = comment;
    }
    return comment;
  }

  getFeed(): PostResponseDto[] {
    return this.posts;
    // return this.posts.map(post => {
    //   const { userId, ...postToDisplay } = post;
    //   return {
    //     ...postToDisplay,
    //     author: this.users.find(u => u.id === post.userId)?.username || '',
    //   }
    // })
  }

  getUserProfile(id: number): { posts: PostDto[]; } {
    const userPosts = this.posts.filter(p => p.author === this.users.find(u => u.id === id)?.username);
    return { posts: userPosts };
  }

  getPostsByTag(tag: string): PostDto[] {
    return this.posts.filter(post => post.tag.includes(tag));
  }

  deletePost(postId: number): PostDto | null {
    const postIndex = this.posts.findIndex(p => p.id === postId);
    if (postIndex === -1) {
      throw new Error('Post not found.');
    }

    //Delete comments associated with the post
    this.comments = this.comments.filter(c => c.postId !== postId);
    //Delete post
    const deletedPost = this.posts[postIndex];
    this.posts.splice(postIndex, 1);


    return deletedPost;
  }

  deleteComment(commentId: number, body: any): CommentDto | null {
    const commentIndex = this.comments.findIndex(c => c.id === commentId);
    const user = this.users.find(u => u.username === body.author);
    if (!user) {
      throw new Error('You are not the author of this comment.');
    }
    if (commentIndex === -1) {
      throw new Error('Comment not found.');
    }
    const deletedComment = this.comments[commentIndex];
    //Delete comment
    this.comments.splice(commentIndex, 1);
    //Delete comment from post
    const postIndex = this.posts.findIndex(p => p.id === deletedComment.postId);
    if (postIndex !== -1) {
      this.posts[postIndex].comments = this.posts[postIndex].comments?.filter(c => c.id !== commentId) || [];
    }
    return deletedComment;
  }

  editPost(postId: number, body: PostDto): PostDto | null {
    const { author, title, content } = body;
    const user = this.users.find(u => u.username === author);
    const post = this.posts.find(p => p.id === postId && p.author === user?.username);
    if (!user) {
      throw new Error('User not found or you are not the writer.');
    }
    if (!post) {
      throw new Error('Post not found.');
    }
    post.title = title;
    post.content = content;
    post.tag = body.tag;
    post.updatedAt = new Date();
    const index = this.posts.findIndex(p => p.id === postId);
    if (index !== -1) {
      this.posts[index] = post;
    }
    return post;
  }

}
