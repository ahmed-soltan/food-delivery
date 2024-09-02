import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context);
    const { req } = gqlContext.getContext();

    const accessToken = req.headers.accesstoken as string;
    const refreshToken = req.headers.refreshtoken as string;

    if (!accessToken || !refreshToken) {
      throw new UnauthorizedException('Please login to access this resource!');
    }

    try {
      // Attempt to verify the access token
      this.jwtService.verify(accessToken, {
        secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
      });
      // If verification succeeds, proceed
      return true;
    } catch (err) {
      // If access token is expired, handle it
      if (err.name === 'TokenExpiredError') {
        return await this.handleExpiredAccessToken(req);
      } else {
        throw new UnauthorizedException('Invalid access token.');
      }
    }
  }

  private async handleExpiredAccessToken(req: any): Promise<boolean> {
    try {
      const refreshToken = req.headers.refreshtoken as string;

      const decoded = this.jwtService.verify(refreshToken, {
        secret: this.config.get<string>('REFRESH_TOKEN_SECRET'),
      });

      const expirationTime = decoded.exp * 1000;
      if (expirationTime < Date.now()) {
        throw new UnauthorizedException('Refresh token has expired.');
      }

      const user = await this.prisma.user.findFirst({
        where: {
          id: decoded.id,
        },
      });

      if (!user) {
        throw new UnauthorizedException('User not found.');
      }

      const newAccessToken = this.jwtService.sign(
        { id: user.id },
        {
          secret: this.config.get<string>('ACCESS_TOKEN_SECRET'),
          expiresIn: '5m',
        },
      );

      req.headers.accesstoken = newAccessToken;
      req.user = user;

      return true;
    } catch (error) {
      throw new UnauthorizedException('Unable to refresh access token.');
    }
  }
}
