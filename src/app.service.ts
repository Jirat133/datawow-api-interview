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
    console.log('post', post);
    console.log(this.users)
    const userExists = this.users.find(u => u.username === post.author);
    if (!userExists) {
      throw new Error('User does not exist.');
    }
    post.id = this.posts.length + 1;
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
    comment.id = this.comments.length + 1;
    this.comments.push(comment);
    const postIndex = this.posts.findIndex(p => p.id === comment.postId);

    if (!this.posts[postIndex].comments) {
      this.posts[postIndex].comments = [];
    }
    this.posts[postIndex].comments.push(comment);
    console.log('THIS.POSTS', this.posts)
    return this.posts[postIndex];
  }

  editComment(commentId: number, userId: number, newContent: string): string {
    const user = this.users.find(u => u.id === userId);
    const comment = this.comments.find(c => c.id === commentId && c.author === user?.username);
    if (!comment) {
      throw new Error('Comment not found or you are not the userId.');
    }
    comment.content = newContent;
    comment.updatedAt = new Date();
    const index = this.comments.findIndex(c => c.id === commentId);
    if (index !== -1) {
      this.comments[index] = comment;
    }
    return `Comment updated successfully.`;
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
    return this.posts.filter(post => post.tags.includes(tag));
  }

  deletePost(postId: number): PostDto | null {
    const postIndex = this.posts.findIndex(p => p.id === postId);
    if (postIndex === -1) {
      throw new Error('Post not found.');
    }
    const deletedPost = this.posts[postIndex];
    this.posts.splice(postIndex, 1);
    return deletedPost;
  }
 
}
