import { Module } from '@nestjs/common';

import { CloudinaryModule } from '@src/infra/cloudinary/cloudinary.module';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { MediaRepository } from './repository/media.repository';

@Module({
  imports: [CloudinaryModule],
  controllers: [MediaController],
  providers: [MediaService, MediaRepository],
  exports: [MediaRepository],
})
export class MediaModule {}
