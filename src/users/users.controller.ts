/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch
} from '@nestjs/common';;
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,
    private readonly prisma: PrismaService,

  ) { }

  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.usersService.create(userDto);
  }

  @Get('posts/:id')
  findPosts(@Param() id: string) {
    return this.usersService.findPosts(id);
  }

  @Patch('follow/:id')
  follow(@Param() id: string) {
    return this.usersService.follow(id);
  }
}