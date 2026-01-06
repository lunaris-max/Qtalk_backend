import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as bcrypt from 'bcrypt';
import { MailType } from './mail.types';
import { verifyEmailTemplate } from './templates/verify-email.template';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('MAIL_HOST'),
      port: Number(this.config.get<string>('MAIL_PORT')),
      secure: false,
      auth: {
        user: this.config.get<string>('MAIL_USER'),
        pass: this.config.get<string>('MAIL_PASS'),
      },
    });
  }

  // =========================
  // PUBLIC API
  // =========================
  async send(type: MailType, payload: { email: string }) {
    switch (type) {
      case MailType.VERIFY_EMAIL:
        return this.sendVerifyEmail(payload.email);

      default:
        throw new BadRequestException('Unknown mail type');
    }
  }

  // =========================
  // SEND VERIFY EMAIL
  // =========================
  private async sendVerifyEmail(email: string) {
    const authMethod = await this.prisma.authMethod.findFirst({
      where: { email },
      include: { user: true },
    });

    if (!authMethod) {
      throw new BadRequestException('User with this email not found');
    }

    // invalidate previous codes
    await this.prisma.emailVerification.updateMany({
      where: {
        userId: authMethod.userId,
        email,
        usedAt: null,
      },
      data: {
        usedAt: new Date(),
      },
    });

    const code = this.generateCode();
    const codeHash = await bcrypt.hash(code, 10);

    await this.prisma.emailVerification.create({
      data: {
        userId: authMethod.userId,
        email,
        codeHash,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 хв
      },
    });

    const template = verifyEmailTemplate(code);

    await this.transporter.sendMail({
      from: this.config.get<string>('MAIL_FROM'),
      to: email,
      subject: template.subject,
      html: template.html,
    });

    return { success: true };
  }

  // =========================
  // VERIFY EMAIL CODE
  // =========================
  async verifyEmailCode(payload: { email: string; code: string }) {
    const authMethod = await this.prisma.authMethod.findFirst({
      where: { email: payload.email },
    });

    if (!authMethod) {
      throw new BadRequestException('Invalid email');
    }

    const record = await this.prisma.emailVerification.findFirst({
      where: {
        userId: authMethod.userId,
        email: payload.email,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) {
      throw new BadRequestException('Invalid or expired code');
    }

    const match = await bcrypt.compare(payload.code, record.codeHash);
    if (!match) {
      throw new BadRequestException('Invalid code');
    }

    await this.prisma.$transaction([
      this.prisma.emailVerification.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
      this.prisma.user.update({
        where: { id: authMethod.userId },
        data: {
          emailVerifiedAt: new Date(),
          identityVerifiedAt: new Date(),
        },
      }),
    ]);

    return { verified: true };
  }

  // =========================
  // HELPERS
  // =========================
  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
