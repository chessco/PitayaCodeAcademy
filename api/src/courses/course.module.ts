import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';

import { ResourceController } from './resource.controller';
import { ResourceService } from './resource.service';

@Module({
    controllers: [CourseController, LessonController, ResourceController],
    providers: [CourseService, LessonService, ResourceService],
    exports: [CourseService, LessonService, ResourceService],
})
export class CourseModule { }
