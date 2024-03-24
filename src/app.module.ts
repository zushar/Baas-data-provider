import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypedConfigModule, dotenvLoader } from 'nest-typed-config';
import { RootConfig, validate } from './config/env.validation';
import { MongooseModule } from '@nestjs/mongoose';
import { MembersModule } from './members/members.module';
import { GithubGqlModule } from './github-gql/github-gql.module';

@Module({
  imports: [
    TypedConfigModule.forRoot({
      isGlobal: true,
      schema: RootConfig,
      validate,
      load: dotenvLoader({
        envFilePath: '.env.development.local',
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [TypedConfigModule],
      useFactory: async (config: RootConfig) => {
        const connection = `mongodb://${config.MONGO_USER}:${config.MONGO_PASS}@${config.MONGO_HOST}:${config.MONGO_PORT}/${config.MONGO_DB}`;
        return {
          connectionFactory: (connection) => {
            if (connection.readyState === 1) {
              Logger.log('Database Connected successfully');
            }
            connection.on('disconnected', () => {
              Logger.log('Database disconnected');
            });
            connection.on('error', (error) => {
              Logger.log('Database connection failed! for error: ', error);
            });

            return connection;
          },
          uri: connection,
        };
      },
      inject: [RootConfig],
    }),
    MembersModule,
    GithubGqlModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
