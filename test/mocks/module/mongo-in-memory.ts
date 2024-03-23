import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer;

export const TestDbModule = MongooseModule.forRootAsync({
  useFactory: async () => {
    mongod = await MongoMemoryServer.create();
    const mongoUri = mongod.getUri();
    return {
      uri: mongoUri,
    };
  },
});

export const closeInMongodConnection = async () => {
  if (mongod) await mongod.stop();
};
