/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { compare, hash } from 'bcrypt'
import { User, Post } from '@prisma/client';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  //use by auth module to register A New user

  async create(userDto: CreateUserDto): Promise<any> {

    if (!userDto.name || !userDto.email || !userDto.password) {
      throw new HttpException('User Details Not Provided', HttpStatus.BAD_REQUEST)
    }

    //Check If User Already Exist In  Database

    const userExist = await this.prisma.user.findFirst({
      where: {
        email: userDto.email
      }
    })

    if (userExist) {
      throw new HttpException('User Already Exist', HttpStatus.CONFLICT)
    }

    const saltOrRounds = 10;
    const password = userDto.password;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    userDto.password = hashedPassword;

    return await this.prisma.user.create({
      data: {
        ...userDto,
      }
    });
  }

  async findByLogin({ email, password }: LoginUserDto):
    Promise<any> {

    if (!email || !password) {
      throw new HttpException("Email or password is not provided",
        HttpStatus.UNAUTHORIZED);
    }

    //Find the user with email if the user exists

    const user = await this.prisma.user.findFirst({
      where: {
        email: email
      }
    });

    if (!user) {
      throw new HttpException("invalid login credentials",
        HttpStatus.UNAUTHORIZED);
    }

    // compare passwords
    const areEqual = await compare(password, user.password);

    if (!areEqual) {
      throw new HttpException("invalid_credentials",
        HttpStatus.UNAUTHORIZED);
    }

    const { password: pass, ...rest } = user;
    return rest;
  }

  async findByPayload({ email }: any): Promise<any> {
    return await this.prisma.user.findFirst({
      where: {
        email: email
      }
    });
  }

  async findPosts(id: string): Promise<any> {
    if (!id) {
      throw new HttpException('User Id Not Provided', HttpStatus.BAD_REQUEST)
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: String(id)
      }
    })

    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND)
    }

    // const posts = await this.prisma.post.findMany({
    //   where: {
    //     authorId: String(id)
    //   }
    // })

    return {
      status: "Success",
      posts: 'posts'
    }

  }

  async follow(id: string): Promise<any> {
    if (!id) {
      throw new HttpException('User Id Not Provided', HttpStatus.BAD_REQUEST)
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: String(id)
      }
    })

    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND)
    }

    let followers = user.followers
    followers++

    await this.prisma.user.update({
      where: {
        id: String(id)
      },
      data: {
        followers: followers
      }
    })

    return {
      status: "Success",
      message: 'User Followed'
    }

  }

  async unfollow(id: string): Promise<any> {
    if (!id) {
      throw new HttpException('User Id Not Provided', HttpStatus.BAD_REQUEST)
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: String(id)
      }
    })

    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND)
    }

    let followers = user.followers
    followers--

    await this.prisma.user.update({
      where: {
        id: String(id)
      },
      data: {
        followers: followers
      }
    })

    return {
      status: "Success",
      message: 'User Unfollowed'
    }
  }
}
