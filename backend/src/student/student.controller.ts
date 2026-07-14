import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { StudentService } from './student.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('student')
@UseGuards(JwtAuthGuard)
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get('dashboard/summary')
  getDashboardSummary(@Request() req: any) {
    // req.user is set by the JwtAuthGuard
    return this.studentService.getDashboardSummary(req.user.userId);
  }

  @Get('me')
  getStudentProfile(@Request() req: any) {
    return this.studentService.getStudentProfile(req.user.userId);
  }

  @Get('progress')
  getStudentProgress(@Request() req: any) {
    return this.studentService.getStudentProgress(req.user.userId);
  }
}
