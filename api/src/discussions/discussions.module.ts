import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { DiscussionsController } from './discussions.controller';
import { DiscussionsService } from './discussions.service';
import { TenantModule } from '../tenants/tenant.module';
import { CommonModule } from '../common/common.module';

@Module({
    imports: [PrismaModule, TenantModule, CommonModule],
    controllers: [DiscussionsController],
    providers: [DiscussionsService],
    exports: [DiscussionsService],
})
export class DiscussionsModule { }
