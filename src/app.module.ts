import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/user.entity';
import { Pokemon } from './pokemons/entities/pokemon.entity';
import { PokemonsModule } from './pokemons/pokemons.module';
import { APP_PIPE } from '@nestjs/core';

import * as cookieSession from 'cookie-session';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Pokemon],
      synchronize: true,
    }),
    AuthModule,
    PokemonsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        validationError: { target: true, value: true },
      }),
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieSession({ keys: ['superSecretKey'] })).forRoutes('*');
  }
}
