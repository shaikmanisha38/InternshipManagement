import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StudentService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardSummary(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        leaderboard: true,
        studentBadges: { include: { badge: true } },
        githubAccounts: true,
        studentInternships: {
          where: { status: 'ONGOING' },
          include: { internship: true },
          take: 1
        },
        activityLogs: {
          orderBy: { createdAt: 'desc' },
          take: 4
        }
      }
    });

    if (!user) throw new NotFoundException('User not found');

    const activeInternship = user.studentInternships[0];
    let todaysTask = null;
    let completedTasksCount = 0;
    let totalTasksCount = 0;
    
    if (activeInternship) {
      // Get all tasks for this internship to calculate progress
      const allTasks = await this.prisma.task.findMany({
        where: { roadmapDay: { roadmap: { internshipId: activeInternship.internshipId } } }
      });
      totalTasksCount = allTasks.length;

      // Get completed tasks by this student
      const completedSubmissions = await this.prisma.taskSubmission.count({
        where: {
          studentId: userId,
          status: 'APPROVED',
          task: { roadmapDay: { roadmap: { internshipId: activeInternship.internshipId } } }
        }
      });
      completedTasksCount = completedSubmissions;

      // Find Today's Task (based on currentDay)
      const dayTasks = await this.prisma.task.findMany({
        where: {
          roadmapDay: { 
            roadmap: { internshipId: activeInternship.internshipId },
            dayNumber: activeInternship.currentDay 
          }
        },
        include: {
          submissions: {
            where: { studentId: userId }
          }
        }
      });
      
      if (dayTasks.length > 0) {
        todaysTask = dayTasks[0]; // Assuming 1 main task per day for simplicity
      }
    }

    // AI Feedback aggregate
    const aiEvaluations = await this.prisma.aIEvaluation.findMany({
      where: { submission: { studentId: userId } },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    const averageAiScore = aiEvaluations.length > 0 
      ? aiEvaluations.reduce((acc, curr) => acc + curr.score, 0) / aiEvaluations.length 
      : 0;

    const lastAiFeedback = aiEvaluations[0] || null;

    // Github Status
    const githubAccount = user.githubAccounts[0];
    let lastCommit = null;
    let lastSubmission = null;
    if (githubAccount) {
      lastSubmission = await this.prisma.taskSubmission.findFirst({
        where: { studentId: userId },
        orderBy: { submittedAt: 'desc' }
      });
      
      if (lastSubmission) {
        lastCommit = await this.prisma.githubCommit.findFirst({
          where: { submissionId: lastSubmission.id },
          orderBy: { commitTime: 'desc' }
        });
      }
    }

    // Latest Assessment
    const latestAssessment = await this.prisma.assessmentSubmission.findFirst({
      where: { studentId: userId },
      orderBy: { submittedAt: 'desc' },
      include: { assessment: true }
    });

    return {
      user: {
        name: user.name,
        profileImage: user.profileImage,
        rank: user.leaderboard?.rank || '-',
        points: user.leaderboard?.points || 0,
        streak: 12, // Mock streak for now
        badges: user.studentBadges.map(sb => ({
          id: sb.badge.id,
          name: sb.badge.badgeName,
          icon: sb.badge.description || '🎖️',
          points: sb.badge.points
        }))
      },
      internship: activeInternship ? {
        title: activeInternship.internship.title,
        technology: activeInternship.internship.technology,
        currentWeek: activeInternship.currentWeek,
        currentDay: activeInternship.currentDay,
        progress: {
          completed: completedTasksCount,
          total: totalTasksCount || 40,
          percent: totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0
        }
      } : null,
      weeklyAssessment: latestAssessment ? {
        title: latestAssessment.assessment.title,
        marks: latestAssessment.score,
        status: 'Completed'
      } : null,
      todaysTask: todaysTask ? {
        id: todaysTask.id,
        title: todaysTask.title,
        difficulty: todaysTask.difficulty,
        estimatedTime: todaysTask.estimatedTime,
        status: todaysTask.submissions.length > 0 ? todaysTask.submissions[0].status : 'PENDING',
      } : null,
      githubStatus: {
        isConnected: !!githubAccount,
        lastCommitTime: lastCommit ? lastCommit.commitTime : null,
        lastSubmissionStatus: lastSubmission ? lastSubmission.status : null
      },
      aiFeedback: {
        averageScore: Math.round(averageAiScore),
        lastFeedback: lastAiFeedback ? {
          strengths: lastAiFeedback.strengths ? lastAiFeedback.strengths.split(',') : [],
          weaknesses: lastAiFeedback.weaknesses ? lastAiFeedback.weaknesses.split(',') : []
        } : null
      },
      recentActivities: user.activityLogs.map(log => ({
        id: log.id,
        activity: log.activity,
        createdAt: log.createdAt
      }))
    };
  }

  async getStudentProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        college: true,
        department: true,
        year: true,
        profileImage: true,
        role: { select: { roleName: true } },
        githubAccounts: true,
        leaderboard: true,
        studentBadges: {
          include: { badge: true }
        }
      }
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async getStudentProgress(userId: string) {
    const activeInternship = await this.prisma.studentInternship.findFirst({
      where: { studentId: userId, status: 'ONGOING' },
      include: {
        internship: true
      }
    });

    if (!activeInternship) {
      return { message: 'No active internship found for progress tracking', progress: [] };
    }

    // Daily task completion metrics
    const submissions = await this.prisma.taskSubmission.findMany({
      where: { studentId: userId },
      include: {
        task: {
          include: { roadmapDay: true }
        },
        aiEvaluation: true
      },
      orderBy: { submittedAt: 'desc' }
    });

    // Weekly milestones / assessments
    const assessments = await this.prisma.assessmentSubmission.findMany({
      where: { studentId: userId },
      include: { assessment: true },
      orderBy: { submittedAt: 'desc' }
    });

    return {
      internshipTitle: activeInternship.internship.title,
      currentDay: activeInternship.currentDay,
      currentWeek: activeInternship.currentWeek,
      overallProgress: activeInternship.progress,
      taskSubmissions: submissions,
      weeklyAssessments: assessments
    };
  }
}
