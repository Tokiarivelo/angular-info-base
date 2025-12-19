import { z } from 'zod';
import { BaseEntity } from './shared.types';

// Quiz types and schemas

export interface Quiz extends BaseEntity {
  chapterId: string;
  title: string;
  description: string | null;
  passingScore: number;
  QuizQuestion: QuizQuestion[];
}

export interface QuizQuestion extends BaseEntity {
  quizId?: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string | null;
  order: number;
}

export interface QuizSubmission extends BaseEntity {
  quizId: string;
  userId: string;
  answers: number[];
  score: number;
  passed: boolean;
}

export interface QuizResults {
  score: number;
  passed: boolean;
  submission: QuizSubmission;
}

// Quiz state management
export interface QuizState {
  currentQuestion: number;
  answers: number[];
  showResults: boolean;
  results: QuizResults | null;
}
