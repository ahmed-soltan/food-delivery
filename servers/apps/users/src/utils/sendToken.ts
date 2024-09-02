import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

export class TokenSender {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwt: JwtService,
  ) {}

  public sendToken(user: User) {
    const payload = { userId: user.id };

    const accessToken = this.jwt.sign(payload, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      expiresIn: '5m',
    });

    const refreshToken = this.jwt.sign(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: '3d',
    });

    return { user, accessToken, refreshToken };
  }
}
