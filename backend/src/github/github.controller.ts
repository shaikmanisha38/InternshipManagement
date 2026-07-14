import { Controller, Post, Body } from '@nestjs/common';
import { GithubService } from './github.service';

@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Post('webhook')
  handleWebhook(@Body() payload: any) {
    return this.githubService.processWebhook(payload);
  }
}
