import { Injectable, Logger } from '@nestjs/common';
import { OnEvent, EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(private eventEmitter: EventEmitter2) {}

  @OnEvent('github.commit.received')
  async handleGithubCommitReceived(payload: any) {
    try {
      this.logger.log(`Evaluating commit hash: ${payload.commitHash}`);
      
      // Mocking AI Evaluation Delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const score = Math.floor(Math.random() * (100 - 60 + 1) + 60); // Random score between 60-100
      const feedback = score > 80 ? 'Excellent structural layout.' : 'Needs minor improvements.';
      
      this.logger.log(`Evaluation complete. Score: ${score}`);

      // Emit evaluation results
      this.eventEmitter.emit('ai.evaluation.completed', {
        commitHash: payload.commitHash,
        taskId: payload.taskId,
        studentId: payload.studentId,
        score,
        feedback
      });

    } catch (error) {
      this.logger.error('Error during AI evaluation', error);
    }
  }
}
