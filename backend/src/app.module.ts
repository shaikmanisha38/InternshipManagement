import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { GithubModule } from './github/github.module';
import { CertificateModule } from './certificate/certificate.module';
import { StudentModule } from './student/student.module';
import { AttendanceModule } from './attendance/attendance.module';
import { AssessmentModule } from './assessment/assessment.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { MentorModule } from './mentor/mentor.module';
import { AdminModule } from './admin/admin.module';
import { InternshipModule } from './internship/internship.module';
import { RoadmapModule } from './roadmap/roadmap.module';
import { TaskModule } from './task/task.module';
import { SubmissionModule } from './submission/submission.module';
import { AiModule } from './ai/ai.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    PrismaModule,
    HealthModule,
    AuthModule, 
    GithubModule, 
    CertificateModule, 
    StudentModule, 
    AttendanceModule, 
    AssessmentModule, 
    AnalyticsModule, 
    MentorModule,
    AdminModule,
    InternshipModule,
    RoadmapModule,
    TaskModule,
    SubmissionModule,
    AiModule,
    LeaderboardModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
