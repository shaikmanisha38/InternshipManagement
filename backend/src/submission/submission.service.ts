import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubmissionService {
  private readonly logger = new Logger(SubmissionService.name);

  constructor(private readonly prisma: PrismaService) {}

  @OnEvent('ai.evaluation.completed')
  async handleAiEvaluationCompleted(payload: any) {
    try {
      this.logger.log(`Processing evaluated submission for commit: ${payload.commitHash}`);

      await this.prisma.$transaction(async (tx) => {
        // 1. Update the TaskSubmission record to APPROVED
        const submission = await tx.taskSubmission.updateMany({
          where: { commitHash: payload.commitHash, studentId: payload.studentId, taskId: payload.taskId },
          data: {
            status: 'APPROVED',
          }
        });

        if (submission.count === 0) {
          this.logger.warn(`Submission not found or already updated for commit ${payload.commitHash}`);
          return;
        }

        // 2. Find the relevant active StudentInternship
        // Assuming we need to update all ONGOING internships for this student. In reality, we might link submission to internship.
        const internships = await tx.studentInternship.findMany({
          where: { studentId: payload.studentId, status: 'ONGOING' }
        });

        // 3. Increment currentDay and progress
        for (const internship of internships) {
          await tx.studentInternship.update({
            where: { id: internship.id },
            data: {
              currentDay: internship.currentDay + 1,
              progress: internship.progress + 5.0 // Mock progress increment
            }
          });
          this.logger.log(`Updated StudentInternship ${internship.id}: currentDay unlocked to ${internship.currentDay + 1}`);
        }
      });

      this.logger.log(`Pipeline processing completed for commit: ${payload.commitHash}`);
    } catch (error) {
      this.logger.error('Failed to process AI evaluation completed event', error);
    }
  }
}
