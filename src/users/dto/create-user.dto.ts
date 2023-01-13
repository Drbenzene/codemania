/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, } from 'class-validator';

export class CreateUserDto {


    @ApiProperty()
    @IsNotEmpty() name: string;

    @ApiProperty()
    @IsNotEmpty() email: string;

    @ApiProperty()
    @IsNotEmpty() password: string;


}

export class LoginUserDto {
    @ApiProperty()
    @IsNotEmpty() readonly email: string;

    @ApiProperty()
    @IsNotEmpty() readonly password: string;
}
