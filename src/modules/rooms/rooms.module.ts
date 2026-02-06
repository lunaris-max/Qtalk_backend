import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { RoomsRepository } from './repository/rooms.repository';
import { CloudinaryModule } from '@src/infra/cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  controllers: [RoomsController],
  providers: [RoomsService, RoomsRepository],
})
export class RoomsModule {}
