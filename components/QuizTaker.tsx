'use client';

import { useState, useTransition } from 'react';
import { submitQuiz } from '@/lib/actions';
import { Quiz, QuizQuestion } from '@prisma/client';

interface QuizTakerProps {
  quiz: Quiz & { questions: QuizQuestion[] };
  onComplete?: () => void;
}

export default function QuizTaker({ quiz, onComplete }: QuizTakerProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(
    new Array(quiz.questions.length).fill(-1)
  );
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<{
    score: number;
    passed: boolean;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  const sortedQuestions = quiz.questions.sort((a, b) => a.order - b.order);
  const question = sortedQuestions[currentQuestion];
  const isLastQuestion = currentQuestion === sortedQuestions.length - 1;
  const isFirstQuestion = currentQuestion === 0;
  const hasAnswered = answers[currentQuestion] !== -1;

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmit();
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    startTransition(async () => {
      try {
        const { submission } = await submitQuiz(quiz.id, answers);
        setResults({
          score: submission.score,
          passed: submission.passed,
        });
        setShowResults(true);
        if (onComplete) {
          onComplete();
        }
      } catch (error) {
        console.error('Failed to submit quiz:', error);
      }
    });
  };

  const handleRetake = () => {
    setCurrentQuestion(0);
    setAnswers(new Array(quiz.questions.length).fill(-1));
    setShowResults(false);
    setResults(null);
  };

  if (showResults && results) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Quiz Results</h3>
        <div className="mb-6">
          <div className="flex items-center justify-center mb-4">
            <div
              className={`text-6xl font-bold ${
                results.passed ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {results.score}%
            </div>
          </div>
          <div className="text-center">
            {results.passed ? (
              <div className="text-green-600 font-semibold text-lg">
                🎉 Congratulations! You passed!
              </div>
            ) : (
              <div className="text-red-600 font-semibold text-lg">
                You didn&apos;t pass this time. (Required: {quiz.passingScore}
                %)
              </div>
            )}
          </div>
        </div>
        <div className="space-y-4">
          {sortedQuestions.map((q, index) => {
            const userAnswer = answers[index];
            const isCorrect = userAnswer === q.correctAnswer;
            return (
              <div
                key={q.id}
                className={`p-4 border rounded-lg ${
                  isCorrect
                    ? 'border-green-300 bg-green-50'
                    : 'border-red-300 bg-red-50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="font-medium text-gray-900">
                    Question {index + 1}
                  </div>
                  {isCorrect ? (
                    <span className="text-green-600 font-semibold">✓</span>
                  ) : (
                    <span className="text-red-600 font-semibold">✗</span>
                  )}
                </div>
                <div className="text-gray-700 mb-2">{q.question}</div>
                <div className="space-y-1 text-sm">
                  <div>
                    Your answer:{' '}
                    <span className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                      {q.options[userAnswer]}
                    </span>
                  </div>
                  {!isCorrect && (
                    <div>
                      Correct answer:{' '}
                      <span className="text-green-700">
                        {q.options[q.correctAnswer]}
                      </span>
                    </div>
                  )}
                  {q.explanation && (
                    <div className="mt-2 text-gray-600 italic">
                      {q.explanation}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleRetake}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">{quiz.title}</h3>
          <div className="text-sm text-gray-600">
            Question {currentQuestion + 1} of {sortedQuestions.length}
          </div>
        </div>
        {quiz.description && (
          <p className="text-gray-600 text-sm mb-4">{quiz.description}</p>
        )}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{
              width: `${((currentQuestion + 1) / sortedQuestions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          {question.question}
        </h4>
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <label
              key={index}
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                answers[currentQuestion] === index
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name={`question-${currentQuestion}`}
                value={index}
                checked={answers[currentQuestion] === index}
                onChange={() => handleAnswerSelect(index)}
                className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-3 text-gray-900">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={isFirstQuestion}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <div className="text-sm text-gray-600">
          {answers.filter((a) => a !== -1).length} of {sortedQuestions.length}{' '}
          answered
        </div>
        <button
          onClick={handleNext}
          disabled={!hasAnswered || isPending}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending
            ? 'Submitting...'
            : isLastQuestion
              ? 'Submit Quiz'
              : 'Next'}
        </button>
      </div>
    </div>
  );
}
