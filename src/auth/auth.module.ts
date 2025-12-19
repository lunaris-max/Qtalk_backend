import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { TokensService } from 'src/utils/tokens/token.service';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService, TokensService],
})
export class AuthModule {}
