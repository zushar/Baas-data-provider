import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserDocument, UserSchema } from '@/common/mongoose/schemas/user';
import {
  TestDbModule,
  closeInMongodConnection,
} from '@/../test/mocks/module/mongo-in-memory';
import { MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JWTModuleConfigured } from './auth.module';
import { TypedConfigModule, dotenvLoader } from 'nest-typed-config';
import { RootConfig, validate } from '@/config/env.validation';

describe('AuthService', () => {
  let service: AuthService;
  let userModel: Model<UserDocument>;
  const userCredentials = { username: 'test', password: 'test' };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
      imports: [
        TestDbModule,
        TypedConfigModule.forRoot({
          isGlobal: true,
          schema: RootConfig,
          validate,
          load: dotenvLoader({
            envFilePath: '.env.test.local',
          }),
        }),
        JWTModuleConfigured,
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
        // Include any setup for in-memory MongoDB here
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userModel = module.get<Model<UserDocument>>('UserModel');
  });

  afterAll(async () => {
    await userModel.deleteMany({});
    await closeInMongodConnection(); // Close the database connection after all tests
  });

  describe('sanity check', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
      expect(userModel).toBeDefined();
    });
  });

  // auth
  describe('service register and login', () => {
    it('should register a user', async () => {
      const newUser = {
        ...userCredentials,
        first_name: 'Test',
        last_name: 'User',
        role: {},
      };
      const id = await service.register(newUser);
      expect(id).toBeDefined();
    });

    it('should login a user', async () => {
      const response = await service.login(userCredentials);
      expect(response).toBeDefined();
      // expect the token to be defined
      expect(response?.token).toBeDefined();
      // loggeduser to match object
      if (!response?.user) throw new Error('User not found');
      const { first_name, last_name, username } = response.user;
      expect({ first_name, last_name, username }).toMatchObject({
        first_name: 'Test',
        last_name: 'User',
        username: 'test',
      });
    });
  });

  // update
  describe('service update', () => {
    it('should update a user', async () => {
      const newUser = {
        ...userCredentials,
        first_name: 'Test',
        last_name: 'User',
        role: {},
      };
      const id = await service.register(newUser);
      if (!id) {
        throw new Error('Failed to register user');
      }
      const updatedUser = await service.update(id.toString(), {
        first_name: 'Updated',
        last_name: 'User',
        role: 'admin',
      });
      expect(updatedUser).toBeDefined();
      expect(updatedUser).toMatchObject({
        first_name: 'Updated',
        last_name: 'User',
        role: 'admin',
      });
    });
  });

  // update roles
  describe('service update roles', () => {
    it('should update a user role', async () => {
      const newUser = {
        ...userCredentials,
        first_name: 'Test',
        last_name: 'User',
        role: {},
      };
      const id = await service.register(newUser);
      if (!id) {
        throw new Error('Failed to register user');
      }
      const updatedUser = await service.updateRole(id.toString(), {
        USERS: true,
      });
      expect(updatedUser).toBeDefined();
      expect(updatedUser).toMatchObject({
        username: userCredentials.username,
        first_name: 'Test',
        last_name: 'User',
        role: { USERS: true },
      });
    });
  });
});
