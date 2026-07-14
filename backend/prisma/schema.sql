-- PostgreSQL DDL Script
-- Generated for Internship Management Database

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================================
-- ENUMS
-- =========================================================================
CREATE TYPE "RoleName" AS ENUM ('STUDENT', 'MENTOR', 'ADMIN');
CREATE TYPE "InternshipStatus" AS ENUM ('ONGOING', 'COMPLETED', 'DROPPED');
CREATE TYPE "ResourceType" AS ENUM ('PDF', 'VIDEO', 'GITHUB', 'DOC');
CREATE TYPE "SubmissionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE "QuestionType" AS ENUM ('MCQ', 'CODING');

-- =========================================================================
-- TRIGGERS
-- =========================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =========================================================================
-- TABLES (Ordered by Dependencies)
-- =========================================================================

-- 1. Roles
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "roleName" "RoleName" NOT NULL UNIQUE
);

-- 2. Badges
CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "badgeName" VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    points INTEGER NOT NULL DEFAULT 0
);

-- 3. Assessments
CREATE TABLE assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    week INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    "passingMarks" DECIMAL NOT NULL
);

-- 4. Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    "roleId" UUID NOT NULL,
    phone VARCHAR(50),
    college VARCHAR(255),
    department VARCHAR(255),
    year INTEGER,
    "profileImage" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_role FOREIGN KEY ("roleId") REFERENCES roles(id) ON DELETE RESTRICT
);

CREATE TRIGGER set_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 5. Internships
CREATE TABLE internships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    duration VARCHAR(100) NOT NULL,
    technology VARCHAR(255) NOT NULL,
    difficulty VARCHAR(100) NOT NULL,
    "mentorId" UUID NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_internship_mentor FOREIGN KEY ("mentorId") REFERENCES users(id) ON DELETE CASCADE
);

-- 6. StudentInternships
CREATE TABLE student_internships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "studentId" UUID NOT NULL,
    "internshipId" UUID NOT NULL,
    "startDate" TIMESTAMP WITH TIME ZONE NOT NULL,
    "endDate" TIMESTAMP WITH TIME ZONE,
    "currentWeek" INTEGER DEFAULT 1,
    "currentDay" INTEGER DEFAULT 1,
    progress DECIMAL DEFAULT 0.0,
    status "InternshipStatus" DEFAULT 'ONGOING',
    CONSTRAINT fk_student_internship_student FOREIGN KEY ("studentId") REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_student_internship_internship FOREIGN KEY ("internshipId") REFERENCES internships(id) ON DELETE CASCADE
);

-- 7. Roadmaps
CREATE TABLE roadmaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "internshipId" UUID NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    CONSTRAINT fk_roadmap_internship FOREIGN KEY ("internshipId") REFERENCES internships(id) ON DELETE CASCADE
);

-- 8. RoadmapDays
CREATE TABLE roadmap_days (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "roadmapId" UUID NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    CONSTRAINT fk_roadmap_day_roadmap FOREIGN KEY ("roadmapId") REFERENCES roadmaps(id) ON DELETE CASCADE
);

-- 9. Tasks
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "roadmapDayId" UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    difficulty VARCHAR(100) NOT NULL,
    "estimatedTime" VARCHAR(100),
    "unlockOrder" INTEGER DEFAULT 0,
    "passingScore" DECIMAL,
    CONSTRAINT fk_task_roadmap_day FOREIGN KEY ("roadmapDayId") REFERENCES roadmap_days(id) ON DELETE CASCADE
);

-- 10. TaskResources
CREATE TABLE task_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "taskId" UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    type "ResourceType" NOT NULL,
    url TEXT NOT NULL,
    CONSTRAINT fk_task_resource_task FOREIGN KEY ("taskId") REFERENCES tasks(id) ON DELETE CASCADE
);

-- 11. TaskSubmissions
CREATE TABLE task_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "studentId" UUID NOT NULL,
    "taskId" UUID NOT NULL,
    "repositoryUrl" TEXT,
    branch VARCHAR(255),
    "commitHash" VARCHAR(255),
    "submittedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status "SubmissionStatus" DEFAULT 'PENDING',
    CONSTRAINT fk_task_submission_student FOREIGN KEY ("studentId") REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_task_submission_task FOREIGN KEY ("taskId") REFERENCES tasks(id) ON DELETE CASCADE
);

