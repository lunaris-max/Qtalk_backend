import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokensService } from './token.service';

@Module({
  imports: [JwtModule.register({})],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}
