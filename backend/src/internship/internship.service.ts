import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInternshipDto } from './dto/create-internship.dto';
import { InternshipPostingStatus } from '@prisma/client';

@Injectable()
export class InternshipService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(technology?: string, status?: InternshipPostingStatus) {
    const where: any = {};
    if (technology) {
      where.OR = [
        { technology: { contains: technology, mode: 'insensitive' } },
        { techStack: { has: technology } }
      ];
    }
    if (status) {
      where.status = status;
    }
    return this.prisma.internship.findMany({
      where,
      include: { mentor: { select: { name: true, email: true } } }
    });
  }

  async create(createInternshipDto: CreateInternshipDto) {
    if (createInternshipDto.mentorId) {
      const mentor = await this.prisma.user.findUnique({
        where: { id: createInternshipDto.mentorId },
        include: { role: true }
      });
      if (!mentor || mentor.role.roleName !== 'MENTOR') {
        throw new NotFoundException('Mentor not found or invalid role');
      }
    }
    
    return this.prisma.internship.create({
      data: createInternshipDto
    });
  }

  async getCurrentInternship(userId: string) {
    const internship = await this.prisma.studentInternship.findFirst({
      where: { studentId: userId, status: 'ONGOING' },
      include: { 
        internship: {
          include: {
            mentor: true
          }
        } 
      }
    });
    if (!internship) throw new NotFoundException('No active internship found for this user');
    return internship;
  }

  async assignStudentsToInternships() {
    // Run everything in an interactive transaction to prevent race conditions
    return this.prisma.$transaction(async (tx) => {
      // 1. Fetch all OPEN internships with their current ONGOING student count
      const openInternships = await tx.internship.findMany({
        where: { status: 'OPEN' },
        include: { 
          _count: { 
            select: { studentInternships: { where: { status: 'ONGOING' } } } 
          } 
        }
      });

      if (openInternships.length === 0) {
        return { message: 'No open internships available', assignedCount: 0 };
      }

      // 2. Fetch unassigned students (students without an ONGOING internship)
      const students = await tx.user.findMany({
        where: {
          role: { roleName: 'STUDENT' },
          studentInternships: { none: { status: 'ONGOING' } }
        }
      });

      let assignedCount = 0;
      const assignments: any[] = [];
      let studentIndex = 0;

      // 3. Assign students iteratively until capacity is met
      for (const internship of openInternships) {
        let currentCapacity = internship._count.studentInternships;
        const maxCapacity = internship.maxCapacity;

        while (currentCapacity < maxCapacity && studentIndex < students.length) {
          const student = students[studentIndex];
          
          assignments.push({
            studentId: student.id,
            internshipId: internship.id,
            startDate: new Date(),
            status: 'ONGOING'
          });
          
          currentCapacity++;
          studentIndex++;
          assignedCount++;
        }

        // 4. Check if internship is now filled and flip status
        if (currentCapacity >= maxCapacity) {
          await tx.internship.update({
            where: { id: internship.id },
            data: { status: 'FILLED' }
          });
        }
      }

      // 5. Bulk insert new assignments
      if (assignments.length > 0) {
        await tx.studentInternship.createMany({
          data: assignments
        });
      }

      return { message: 'Auto-assignment completed successfully', assignedCount };
    });
  }
}
