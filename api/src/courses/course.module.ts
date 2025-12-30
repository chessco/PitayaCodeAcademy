import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';

@Module({
    controllers: [CourseController, LessonController],
    providers: [CourseService, LessonService],
    exports: [CourseService, LessonService],
})
export class CourseModule { }
