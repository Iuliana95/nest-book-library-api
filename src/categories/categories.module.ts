import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { EventEmitterModule } from "@nestjs/event-emitter";

@Module({
  imports: [EventEmitterModule.forRoot()],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [ CategoriesService ]
})
export class CategoriesModule {}