-- 12. GithubAccounts
CREATE TABLE github_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "studentId" UUID NOT NULL,
    "githubId" VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(255) NOT NULL,
    "accessToken" TEXT,
    repository TEXT,
    CONSTRAINT fk_github_account_student FOREIGN KEY ("studentId") REFERENCES users(id) ON DELETE CASCADE
);

-- 13. GithubCommits
CREATE TABLE github_commits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "submissionId" UUID NOT NULL,
    "commitHash" VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    branch VARCHAR(255),
    "commitTime" TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT fk_github_commit_submission FOREIGN KEY ("submissionId") REFERENCES task_submissions(id) ON DELETE CASCADE
);

-- 14. AIEvaluations
CREATE TABLE ai_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "submissionId" UUID NOT NULL UNIQUE,
    score DECIMAL NOT NULL,
    "codeQuality" DECIMAL,
    readability DECIMAL,
    documentation DECIMAL,
    feedback TEXT,
    strengths TEXT,
    weaknesses TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ai_evaluation_submission FOREIGN KEY ("submissionId") REFERENCES task_submissions(id) ON DELETE CASCADE
);

-- 15. AssessmentQuestions
CREATE TABLE assessment_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "assessmentId" UUID NOT NULL,
    question TEXT NOT NULL,
    type "QuestionType" NOT NULL,
    options JSONB,
    answer TEXT NOT NULL,
    CONSTRAINT fk_assessment_question_assessment FOREIGN KEY ("assessmentId") REFERENCES assessments(id) ON DELETE CASCADE
);

-- 16. AssessmentSubmissions
CREATE TABLE assessment_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "assessmentId" UUID NOT NULL,
    "studentId" UUID NOT NULL,
    score DECIMAL NOT NULL,
    "submittedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_assessment_submission_assessment FOREIGN KEY ("assessmentId") REFERENCES assessments(id) ON DELETE CASCADE,
    CONSTRAINT fk_assessment_submission_student FOREIGN KEY ("studentId") REFERENCES users(id) ON DELETE CASCADE
);

-- 17. Attendance
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "studentId" UUID NOT NULL,
    "loginTime" TIMESTAMP WITH TIME ZONE NOT NULL,
    "logoutTime" TIMESTAMP WITH TIME ZONE,
    "hoursSpent" DECIMAL,
    date DATE NOT NULL,
    CONSTRAINT fk_attendance_student FOREIGN KEY ("studentId") REFERENCES users(id) ON DELETE CASCADE
);

-- 18. Certificates
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "studentId" UUID NOT NULL UNIQUE,
    "certificateNumber" VARCHAR(255) NOT NULL UNIQUE,
    "certificateUrl" TEXT NOT NULL,
    "issuedDate" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "finalScore" DECIMAL NOT NULL,
    CONSTRAINT fk_certificate_student FOREIGN KEY ("studentId") REFERENCES users(id) ON DELETE CASCADE
);

-- 19. StudentBadges
CREATE TABLE student_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "studentId" UUID NOT NULL,
    "badgeId" UUID NOT NULL,
    "earnedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_student_badge_student FOREIGN KEY ("studentId") REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_student_badge_badge FOREIGN KEY ("badgeId") REFERENCES badges(id) ON DELETE CASCADE
);

-- 20. Leaderboard
CREATE TABLE leaderboard (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "studentId" UUID NOT NULL UNIQUE,
    points INTEGER DEFAULT 0,
    rank INTEGER,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_leaderboard_student FOREIGN KEY ("studentId") REFERENCES users(id) ON DELETE CASCADE
);

CREATE TRIGGER set_leaderboard_updated_at
BEFORE UPDATE ON leaderboard
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 21. Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    "isRead" BOOLEAN DEFAULT FALSE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notification_user FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

-- 22. ActivityLogs
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    activity TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_activity_log_user FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);
