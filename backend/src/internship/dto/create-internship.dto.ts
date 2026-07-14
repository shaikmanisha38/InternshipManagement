import { IsString, IsArray, IsInt, IsOptional, Min, IsEnum } from 'class-validator';
import { InternshipPostingStatus } from '@prisma/client';

export class CreateInternshipDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  duration: string;

  @IsString()
  technology: string;

  @IsString()
  difficulty: string;

  @IsOptional()
  @IsString()
  mentorId?: string;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  techStack?: string[];

  @IsOptional()
  @IsInt()
  @Min(1)
  maxCapacity?: number;

  @IsOptional()
  @IsEnum(InternshipPostingStatus)
  status?: InternshipPostingStatus;
}
