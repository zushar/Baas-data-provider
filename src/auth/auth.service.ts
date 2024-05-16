import { UserDocument } from '@/common/mongoose/schemas/user';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { compareStringToHash, hashString } from '@/utils/bcrypt';
import { IUser, CrudUserRole } from '@/types/user';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}
  async login({ username, password }: { username: string; password: string }) {
    try {
      const user = await this.userModel.findOne({ username });
      if (!user) {
        return null;
      }
      if (!compareStringToHash(password, user.password)) {
        return null;
      }
      const result = this.sanitizeUser(user);
      const token = await this.jwtService.signAsync(result); //jwt expecting plain obj
      return {
        user: result,
        token,
      };
    } catch (error) {
      Logger.error('Error logging in', error);
      return null;
    }
  }

  async register(user: Omit<IUser, 'role'>) {
    try {
      (user as IUser).role = {};
      user.password = await hashString(user.password);
      const newUser = new this.userModel(user);
      await newUser.save();
      const result = newUser;

      return result._id;
    } catch (error) {
      Logger.error('Error registering user', error);
    }
  }

  private sanitizeUser(user: UserDocument) {
    const rest = user.toJSON() as Partial<UserDocument>; //for testing jwt and etc
    delete rest.password;
    return rest;
  }

  async update(id: string, user: Partial<IUser>) {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(id, user, {
        new: true,
      });
      if (!updatedUser) {
        return null;
      }
      return this.sanitizeUser(updatedUser);
    } catch (error) {
      Logger.error('Error updating user', error);
    }
  }

  // update roles
  async updateRole(id: string, role: CrudUserRole) {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(
        id,
        { role },
        { new: true },
      );
      if (!updatedUser) {
        return null;
      }
      return this.sanitizeUser(updatedUser);
    } catch (error) {
      Logger.error('Error updating user role', error);
      return null;
    }
  }
}
