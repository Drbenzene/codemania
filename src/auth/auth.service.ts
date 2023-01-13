/* eslint-disable prettier/prettier */
import { LoginUserDto } from './../users/dto/create-user.dto';
import { JwtPayload } from "./jwt.strategy";
import { UsersService } from "../users/users.service";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService

    ) { }

    async login(LoginUserDtO: LoginUserDto) {
        const { email, password } = LoginUserDtO

        if (!email || !password) {
            throw new HttpException("INVALID_CREDENTIALS",
                HttpStatus.UNAUTHORIZED);
        }

        const user = await this.usersService.findByLogin(LoginUserDtO);
        if (!user) {
            throw new HttpException("INVALID_CREDENTIALS",
                HttpStatus.UNAUTHORIZED);
        }
        const token = this._createToken(user)
        return {
            ...user,
            token
        }
    }


    private _createToken({ login }): any {
        const user: JwtPayload = { login };
        const Authorization = this.jwtService.sign(user);
        return Authorization
    }

    async validateUser(payload: JwtPayload): Promise<any> {
        const user = await this.usersService.findByPayload(payload);
        if (!user) {
            throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
        }
        return user;
    }
}


