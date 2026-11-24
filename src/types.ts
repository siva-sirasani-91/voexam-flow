/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum ExamType {
  MCQ = 'mcq',
  DESCRIPTIVE = 'descriptive'
}

export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export enum Role {
  STUDENT = 'student',
  ADMIN = 'admin'
}

export interface Question {
  id: string;
  text: string;
  options?: string[]; // For MCQ
  correctAnswer?: string | number; // Index or string
  explanation?: string;
  points: number;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  type: ExamType;
  difficulty: Difficulty;
  durationMinutes: number;
  questions: Question[];
  createdAt: number;
  createdBy: string;
}

export interface UserAnswer {
  questionId: string;
  answer: string | number;
  isCorrect?: boolean;
}

export interface ExamResult {
  id: string;
  examId: string;
  studentId: string;
  answers: UserAnswer[];
  score: number;
  totalPoints: number;
  percentage: number;
  timeSpentSeconds: number;
  completedAt: number;
  aiAnalysis?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: Role;
  preferences: {
    accessibilityMode: 'none' | 'visual' | 'physical' | 'speech';
    highContrast: boolean;
    largeFont: boolean;
    speechSpeed: number;
    speechPitch: number;
    voiceName?: string;
  };
  stats: {
    totalExams: number;
    averageScore: number;
    streakDays: number;
  };
}
