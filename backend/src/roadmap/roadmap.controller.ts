import { Controller, Get, Param, Query, UseGuards, Req } from '@nestjs/common';
import { RoadmapService } from './roadmap.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('roadmap')
@UseGuards(JwtAuthGuard)
export class RoadmapController {
  constructor(private readonly roadmapService: RoadmapService) {}

  @Get('current')
  async getCurrentRoadmap(@Req() req: any) {
    const userId = req.user.id;
    return this.roadmapService.getCurrentRoadmap(userId);
  }

  @Get('week/:trackId')
  async getWeekDetails(
    @Param('trackId') trackId: string,
    @Query('weekNumber') weekNumber: string,
  ) {
    // The prompt specifies: "URL parameter or Query parameter should specify the week_number"
    // We use query param ?weekNumber=X and pass it down
    return this.roadmapService.getWeekDetails(trackId, parseInt(weekNumber, 10));
  }

  @Get('day/:dayId')
  async getDayDetails(@Param('dayId') dayId: string) {
    return this.roadmapService.getDayDetails(dayId);
  }
}
