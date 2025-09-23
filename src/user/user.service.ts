import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('NOTIFICATIONS_SERVICE')
    private readonly notificationsService: ClientProxy,
    @Inject('TASKS_SERVICE') private readonly tasksService: ClientProxy,
  ) {}

  async createUser(signupDto: { email: string; password: string }) {
    const emailExists = await this.prisma.users.findUnique({
      where: { email: signupDto.email },
    });
    if (emailExists) {
      throw new ConflictException('Email already exists');
    }
    const password = await argon.hash(signupDto.password);
    const user = await this.prisma.users.create({
      data: { ...signupDto, password },
    });
    this.notificationsService.emit('user.create', {
      id: user.id,
      email: user.email,
    });
    this.tasksService.emit('user.create', {
      id: user.id,
      email: user.email,
    });
    return user;
  }
}
