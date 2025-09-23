import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/config/app.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService<AppConfig>,
  ) {}

  async login({ email, password }: { email: string; password: string }) {
    const user = await this.prisma.users.findUnique({
      where: { email },
      select: {
        password: true,
        id: true,
        email: true,
      },
    });

    if (!user) {
      throw new ForbiddenException('Bad credentials');
    }
    const passwordsMatch = await argon.verify(user.password, password);
    if (!passwordsMatch) {
      throw new ForbiddenException('Bad credentials');
    }
    const accessToken = await this.signToken(user);
    return { token: accessToken };
  }

  async register(signupDto: { email: string; password: string }) {
    const user = await this.userService.createUser(signupDto);
    const accessToken = await this.signToken(user);
    return { token: accessToken };
  }

  async signToken(user: { id: string; email: string }) {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '6h',
      secret: this.configService.get<string>('jwtAccessSecret'),
    });

    return accessToken;
  }
}
