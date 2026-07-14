import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoadmapService {
  constructor(private prisma: PrismaService) {}

  /**
   * Endpoint 1: GET /roadmaps/current
   * Fetch the overarching roadmap/internship for the active student.
   */
  async getCurrentRoadmap(userId: string) {
    const studentInternship = await this.prisma.studentInternship.findFirst({
      where: { studentId: userId, status: 'ONGOING' },
      include: {
        internship: {
          include: {
            roadmaps: {
              orderBy: { weekNumber: 'asc' },
              select: {
                id: true,
                weekNumber: true,
                title: true,
                description: true
              }
            }
          }
        }
      }
    });

    if (!studentInternship) {
      throw new NotFoundException('No active roadmap/internship found for this student.');
    }

    const { internship } = studentInternship;

    // Return the overarching structure combining Internship (the track) and its weeks
    return {
      id: internship.id,
      title: internship.title,
      description: internship.description,
      total_weeks: internship.roadmaps.length,
      tech_stack: internship.techStack,
      created_at: internship.createdAt,
      weeks: internship.roadmaps, // High-level summary of weeks
    };
  }

  /**
   * Endpoint 2: GET /roadmaps/week/:trackId?weekNumber=X
   * Fetch a complete breakdown of all days within a specific week for a given roadmap track.
   */
  async getWeekDetails(trackId: string, weekNumber?: number) {
    if (!weekNumber) {
      throw new BadRequestException('weekNumber query parameter is required');
    }

    const weekNumberInt = parseInt(weekNumber as any, 10);
    if (isNaN(weekNumberInt)) {
      throw new BadRequestException('weekNumber must be a valid integer');
    }

    // First find the specific Roadmap (Week) for this track
    const roadmapWeek = await this.prisma.roadmap.findFirst({
      where: {
        internshipId: trackId,
        weekNumber: weekNumberInt,
      }
    });

    if (!roadmapWeek) {
      throw new NotFoundException(`Week ${weekNumberInt} not found in this roadmap track.`);
    }

    // STRICT SEQUENCE SORTING: Fetch RoadmapDays explicitly sorted by dayNumber
    const days = await this.prisma.roadmapDay.findMany({
      where: { roadmapId: roadmapWeek.id },
      orderBy: { dayNumber: 'asc' },
    });

    return {
      week: roadmapWeek,
      days: days
    };
  }

  /**
   * Endpoint 3: GET /roadmaps/day/:dayId
   * Fetch granular details, tasks, and learning resources for a specific day.
   */
  async getDayDetails(dayId: string) {
    const day = await this.prisma.roadmapDay.findUnique({
      where: { id: dayId },
      include: {
        tasks: {
          orderBy: { unlockOrder: 'asc' },
          include: {
            resources: true,
          }
        }
      }
    });

    if (!day) {
      throw new NotFoundException('Roadmap Day not found.');
    }

    return day;
  }
}
