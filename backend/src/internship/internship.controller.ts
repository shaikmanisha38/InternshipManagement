import { Controller, Get, Post, Body, Query, UseGuards, Request } from '@nestjs/common';
import { InternshipService } from './internship.service';
import { CreateInternshipDto } from './dto/create-internship.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { InternshipPostingStatus } from '@prisma/client';

@Controller('internships')
export class InternshipController {
  constructor(private readonly internshipService: InternshipService) {}

  @Get()
  async getInternships(
    @Query('technology') technology?: string,
    @Query('status') status?: InternshipPostingStatus
  ) {
    return this.internshipService.findAll(technology, status);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createInternship(@Body() createInternshipDto: CreateInternshipDto) {
    return this.internshipService.create(createInternshipDto);
  }

  @Post('assign')
  @UseGuards(JwtAuthGuard)
  async assignInternships() {
    return this.internshipService.assignStudentsToInternships();
  }

  @Get('current')
  @UseGuards(JwtAuthGuard)
  async getCurrentInternship(@Request() req: any) {
    return this.internshipService.getCurrentInternship(req.user.userId);
  }
}
