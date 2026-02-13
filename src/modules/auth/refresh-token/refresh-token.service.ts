import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';

import { RefreshToken, RefreshTokenDocument } from './refresh-token.schema';
import { jwtConfig } from '@src/config';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectModel(RefreshToken.name)
    private readonly model: Model<RefreshTokenDocument>,
    private readonly jwtService: JwtService,
  ) {}

  private readonly MAX_TOKENS = 5;

  async createRefreshToken(userId: string): Promise<string> {
    const rawToken = randomBytes(64).toString('hex');
    const tokenId = randomUUID();
    const hash = await bcrypt.hash(rawToken, 10);

    const count = await this.model.countDocuments({ userId });

    if (count >= this.MAX_TOKENS) {
      const oldest = await this.model.findOne({ userId }).sort({ createdAt: 1 });

      if (oldest) {
        await this.model.deleteOne({ _id: oldest._id });
      }
    }

    await this.model.create({
      userId,
      tokenId,
      tokenHash: hash,
    });

    return this.jwtService.sign(
      {
        sub: userId,
        tid: tokenId,
        rt: rawToken,
      },
      {
        secret: jwtConfig.secret,
        expiresIn: jwtConfig.refreshExpiresIn,
      },
    );
  }

  async validate(refreshJwt: string): Promise<string> {
    const payload = this.jwtService.verify(refreshJwt, {
      secret: jwtConfig.secret,
    });

    const record = await this.model.findOne({
      tokenId: payload.tid,
      userId: payload.sub,
    });

    if (!record) throw new UnauthorizedException('Invalid refresh token');

    const isMatch = await bcrypt.compare(payload.rt, record.tokenHash);

    if (!isMatch) throw new UnauthorizedException('Invalid refresh token');

    return payload.sub;
  }

  async rotate(refreshJwt: string): Promise<string> {
    const payload = this.jwtService.verify(refreshJwt, {
      secret: jwtConfig.secret,
    });

    await this.validate(refreshJwt);

    await this.model.deleteOne({ tokenId: payload.tid });

    return this.createRefreshToken(payload.sub);
  }

  async revokeAll(userId: string): Promise<void> {
    await this.model.deleteMany({ userId });
  }
}
