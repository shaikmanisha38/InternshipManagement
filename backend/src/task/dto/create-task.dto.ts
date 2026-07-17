import { IsString, IsNotEmpty, IsEnum, IsDateString, IsOptional } from 'class-validator';

export enum TaskDifficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(TaskDifficulty)
  @IsNotEmpty()
  difficulty: TaskDifficulty;

  @IsDateString()
  @IsNotEmpty()
  deadline: string;

  @IsString()
  @IsOptional()
  roadmapDayId?: string;

  @IsOptional()
  resourceLinks?: any;
}
