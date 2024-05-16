import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CrudUserRole, IUser } from '@/types/user';

export class UserDTO implements IUser {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsObject()
  @ValidateNested()
  role: CrudUserRole;

  @IsOptional()
  @IsString()
  password: string;
}

export class UpdateUserDTO implements Partial<IUser> {
  @IsOptional()
  @IsString()
  _id: string;

  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  first_name: string;

  @IsOptional()
  @IsString()
  last_name: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  role: CrudUserRole;

  @IsOptional()
  @IsString()
  password: string;
}

export class UserLoginDTO implements Pick<IUser, 'password' | 'username'> {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class UserRegisterDTO implements Omit<IUser, 'role' | 'prototype'> {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsOptional()
  @IsString()
  password: string;
}
