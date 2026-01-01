import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { CourseModule } from './courses/course.module';
import { EnrollmentModule } from './enrollments/enrollment.module';
import { CartModule } from './cart/cart.module';
import { CouponModule } from './coupons/coupon.module';
import { TenantMiddleware } from './common/tenant/tenant.middleware';
import { TenantModule } from './tenants/tenant.module';
import { ReviewModule } from './courses/reviews/review.module';
import { DiscussionsModule } from './discussions/discussions.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    CommonModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    CourseModule,
    EnrollmentModule,
    CartModule,
    CouponModule,
    TenantModule,
    ReviewModule,
    DiscussionsModule,
    NotificationsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}
