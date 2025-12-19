import {
  Quiz,
  QuizQuestion as QuizQuestionType,
  QuizResults as QuizResultsType,
} from '@/types/quiz.types';

export interface QuizTakerProps {
  quiz: Quiz & { QuizQuestion: QuizQuestionType[] };
  onComplete?: () => void;
}

export interface QuizQuestionProps {
  question: QuizQuestionType;
  questionIndex: number;
  selectedAnswer: number;
  onAnswerSelect: (index: number) => void;
}

export interface QuizResultsProps {
  results: QuizResultsType;
  passingScore: number;
  questions: QuizQuestionType[];
  answers: number[];
  onRetake: () => void;
}

export interface QuizProgressProps {
  current: number;
  total: number;
}
