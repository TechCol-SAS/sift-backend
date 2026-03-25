import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  @ApiProperty()
  email: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  isActive: boolean;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(16)
  @ApiProperty()
  password: string;
}
