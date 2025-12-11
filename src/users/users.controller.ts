import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { routesV1 } from 'src/config/app.routes';

@Controller(routesV1.version)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post(routesV1.user.root)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(routesV1.user.root)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(routesV1.user.findOne)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(routesV1.user.update)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(routesV1.user.delete)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
