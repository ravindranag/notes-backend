import { Module } from '@nestjs/common';
import { UserService } from './user.service';
// import { DbModule } from 'src/db/db.module';
import { UserController } from './user.controller';
import { DbModule } from '../db/db.module';

@Module({
  providers: [UserService],
  exports: [UserService],
  imports: [DbModule],
  controllers: [UserController]
})
export class UserModule {}
