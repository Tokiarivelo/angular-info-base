import { useState, useMemo } from 'react';
import { Quiz, QuizQuestion, QuizResults } from '@/types/quiz.types';
import { submitQuiz } from '@/lib/actions';
import { useFormSubmit } from '@/components/shared/hooks';

/**
 * Hook for managing quiz state and navigation
 */
export function useQuizState(quiz: Quiz & { QuizQuestion: QuizQuestion[] }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(
    new Array(quiz.QuizQuestion.length).fill(-1)
  );
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<QuizResults | null>(null);

  const sortedQuestions = useMemo(
    () => quiz.QuizQuestion.sort((a, b) => a.order - b.order),
    [quiz.QuizQuestion]
  );

  const isLastQuestion = currentQuestion === sortedQuestions.length - 1;
  const isFirstQuestion = currentQuestion === 0;
  const hasAnswered = answers[currentQuestion] !== -1;

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleRetake = () => {
    setCurrentQuestion(0);
    setAnswers(new Array(quiz.QuizQuestion.length).fill(-1));
    setShowResults(false);
    setResults(null);
  };

  return {
    currentQuestion,
    answers,
    showResults,
    results,
    sortedQuestions,
    isLastQuestion,
    isFirstQuestion,
    hasAnswered,
    handleAnswerSelect,
    handleNext,
    handlePrevious,
    handleRetake,
    setShowResults,
    setResults,
  };
}

/**
 * Hook for handling quiz submission
 */
export function useQuizSubmission(quizId: string, onComplete?: () => void) {
  const { isPending, handleSubmit } = useFormSubmit<QuizResults>();

  const submitQuizAnswers = async (
    answers: number[],
    onSuccess: (results: QuizResults) => void
  ) => {
    await handleSubmit(
      async () => {
        const result = await submitQuiz(quizId, answers);
        // Extract score and passed from the submission object
        const quizResults: QuizResults = {
          score: result.submission.score,
          passed: result.submission.passed,
          submission: result.submission,
        };
        return quizResults;
      },
      (results: QuizResults) => {
        onSuccess(results);
        if (onComplete) {
          onComplete();
        }
      }
    );
  };

  return {
    submitQuizAnswers,
    isPending,
  };
}
