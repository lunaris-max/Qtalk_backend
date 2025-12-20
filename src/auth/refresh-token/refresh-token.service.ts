import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { RefreshToken, RefreshTokenDocument } from './refresh-token.schema';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectModel(RefreshToken.name)
    private readonly model: Model<RefreshTokenDocument>,
  ) {}

  generate(): string {
    return randomBytes(64).toString('hex');
  }

  async save(userId: number, token: string): Promise<void> {
    const hash = await bcrypt.hash(token, 10);

    await this.model.create({
      userId,
      tokenHash: hash,
    });
  }
}
