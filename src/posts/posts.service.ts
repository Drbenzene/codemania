/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) { }

  async create(createPostDto: CreatePostDto): Promise<any> {

    const { title, content, authorId } = createPostDto

    if (!title || !content || !authorId) {
      throw new HttpException('Ensure all fields are Provided', HttpStatus.BAD_REQUEST)
    }

    const post = await this.prisma.post.create({
      data: {
        ...createPostDto
      }
    })

    return {
      status: "Success",
      post: post
    }
  }

  async findAll(): Promise<any> {
    try {
      const posts = this.prisma.post.findMany()
      return {
        status: "Success",
        posts: posts
      }
    }
    catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }


  }

  //Find A Post

  async findOne(id: string): Promise<any> {

    const post = await this.prisma.post.findUnique({
      where: {
        id: String(id)
      }
    })

    if (!post) {
      throw new HttpException('Post Not Found', HttpStatus.NOT_FOUND)
    }

    return {
      status: "Success",
      post: post
    }
  }

  //Update Post In Database

  update(id: string, updatePostDto: UpdatePostDto): Promise<any> {
    const { title, content } = updatePostDto

    if (!id || !title || !content) {
      throw new HttpException('Ensure all fields are Provided', HttpStatus.BAD_REQUEST)
    }

    //Check if the post ID Exists 

    const post = this.prisma.post.findUnique({
      where: {
        id: String(id)
      }
    })

    if (!post) {
      throw new HttpException('Post Not Found', HttpStatus.NOT_FOUND)
    }


    return this.prisma.post.update({
      where: {
        id: String(id)
      },
      data: {
        ...updatePostDto
      }
    })


  }

  async remove(id: string): Promise<any> {
    await this.prisma.post.delete({
      where: {
        id: String(id)
      }
    })

    return {
      status: "Success",
      message: 'Post Deleted Successfully'
    }
  }

  // Like A Post 
  async likePost(id: string): Promise<any> {

    if (!id) {
      throw new HttpException('Ensure you provide the post ID', HttpStatus.BAD_REQUEST)
    }

    const post = await this.prisma.post.findUnique({
      where: {
        id: String(id)
      }
    })

    if (!post) {
      throw new HttpException('Post Not Found', HttpStatus.NOT_FOUND)
    }

    let count = post.likes
    count++


    return this.prisma.post.update({
      where: {
        id: String(id)
      },
      data: {
        likes: count
      }
    })
  }

  //Unlike a Post 
  async unlikePost(id: string): Promise<any> {

    if (!id) {
      throw new HttpException('Ensure you provide the post ID', HttpStatus.BAD_REQUEST)
    }

    const post = await this.prisma.post.findUnique({
      where: {
        id: String(id)
      }
    })

    if (!post) {
      throw new HttpException('Post Not Found', HttpStatus.NOT_FOUND)
    }

    let count = post.likes

    if (count === 0) {
      throw new HttpException('Post has no likes', HttpStatus.BAD_REQUEST)
    }

    count--

    //If found, Update Post

    await this.prisma.post.update({
      where: {
        id: String(id)
      },
      data: {
        likes: count
      }
    })

    return {
      status: "Success",
      post: post
    }
  }
}


