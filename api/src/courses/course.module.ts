import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';

import { ResourceController } from './resource.controller';
import { ResourceService } from './resource.service';
import { ModuleController } from './modules/module.controller';
import { ModuleService } from './modules/module.service';

@Module({
    controllers: [CourseController, LessonController, ResourceController, ModuleController],
    providers: [CourseService, LessonService, ResourceService, ModuleService],
    exports: [CourseService, LessonService, ResourceService, ModuleService],
})
export class CourseModule { }

