import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class GithubService {
  private readonly logger = new Logger(GithubService.name);

  constructor(private eventEmitter: EventEmitter2) {}

  processWebhook(payload: any) {
    try {
      this.logger.log(`Received GitHub webhook with commitHash: ${payload.commitHash}`);
      
      // Emit event for AI module to pick up
      this.eventEmitter.emit('github.commit.received', {
        commitHash: payload.commitHash,
        taskId: payload.taskId,
        studentId: payload.studentId,
        repoUrl: payload.repoUrl
      });
      
      return { status: 'Webhook received and processing started' };
    } catch (error) {
      this.logger.error('Failed to process GitHub webhook', error);
      throw error;
    }
  }
}
