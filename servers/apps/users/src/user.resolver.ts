import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Response } from 'express';
import { BadRequestException, UseGuards } from '@nestjs/common';

import {
  ActivationResponse,
  ForgotPasswordResponse,
  LoginResponse,
  LogoutResponse,
  RegisterResponse,
  ResetPasswordResponse
} from './types/user.types';
import { UsersService } from './users.service';
import {
  RegisterDto,
  ActivationDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto
} from './dto/user.dto';
import { User } from './entities/user.entity';
import { AuthGuard } from './guards/auth.guard';

@Resolver('User')
export class UserResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => RegisterResponse)
  async register(
    @Args('registerDto') registerDto: RegisterDto,
    @Context() context: { res: Response },
  ): Promise<RegisterResponse> {
    if (!registerDto.name || !registerDto.email || !registerDto.password) {
      throw new BadRequestException('Please Fill All Fields');
    }

    const { activation_token } = await this.usersService.register(
      registerDto,
      context.res,
    );

    return { activation_token };
  }

  @Mutation(() => ForgotPasswordResponse)
  async forgotPassword(
    @Args('forgotPasswordDto') forgotPasswordDto: ForgotPasswordDto,
    @Context() context: { response: Response },
  ): Promise<ForgotPasswordResponse> {
    return await this.usersService.forgotPassword(forgotPasswordDto);
  }

  @Mutation(() => ResetPasswordResponse)
  async resetPassword(
    @Args('resetPasswordDto') resetPasswordDto: ResetPasswordDto,
  ): Promise<ResetPasswordResponse> {
    return await this.usersService.resetPassword(resetPasswordDto);
  }

  @Mutation(() => ActivationResponse)
  async activateUser(
    @Args('activationDto') activationDto: ActivationDto,
    @Context() context: { res: Response },
  ): Promise<ActivationResponse> {
    if (!activationDto.activationCode || !activationDto.activationToken) {
      throw new BadRequestException('Please Fill All Fields');
    }

    const { user, response } = await this.usersService.activateUser(
      activationDto,
      context.res,
    );

    return { user };
  }

  @Mutation(() => LoginResponse)
  async login(
    @Args('loginDto') loginDto: LoginDto,
    @Context() context: { res: Response },
  ): Promise<LoginResponse> {
    if (!loginDto.email || !loginDto.password) {
      throw new BadRequestException('Please Fill All Fields');
    }

    const { user, refreshToken, accessToken } =
      await this.usersService.Login(loginDto);

    return { user, refreshToken, accessToken };
  }

  @Query(() => LoginResponse)
  @UseGuards(AuthGuard)
  async getLoginInUser(@Context() context: { req: Request }) {
    return await this.usersService.getLoggedInUser(context.req);
  }

  @Mutation(() => LogoutResponse)
  async logOutUser(@Context() context: { req: Request }) {
    return await this.usersService.Logout(context.req);
  }

  @Query(() => [User])
  async getUsers() {
    const user = await this.usersService.getUsers();

    return { user };
  }
}
