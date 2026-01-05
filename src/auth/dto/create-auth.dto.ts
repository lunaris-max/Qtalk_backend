import { AccountStatus, Gender } from '@prisma/client';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsEnum,
  MinLength,
  MaxLength,
  IsNumber,
} from 'class-validator';

export class CreateAuthDto {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsString()
  login: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  firstName?: string;

  @IsOptional()
  @IsString()
  LastName?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  profileTheme?: string;

  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsEnum(AccountStatus)
  accountStatus?: AccountStatus;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;
}
