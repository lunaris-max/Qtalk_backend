import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { routesV1 } from 'src/config/app.routes';

@Controller(routesV1.version)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(routesV1.auth.root)
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Get(routesV1.auth.root)
  findAll() {
    return this.authService.findAll();
  }

  @Get(routesV1.auth.findOne)
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(routesV1.auth.update)
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(routesV1.auth.delete)
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
