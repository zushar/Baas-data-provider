import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@/common/mongoose/schemas/user';
import { JwtModule } from '@nestjs/jwt';
import { TypedConfigModule } from 'nest-typed-config';
import { RootConfig } from '@/config/env.validation';

export const JWTModuleConfigured = JwtModule.registerAsync({
  imports: [TypedConfigModule],
  useFactory: async (rootConfig: RootConfig) => ({
    secret: rootConfig.JWT_SECRET,
  }),
  inject: [RootConfig],
});
@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JWTModuleConfigured,
  ],
})
export class AuthModule {}
