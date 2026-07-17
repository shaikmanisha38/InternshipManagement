import { IsString, IsEnum, IsDateString, IsOptional, IsBoolean } from 'class-validator';
import { TaskDifficulty } from './create-task.dto';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskDifficulty)
  @IsOptional()
  difficulty?: TaskDifficulty;

  @IsDateString()
  @IsOptional()
  deadline?: string;

  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean;

  @IsOptional()
  resourceLinks?: any;
}
