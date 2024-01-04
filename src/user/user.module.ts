import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { DbModule } from 'src/db/db.module';

@Module({
  providers: [UserService],
  exports: [UserService],
  imports: [DbModule]
})
export class UserModule {}
